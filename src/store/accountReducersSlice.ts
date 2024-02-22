// accountReducersSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  getAccounts,
  createAccount as createAccountAPI,
  editAccount as editAccountAPI,
  deleteAccountAPI,
  transferBalance as transferBalanceAPI,
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

export const transferBalance = createAsyncThunk<
  { fromAccountId: string; toAccountId: string; amount: number },
  {
    fromAccountId: string;
    toAccountId: string;
    amount: number;
    initialAccounts: Account[];
  },
  {
    state: RootState;
    rejectValue: string;
  }
>(
  "account/transferBalance",
  async (
    { fromAccountId, toAccountId, amount, initialAccounts },
    { getState, rejectWithValue }
  ) => {
    try {
      const accounts = initialAccounts; // Using the passed initialAccounts directly

      const fromAccountIndex = accounts.findIndex(
        (account) => account.id === fromAccountId
      );
      const toAccountIndex = accounts.findIndex(
        (account) => account.id === toAccountId
      );

      if (fromAccountIndex === -1 || toAccountIndex === -1) {
        throw new Error("Accounts not found");
      }

      if (accounts[fromAccountIndex].balance < amount) {
        throw new Error("Insufficient balance");
      }

      // Call the API to perform the balance transfer
      await transferBalanceAPI(
        fromAccountId,
        toAccountId,
        amount,
        initialAccounts
      );

      // Return the transfer details
      return { fromAccountId, toAccountId, amount };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
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
      })
      // Transfer balance
      .addCase(transferBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "pending";
      })
      .addCase(transferBalance.fulfilled, (state, action) => {
        state.loading = false;
        const { fromAccountId, toAccountId, amount } = action.payload;
        state.accounts = state.accounts.map((account) => {
          if (account.id === fromAccountId) {
            return { ...account, balance: account.balance - amount };
          } else if (account.id === toAccountId) {
            return { ...account, balance: account.balance + amount };
          }
          return account;
        });
        state.status = "fulfilled";
      })
      .addCase(transferBalance.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ??
          "An error occurred while transferring balance";
        state.status = "rejected";
      });
  },
});

export default accountSlice.reducer;

// Exporting action creators
export const accountActions = accountSlice.actions;
