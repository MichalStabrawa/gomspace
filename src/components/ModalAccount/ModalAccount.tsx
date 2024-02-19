import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteAccount } from '../../store/accountReducersSlice';

interface AccountProps {
  isOpen: boolean;
  onClose: () => void;
  account: {
    name: string;
    id: string;
    balance: number;
  };
}

const AccountModal = ({ account, isOpen, onClose }: AccountProps) => {
  const [editedName, setEditedName] = useState(account.name);
  const [editedBalance, setEditedBalance] = useState(account.balance);
  const [transferAmount, setTransferAmount] = useState(0);
  const [recipientAccountId, setRecipientAccountId] = useState('');

  const dispatch = useDispatch();

  const handleDelete = async () => {
    try {
      await dispatch(deleteAccount(account.id) as any); // Dispatch deleteAccount without waiting for its completion
      onClose();
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  return (
    <div className={`modal ${isOpen ? 'show' : 'hide'}`}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Account Details</h2>
        <p>Name: <input type="text" value={editedName} onChange={(e) => setEditedName(e.target.value)} /></p>
        <p>Balance: <input type="number" value={editedBalance} onChange={(e) => setEditedBalance(parseFloat(e.target.value))} /></p>
      
        <button onClick={handleDelete}>Delete</button>
        <hr />
        <h2>Transfer Balance</h2>
        <p>Recipient Account ID: <input type="text" value={recipientAccountId} onChange={(e) => setRecipientAccountId(e.target.value)} /></p>
        <p>Amount: <input type="number" value={transferAmount} onChange={(e) => setTransferAmount(parseFloat(e.target.value))} /></p>
 
      </div>
    </div>
  );
};

export default AccountModal;