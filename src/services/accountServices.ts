interface Account {
    id: string;
    ownerId: string;
    currency: string;
    balance: number;
    name: string;
  }
  
  let accounts: Account[] = [
    { id: '1', ownerId: "1", currency: "USD", balance: 1000, name: 'User1' },
    { id:'2' , ownerId: "2", currency: "EUR", balance: 500, name: 'User2' },
    { id: '3', ownerId: "3", currency: "EUR", balance: 5000, name: 'User3' },
    { id: '4', ownerId: "3", currency: "USD", balance: 50, name: 'User4' }
  ];
  
  export const getAccounts = async (): Promise<Account[]> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log(accounts)
      return accounts;
    } catch (error) {
      console.error("Error fetching accounts:", error);
      throw error;
    }
  };
  
  export const createAccount = async (newAccount: Partial<Account>): Promise<Account> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
  
      const account = { ...newAccount } as Account; // Ensure the type is Account
      console.log(account);
      
      // Create a new array with the updated account
      const updatedAccounts = [...accounts, account]; 
  
      // Return the updated account
      return account;
    } catch (error) {
      console.error("Error creating account:", error);
      throw error;
    }
  };
  
  export const editAccount = async (accountId: string, updatedAccount: Partial<Account>): Promise<Account> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const index = accounts.findIndex(account => account.id === accountId);
      if (index !== -1) {
        accounts[index] = { ...accounts[index], ...updatedAccount } as Account;
        return accounts[index];
      } else {
        throw new Error('Account not found');
      }
    } catch (error) {
      console.error("Error editing account:", error);
      throw error;
    }
  };
  export const deleteAccountAPI = async (accountId: string): Promise<void> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const index = accounts.findIndex(account => account.id === accountId);
      if (index !== -1) {
        accounts.splice(index, 1);
      } else {
        throw new Error('Account not found');
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      throw error;
    }
  };
  
  export const searchAccounts = async (searchTerm: string): Promise<Account[]> => {
    try {
      const accounts = await getAccounts();
      const searchResults = accounts.filter(account =>
        account.ownerId.includes(searchTerm) ||
        account.currency.includes(searchTerm)
      );
      return searchResults;
    } catch (error) {
      console.error("Error searching accounts:", error);
      throw error;
    }
  };