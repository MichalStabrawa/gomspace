import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import { fetchAccounts, createAccount } from "../store/accountReducersSlice";
import { Account } from "../types/types";
import classes from "./AccountUserList.module.scss";
import { v4 as uuidv4 } from "uuid";
import AddNewAccount from "./AddNewAccount/AddNewAccount";
import AccountModal from "./ModalAccount/ModalAccount";

const AccountUserList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { accounts, loading, error,status } = useSelector(
    (state: RootState) => state.account
  );
  const [newAccountData, setNewAccountData] = useState<Partial<Account>>({
    name: "",
    balance: 0,
    currency: "",
  });
  const [editData,setEditData]= useState<Partial<Account>>({
    name: "",
    balance: 0,
    currency: "",
    id:''
  })

  const [isOpen,setIsOpen] = useState(false)
  console.log("Acounts");
  console.log(accounts);

  console.log('STATUS' +" "+ status)

  useEffect(() => {
    dispatch(fetchAccounts());
  }, [dispatch]);

  const handleCreateAccount = () => {
    if (newAccountData) {
      const { name, balance, currency } = newAccountData;

      const id = uuidv4(); // Generate UUID for id
      const ownerId = id + name;
      dispatch(createAccount({ id, name, balance, currency, ownerId }));
      setNewAccountData({ name: "", balance: 0, currency: "", ownerId: "" });
    }
  };

  const openModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLButtonElement;
    const id = target.id;
    const editDataItem = accounts.find(el => el.id === id); 
    if (editDataItem) {
      setEditData(editDataItem); 
      setIsOpen(true);
    }
  };

  const closeModal=()=> {
    setIsOpen(false)
  }

  const handleCreateUserAccount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAccountData((prevNewAccountData) => ({
      ...prevNewAccountData,
      [name]: name === "balance" ? parseFloat(value) : value,
    }));
  };



  return (
    <div className={classes.wrapper}>
      <h2>Accounts</h2>
      <section>
        <ul className={classes.list}>
          {accounts &&
            accounts.map((el) => (
              <li key={el.id}>
                {el.name} {el.balance} {el.currency}
                <button onClick={openModal} id={el.id}>Edit</button>
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
      <AccountModal account={{
        id:editData.id!,
          name: editData.name!,
          balance: editData.balance!,
         
        }} isOpen={isOpen} onClose={closeModal}/>
       
    </div>
  );
};

export default AccountUserList;
