export interface Account {
    id: string;
    ownerId: string;
    currency: string;
    balance: number;
    name: string;
  }
  
  export interface AccountState {
    accounts: Account[];
    loading: boolean;
    error: string | null;
  }