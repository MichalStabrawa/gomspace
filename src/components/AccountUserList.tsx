import React, { useState, useEffect } from "react";
import { getAccounts } from "../services/accountServices";
import classes from './AccountUserList.module.scss';
interface Account {
  id: number;
  ownerId: string;
  currency: string;
  balance: number;
  name:string;
}

const AccountUserList: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    //get users list
    const fetchAccounts = async () => {
      const data = await getAccounts();
      setAccounts(data);
    };
    fetchAccounts();
  }, []);

  return (
    <div className={classes.wrapper}>
      <h2>Accounts</h2>
      <ul className={classes.list}>
        {accounts.map((account) => (
          <li
            key={account.id}
          >{account.name}, id: {`${account.ownerId} - currency: ${account.currency} - saldo: ${account.balance}`}</li>
        ))}
      </ul>
    </div>
  );
};

export default AccountUserList;
