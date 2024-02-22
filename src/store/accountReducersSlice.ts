// accountReducersSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  getAccounts,
  createAccount as createAccountAPI,
  editAccount as editAccountAPI,
  deleteAccountAPI,
} from "../services/accountServices";
import { Account } from "../types/types";
import { RootState } from "./store";

interface AccountState {
  accounts: Account[];
  loading: boolean;
  error: string | null;
  status: string;
}

const initialState: AccountState = {
  accounts: [],
  loading: false,
  error: null,
  status: "init", // Initialize status
};

// Redux Thunks
// Fetch accounts
export const fetchAccounts = createAsyncThunk(
  "account/fetchAccounts",
  async () => {
    return await getAccounts();
  }
);

// Create account
export const createAccount = createAsyncThunk(
  "account/createAccount",
  async (newAccount: Partial<Account>) => {
    return await createAccountAPI(newAccount as Account);
  }
);

// Edit account
export const editAccount = createAsyncThunk(
  "account/editAccount",
  async (
    {
      accountId,
      updatedAccount,
    }: { accountId: string; updatedAccount: Partial<Account> },
    { getState }
  ) => {
    console.log("Editing account:", accountId, updatedAccount);
    const stateAccount = (getState() as RootState).account.accounts;
    return await editAccountAPI(accountId, updatedAccount, stateAccount);
  }
);

// Delete account
export const deleteAccount = createAsyncThunk<void, string>(
  "account/deleteAccount",
  async (accountId: string) => {
    console.log("thunk" + accountId);
    try {
      await deleteAccountAPI(accountId);
    } catch (error) {
      console.error("Error deleting account:", error);
      throw error;
    }
  }
);

// Transfer balance
// Transfer balance
export const transferBalance = createAsyncThunk<
  void,
  { fromAccountId: string; toAccountId: string; amount: number }
>(
  "account/transferBalance",
  async ({ fromAccountId, toAccountId, amount }) => {
    // Fetch accounts INCORECT NOW!!!! COULD BE CHANGE TO ACCOUNTS WITH STATE!!!!
    const accounts = await getAccounts();

    // Find the accounts to transfer from and to
    const fromAccount = accounts.find((account) => account.id === fromAccountId);
    const toAccount = accounts.find((account) => account.id === toAccountId);

    if (!fromAccount || !toAccount) {
      throw new Error("Accounts not found");
    }

    // Check if there's enough balance in the 'from' account
    if (fromAccount.balance < amount) {
      throw new Error("Insufficient balance");
    }

    // Update the balances
    const updatedFromAccount = { ...fromAccount, balance: fromAccount.balance - amount };
    const updatedToAccount = { ...toAccount, balance: toAccount.balance + amount };

    // Update the accounts in the backend
    await editAccountAPI(fromAccountId, updatedFromAccount, accounts);
    await editAccountAPI(toAccountId, updatedToAccount, accounts);
  }
);

// Redux Slice
const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch accounts
      .addCase(fetchAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "pending";
      })
      .addCase(
        fetchAccounts.fulfilled,
        (state, action: PayloadAction<Account[]>) => {
          state.loading = false;
          state.accounts = action.payload;
          state.status = "fulfilled";
        }
      )
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ?? "An error occurred while fetching accounts";
        state.status = "rejected";
      })
      // Create account
      .addCase(createAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "pending";
      })
      .addCase(
        createAccount.fulfilled,
        (state, action: PayloadAction<Account>) => {
          const newAccount = action.payload;
          console.log(`CreateAccount: ${newAccount}`);
          // Update the state by adding the new account to the accounts array
          state.accounts = [...state.accounts, newAccount];
          state.loading = false;
          state.error = null;
          state.status = "fulfilled";
        }
      )
      .addCase(createAccount.rejected, (state, action) => {
        state.error =
          action.error.message ??
          "An error occurred while creating the account";
        state.status = "rejected";
      })
      // Edit account
      .addCase(
        editAccount.fulfilled,
        (state, action: PayloadAction<Account>) => {
          const updatedAccount = action.payload;
          console.log(updatedAccount);
          // Find the index of the updated account in the accounts array
          const index = state.accounts.findIndex(
            (account) => account.id === updatedAccount.id
          );
          if (index !== -1) {
            // If the account exists, update it with the updated account
            state.accounts[index] = updatedAccount;
          }
        }
      )
      .addCase(editAccount.rejected, (state, action) => {
        state.error =
          action.error.message ?? "An error occurred while editing the account";
      })
      // Delete account
      .addCase(deleteAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "pending";
      })
      .addCase(deleteAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const accountId = action.meta.arg; // Get the accountId from action.meta
        state.accounts = state.accounts.filter(
          (account) => account.id !== accountId
        );
        state.status = "fulfilled";
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.error =
          action.error.message ??
          "An error occurred while deleting the account";
        state.status = "rejected";
      });
      
  },
});

export default accountSlice.reducer;

// Exporting action creators
export const accountActions = accountSlice.actions;
