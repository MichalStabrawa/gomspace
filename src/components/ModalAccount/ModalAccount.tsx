import React, { useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import {
  deleteAccount,
  editAccount,
  transferBalance,
} from "../../store/accountReducersSlice";
import { RootState } from "../../store/store";

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

const AccountModal = ({
  account,
  isOpen,
  onClose,
  onEdit,
  onInputChange,
}: AccountProps) => {
  const { accounts, loading, error,status } = useSelector(
    (state: RootState) => state.account
  );
  const [isDeleting, setIsDeleting] = useState(false); // Track the deletion state locally
  const [isEditing, setIsEditing] = useState(false); // Track the editing state locally
  const [transferAmount, setTransferAmount] = useState(0); // Track the transfer amount locally
  const [destinationAccountId, setDestinationAccountId] = useState(""); // Track the destination account ID locally
  const [isTransferring, setIsTransferring] = useState(true); // Track the transfer state locally
  console.log('Modal');
  console.log(account)

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
              type="text"
              name="name"
              value={account.name}
              onChange={onInputChange}
            />
            <label>Balance:</label>
            <input
              type="number"
              name="balance"
              value={account.balance.toString()}
              onChange={onInputChange}
            />
            <label>Currency:</label>
            <input
              type="text"
              name="currency"
              value={account.currency}
              onChange={onInputChange}
            />
            <button onClick={handleSaveEdit}>Save</button>
          </div>
        ) : (
          <div>
            <p>
              {account.name} {account.balance} {account.currency}
            </p>
            <button onClick={handleEditToggle}>Edit</button>
            <button onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
            <div>
              <label>Transfer Amount:</label>
              <input
                type="number"
                value={transferAmount}
                onChange={(e) => setTransferAmount(parseFloat(e.target.value))}
              />
            </div>
            <div>
              <label>Destination Account ID:</label>
              <input
                type="text"
                value={destinationAccountId}
                onChange={(e) => setDestinationAccountId(e.target.value)}
              />
            </div>
            <button disabled={isTransferring}>
              {isTransferring ? "Transferring..." : "Transfer"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountModal;
