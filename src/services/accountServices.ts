//account services
import { AppDispatch } from "../store/store";
import { editAccount as editAccountAction } from "../store/accountReducersSlice";
interface Account {
  id: string;
  ownerId: string;
  currency: string;
  balance: number;
  name: string;
}

let accounts: Account[] = [
  { id: "1", ownerId: "1", currency: "USD", balance: 1000, name: "User1" },
  { id: "2", ownerId: "2", currency: "EUR", balance: 500, name: "User2" },
  { id: "3", ownerId: "3", currency: "EUR", balance: 5000, name: "User3" },
  { id: "4", ownerId: "3", currency: "USD", balance: 50, name: "User4" },
];

export const getAccounts = async (): Promise<Account[]> => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));

    return accounts;
  } catch (error) {
    console.error("Error fetching accounts:", error);
    throw error;
  }
};

export const createAccount = async (
  newAccount: Partial<Account>
): Promise<Account> => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const account = { ...newAccount } as Account;

    //const updatedAccounts = [...accounts, account];

    return account;
  } catch (error) {
    console.error("Error creating account:", error);
    throw error;
  }
};

export const editAccount = async (
  accountId: string,
  updatedAccount: Partial<Account>,
  stateAccount: Account[]
): Promise<Account> => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const index = stateAccount.findIndex((account) => account.id === accountId);

    if (index !== -1) {
      console.log("Index");
      console.log(index);
      // Create a new array with the updated account state
      const updatedAccounts = [...stateAccount];

      updatedAccounts[index] = {
        ...updatedAccounts[index],
        ...updatedAccount,
      } as Account;
      // Update the accounts array
      stateAccount = updatedAccounts;
      return stateAccount[index];
    } else {
      throw new Error("Account not found");
    }
  } catch (error) {
    console.error("Error editing account:", error);
    throw error;
  }
};

export const deleteAccountAPI = async (accountId: string): Promise<void> => {
  console.log("Services deleted");
  console.log(accountId);
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));
    // Create a new array excluding the account with the specified ID
    accounts = accounts.filter((account) => account.id !== accountId);
  } catch (error) {
    console.error("Error deleting account:", error);
    throw error;
  }
};

export const searchAccounts = async (
  searchTerm: string
): Promise<Account[]> => {
  try {
    const accounts = await getAccounts();
    const searchResults = accounts.filter(
      (account) =>
        account.ownerId.includes(searchTerm) ||
        account.currency.includes(searchTerm)
    );
    return searchResults;
  } catch (error) {
    console.error("Error searching accounts:", error);
    throw error;
  }
};

export const transferBalance = async (
  fromAccountId: string,
  toAccountId: string,
  amount: number,
  initialAccounts: Account[]
): Promise<Account[]> => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Find the accounts to transfer from and to
    const fromAccountIndex = initialAccounts.findIndex((account) => account.id === fromAccountId);
    const toAccountIndex = initialAccounts.findIndex((account) => account.id === toAccountId);

    if (fromAccountIndex === -1 || toAccountIndex === -1) {
      throw new Error("Accounts not found");
    }

    // Check if there's enough balance in the 'from' account
    if (initialAccounts[fromAccountIndex].balance < amount) {
      throw new Error("Insufficient balance");
    }

    // Update the balances
    const updatedAccounts = [...initialAccounts]; // Create a copy of the initial accounts array
    updatedAccounts[fromAccountIndex] = {
      ...updatedAccounts[fromAccountIndex],
      balance: updatedAccounts[fromAccountIndex].balance - amount
    };
    updatedAccounts[toAccountIndex] = {
      ...updatedAccounts[toAccountIndex],
      balance: updatedAccounts[toAccountIndex].balance + amount
    };

    return updatedAccounts;
  } catch (error) {
    console.error("Error transferring balance:", error);
    throw error;
  }
};
