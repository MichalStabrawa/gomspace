import React from "react";
import classes from "./AddNewAccount.module.scss";
interface AddNewAccountProps {
  handleInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleButton: () => void;
  newData: {
    name: string;
    balance: number;
    currency: string;
  };
}

function AddNewAccount({
  handleInput,
  handleButton,
  newData,
}: AddNewAccountProps) {
  return (
    <section className={classes.create_account}>
      {" "}
      <div>
        <h2>Add new account</h2>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newData.name!}
          onChange={handleInput}
          className="input"
        />
        <input
          type="number"
          name="balance"
          placeholder="Balance"
          value={newData.balance!}
          onChange={handleInput}
          className="input"
        />
        <input
          type="text"
          name="currency"
          placeholder="Currency"
          value={newData.currency!}
          onChange={handleInput}
          className="input"
          min={0}
        />

        <button
          type="button"
          className={classes.button}
          onClick={handleButton}
          disabled={
            newData.name === "" ||
            newData.balance === 0 ||
            newData.currency === ""
          }
        >
          Create
        </button>
      </div>
    </section>
  );
}

export default AddNewAccount;
