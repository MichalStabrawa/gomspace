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
  const [isDeleting, setIsDeleting] = useState(false); // Track the deletion state locally

  const dispatch = useDispatch();

  const handleDelete = async () => {
    setIsDeleting(true); // Set local loading state to true immediately
    try {
      await dispatch(deleteAccount(account.id) as any); // Dispatch deleteAccount without waiting for its completion
      onClose();
    } catch (error) {
      console.error('Error deleting account:', error);
    } finally {
      setIsDeleting(false); // Reset local loading state after deletion attempt
    }
  };
  console.log('isDeleting')
  console.log(isDeleting)

  return (
    <div className={`modal ${isOpen ? 'show' : 'hide'}`}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Account Details</h2>
        <p>{account.name} {account.balance}</p>
        <button onClick={handleDelete} disabled={isDeleting}>{isDeleting ? 'Deleting...' : 'Delete'}</button>
      </div>
    </div>
  );
};

export default AccountModal;