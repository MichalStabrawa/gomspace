// accountReducersSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getAccounts, createAccount as createAccountAPI, editAccount as editAccountAPI } from '../services/accountServices';
import { Account } from '../types/types';

interface AccountState {
  accounts: Account[];
  loading: boolean;
  error: string | null;
}

const initialState: AccountState = {
  accounts: [],
  loading: false,
  error: null,
};

// Async thunk for fetching accounts
export const fetchAccounts = createAsyncThunk('account/fetchAccounts', async () => {
  return await getAccounts();
});

export const createAccount = createAsyncThunk('account/createAccount', async (newAccount: Partial<Account>) => {
  // Ensure that the newAccount object passed to createAccountAPI is of type Account
  // This may involve mapping or transforming the properties of newAccount to match the expected format
  return await createAccountAPI(newAccount as Account); // Explicitly cast newAccount to Account type
});

// Async thunk for editing an account
export const editAccount = createAsyncThunk('account/editAccount', async ({ accountId, updatedAccount }: { accountId: string, updatedAccount: Partial<Account> }) => {
  return await editAccountAPI(accountId, updatedAccount);
});

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    // No need for individual action creators for now
  },
  extraReducers: (builder) => {
    builder
      // Fetch accounts
      .addCase(fetchAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccounts.fulfilled, (state, action: PayloadAction<Account[]>) => {
        state.loading = false;
        state.accounts = action.payload;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'An error occurred while fetching accounts';
      })
      .addCase(createAccount.pending,state=> {
        state.loading=true;
        state.error = null;
      })
      // Create account
      .addCase(createAccount.fulfilled, (state, action: PayloadAction<Account>) => {
        state.loading = false;
        state.error = null;
        state.accounts = [...state.accounts, action.payload]; // Create a new array with the new account added
      })
      .addCase(createAccount.rejected, (state, action) => {
        state.error = action.error.message ?? 'An error occurred while creating the account';
      })
      // Edit account
      .addCase(editAccount.fulfilled, (state, action: PayloadAction<Account>) => {
        const updatedAccount = action.payload;
        const index = state.accounts.findIndex(account => account.id === updatedAccount.id);
        if (index !== -1) {
          state.accounts[index] = updatedAccount;
        }
      })
      .addCase(editAccount.rejected, (state, action) => {
        state.error = action.error.message ?? 'An error occurred while editing the account';
      });
  },
});

export default accountSlice.reducer;

// Exporting action creators
export const { } = accountSlice.actions;
