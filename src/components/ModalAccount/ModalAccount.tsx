import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import classes from "./ModalAccount.module.scss";
import {
  deleteAccount,
  editAccount,
  transferBalance,
} from "../../store/accountReducersSlice";
import { RootState } from "../../store/store";
import { PayloadAction } from "@reduxjs/toolkit";

interface AccountProps {
  isOpen: boolean;
  onClose: () => void;
  account: {
    name: string;
    id: string;
    balance: number;
    currency: string;
  };
  onEdit: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

type AccountTransfer = {
  name: string;
  id: string;
  balance: number;
  currency: string;
};

const AccountModal = ({
  account,
  isOpen,
  onClose,
  onEdit,
  onInputChange,
}: AccountProps) => {
  const { accounts, loading, error, status } = useSelector(
    (state: RootState) => state.account
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [transferAmount, setTransferAmount] = useState(0); // Track the transfer amount locally
  const [destinationAccountId, setDestinationAccountId] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferArray, setTransferArray] = useState<AccountTransfer[]>([]);

  const [transferBalanceState, setTransferBalanceState] = useState<
    AccountTransfer[]
  >([]);
  console.log("Modal");
  console.log(accounts);

  console.log(`FilteredArrayTransfer `);
  console.log(transferArray);

  const dispatch = useDispatch();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deleteAccount(account.id) as any);
      onClose();
    } catch (error) {
      console.error("Error deleting account:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveEdit = () => {
    onEdit();
    setIsEditing(false);
  };

  const handleUserTransferId = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = e.target.selectedOptions[0];
    const selectedAccountId = selectedOption.value;
    const selectedBalance = selectedOption.getAttribute("data-balance");
    const selectedCurrency = selectedOption.getAttribute("data-currency");
    const selectedName = selectedOption.getAttribute("data-name");

    const balance = selectedBalance ? Number(selectedBalance) : 0;
    const currency = selectedCurrency || "";
    const name = selectedName || "";

    setTransferBalanceState([
      {
        id: selectedAccountId,
        balance: balance + transferAmount,
        currency,
        name,
      },
    ]);
  };
  console.log("Dest");
  console.log(destinationAccountId);

  const filterWithoutExistingId = () => {
    const filteredArr = accounts.filter((el) => el.id !== account.id);

    return filteredArr;
  };

  useEffect(() => {
    setTransferArray(filterWithoutExistingId());
  }, [account, accounts]);

  useEffect(() => {
    setTransferBalanceState((prevTransferBalance) =>
      prevTransferBalance.map((account) => ({
        ...account,
        balance: account.balance + transferAmount,
      }))
    );
  }, [transferAmount]);

  return (
    <div className={`modal ${isOpen ? "show" : "hide"}`}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Account Details</h2>
        {isEditing ? (
          <div>
            <label>Name:</label>
            <input
              className="input"
              type="text"
              name="name"
              value={account.name}
              onChange={onInputChange}
            />
            <label>Balance:</label>
            <input
              className="input"
              type="number"
              name="balance"
              value={account.balance.toString()}
              onChange={onInputChange}
            />
            <label>Currency:</label>
            <input
              className="input"
              type="text"
              name="currency"
              value={account.currency}
              onChange={onInputChange}
            />
            <button className={classes.button} onClick={handleSaveEdit}>
              Save
            </button>
          </div>
        ) : (
          <div>
            <p>
              {account.name} {account.balance} {account.currency}
            </p>
            <button className={classes.button} onClick={handleEditToggle}>
              Edit
            </button>
            <button
              className={`${classes.button} ${classes.delete}`}
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
            <div>
              <label>Transfer Amount:</label>
              <input
                className="input"
                type="number"
                value={transferAmount}
                onChange={(e) => setTransferAmount(parseFloat(e.target.value))}
              />
            </div>
            <div>
              <label>Destination Account ID:</label>
              <input
                className="input"
                type="text"
                value={destinationAccountId}
                onChange={(e) => setDestinationAccountId(e.target.value)}
              />
              <select className="input" onChange={handleUserTransferId}>
                {transferArray &&
                  transferArray.map((el) => (
                    <option
                      key={el.id}
                      value={el.id}
                      data-balance={el.balance}
                      data-currency={el.currency}
                      data-name={el.name}
                    >
                      {el.name}
                    </option>
                  ))}
              </select>
            </div>
            <button
              className={`${classes.button} ${classes.transfer}`}
              disabled={isTransferring}
            >
              {isTransferring ? "Transferring..." : "Transfer"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountModal;
