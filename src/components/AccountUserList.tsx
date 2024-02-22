//AccountUserList.tsx modal edit delete transfer

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import {
  fetchAccounts,
  createAccount,
  editAccount,
} from "../store/accountReducersSlice";
import { Account } from "../types/types";
import classes from "./AccountUserList.module.scss";
import { v4 as uuidv4 } from "uuid";
import AddNewAccount from "./AddNewAccount/AddNewAccount";
import AccountModal from "./ModalAccount/ModalAccount";

type AccountSearch = {
  name: string;
  balance: number;
  currency: string;
  id: string;
};

const AccountUserList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { accounts, loading, error, status } = useSelector(
    (state: RootState) => state.account
  );
  const [newAccountData, setNewAccountData] = useState<Partial<Account>>({
    name: "",
    balance: 0,
    currency: "",
  });
  const [editData, setEditData] = useState<Partial<Account>>({
    name: "",
    balance: 0,
    currency: "",
    id: "",
  });
  const [data, setData] = useState<AccountSearch[]>([]);

  const [isOpen, setIsOpen] = useState(false);
  console.log("Acounts");
  console.log(accounts);

  console.log("STATUS" + " " + status);
  console.log();

  useEffect(() => {
    dispatch(fetchAccounts());
  }, [dispatch]);

  useEffect(() => {
    if (accounts.length) {
      setData(accounts);
    }
  }, [status, dispatch, accounts]);

  const handleCreateAccount = async () => {
    if (newAccountData) {
      const { name, balance, currency } = newAccountData;
      const id = uuidv4(); // Generate UUID for id
      const ownerId = id + name;

      try {
        const createdAccountAction = await dispatch(
          createAccount({ id, name, balance, currency, ownerId })
        );
        const createdAccount = createdAccountAction.payload as Account;

        // After createAccount thunk fulfills, dispatch editAccount thunk
        // dispatch(editAccount({ accountId: createdAccount.id, updatedAccount: { ...createdAccount }}));

        setNewAccountData({ name: "", balance: 0, currency: "", ownerId: "" });
      } catch (error) {
        console.error("Error creating account:", error);
      }
    }
  };

  const openModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLButtonElement;
    const id = target.id;
    const editDataItem = accounts.find((el) => el.id === id);
    if (editDataItem) {
      setEditData(editDataItem);
      setIsOpen(true);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleCreateUserAccount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAccountData((prevNewAccountData) => ({
      ...prevNewAccountData,
      [name]: name === "balance" ? parseFloat(value) : value,
    }));
  };

  const handleEditAccount = () => {
    dispatch(
      editAccount({ accountId: editData.id!, updatedAccount: editData })
    );
    setIsOpen(false);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData((prevEditData) => ({
      ...prevEditData,
      [name]: name === "balance" ? parseFloat(value) : value,
    }));
  };

  const searchUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    //search by
    if (data) {
        const searchArr = data.filter(el => el.name.includes(searchTerm));
        console.log(searchArr);
        setData(searchArr)
    }
    if(searchTerm==='') {
      setData(accounts)
    }
};

  return (
    <div className={classes.wrapper}>
      <h2>Accounts</h2>
      <section>
        <div><input type="search" onChange={searchUser}/><label>Search</label></div>
        <ul className={classes.list}>
          {data.length &&
            data.map((el) => (
              <li key={el.id}>
                {el.name} {el.balance} {el.currency}
                <button onClick={openModal} id={el.id}>
                  Edit
                </button>
              </li>
            ))}
        </ul>
      </section>
      <AddNewAccount
        handleInput={handleCreateUserAccount}
        handleButton={handleCreateAccount}
        newData={{
          name: newAccountData.name!,
          balance: newAccountData.balance!,
          currency: newAccountData.currency!,
        }}
      />
      <AccountModal
        account={{
          id: editData.id!,
          name: editData.name!,
          balance: editData.balance!,
          currency: editData.currency!,
        }}
        isOpen={isOpen}
        onClose={closeModal}
        onEdit={handleEditAccount}
        onInputChange={handleEditInputChange}
      />
    </div>
  );
};

export default AccountUserList;
