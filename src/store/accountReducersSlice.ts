// accountReducersSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  getAccounts,
  createAccount as createAccountAPI,
  editAccount as editAccountAPI,
  deleteAccountAPI,
} from "../services/accountServices";
import { Account } from "../types/types";

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
  status: 'init', // Initialize status
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
  async ({ accountId, updatedAccount }: { accountId: string; updatedAccount: Partial<Account> }) => {
    return await editAccountAPI(accountId, updatedAccount);
  }
);

// Delete account
export const deleteAccount = createAsyncThunk<void, string>(
  "account/deleteAccount",
  async (accountId: string) => {
    console.log('thunk' + accountId)
    try {
      await deleteAccountAPI(accountId);
 
    } catch (error) {
      console.error("Error deleting account:", error);
      throw error;
    }
  }
);

// Transfer balance
export const transferBalance = createAsyncThunk<
  void,
  { fromAccountId: string; toAccountId: string; amount: number }
>(
  "account/transferBalance",
  async ({ fromAccountId, toAccountId, amount }) => {}
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
        state.status = 'pending';
      })
      .addCase(
        fetchAccounts.fulfilled,
        (state, action: PayloadAction<Account[]>) => {
          state.loading = false;
          state.accounts = action.payload;
          state.status = 'fulfilled';
        }
      )
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "An error occurred while fetching accounts";
        state.status = 'rejected';
      })
      // Create account
      .addCase(createAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = 'pending';
      })
      .addCase(
        createAccount.fulfilled,
        (state, action: PayloadAction<Account>) => {
          state.loading = false;
          state.error = null;
          state.accounts = [...state.accounts, action.payload];
          state.status = 'fulfilled';
        }
      )
      .addCase(createAccount.rejected, (state, action) => {
        state.error = action.error.message ?? "An error occurred while creating the account";
        state.status = 'rejected';
      })
      // Edit account
      .addCase(
        editAccount.fulfilled,
        (state, action: PayloadAction<Account>) => {
          const updatedAccount = action.payload;
          const index = state.accounts.findIndex(
            (account) => account.id === updatedAccount.id
          );
          if (index !== -1) {
            state.accounts[index] = updatedAccount;
          }
        }
      )
      .addCase(editAccount.rejected, (state, action) => {
        state.error = action.error.message ?? "An error occurred while editing the account";
      })
      // Delete account
      .addCase(deleteAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = 'pending';
      })
      .addCase(deleteAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const accountId = action.meta.arg; // Get the accountId from action.meta
        state.accounts = state.accounts.filter(account => account.id !== accountId);
        state.status = 'fulfilled';
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.error = action.error.message ?? "An error occurred while deleting the account";
        state.status = 'rejected';
      })
   
  },
});

export default accountSlice.reducer;

// Exporting action creators
export const accountActions = accountSlice.actions;
