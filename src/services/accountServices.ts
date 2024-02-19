interface Account {
  id: number;
  ownerId: string;
  currency: string;
  balance: number;
  name:string
}

// Mocked accounts data (replace with actual backend integration)
let accounts: Account[] = [
  { id: 1, ownerId: "1", currency: "USD", balance: 1000,name:'User1' },
  { id: 2, ownerId: "2", currency: "EUR", balance: 500,name:'User2'  },
  { id: 3, ownerId: "3", currency: "EUR", balance: 5000,name:'User3'  },
];

export const getAccounts = async (): Promise<Account[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(accounts);
    }, 500);
  });
};

export const createAccount = async (
  newAccount: Partial<Account>
): Promise<Account> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const id = accounts.length + 1;
      const account = { id, ...newAccount } as Account;
      accounts.push(account);
      resolve(account);
    }, 500);
  });
};

export const editAccount = async (
  accountId: number,
  updatedAccount: Partial<Account>
): Promise<Account> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = accounts.findIndex((account) => account.id === accountId);
      if (index !== -1) {
        accounts[index] = { ...accounts[index], ...updatedAccount } as Account;
        resolve(accounts[index]);
      } else {
        reject(new Error("Account not found"));
      }
    }, 500);
  });
};

export const searchAccounts = async (
  searchTerm: string
): Promise<Account[]> => {
  const accounts = await getAccounts();
  const searchResults = accounts.filter(
    (account) =>
      account.ownerId.includes(searchTerm) ||
      account.currency.includes(searchTerm)
  );
  return searchResults;
};
