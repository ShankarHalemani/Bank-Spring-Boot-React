import React, { useEffect, useState } from "react";
import { getCustomerById } from "../../../services/adminService";
import { errorToast, successToast, warnToast } from "../../../utils/Toast/Toast";
import { makeNewTransaction } from "../../../services/customerService";

function SelfTransfer({ onClose }) {
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [selectedSenderAccount, setSelectedSenderAccount] = useState(null);
  const [selectedReceiverAccount, setSelectedReceiverAccount] = useState(null);
  const [amount, setAmount] = useState("");

  useEffect(() => {
    const checkForAccounts = async () => {
      const response = await getCustomerById(localStorage.getItem("userId"));
      if (response) {
        setCurrentCustomer(response);
      }

      if (response.accounts.length === 0) {
        warnToast("No accounts found");
        onClose();
        return;
      }

      if (response.accounts.length <= 1) {
        warnToast("Add another account");
        onClose();
      }
    };

    checkForAccounts();
  }, [onClose]);

  const handleSenderAccountChange = (e) => {
    const selectedAccountNumber = e.target.value;
    const account = currentCustomer.accounts.find((acc) => acc.accountNumber === parseInt(selectedAccountNumber));
    setSelectedSenderAccount(account);
  };

  const handleReceiverAccountChange = (e) => {
    const selectedAccountNumber = e.target.value;
    const account = currentCustomer.accounts.find((acc) => acc.accountNumber === parseInt(selectedAccountNumber));
    setSelectedReceiverAccount(account);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await makeNewTransaction({
        senderAccount: selectedSenderAccount.accountNumber,
        receiverAccount: selectedReceiverAccount.accountNumber,
        amount,
      });
      successToast("Transaction completed successfully.");
      onClose();
    } catch (error) {
      errorToast("Error completing transaction.");
    }
  };

  return (
    <div className="card inner-card mt-1">
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="senderAccount" className="form-label">
              Sending Account
            </label>
            <select name="senderAccount" id="senderAccount" className="form-select" onChange={handleSenderAccountChange}>
              <option value="">Select Sending Account</option>
              {currentCustomer &&
                currentCustomer.accounts.map((account) => (
                  <option key={account.accountNumber} value={account.accountNumber}>
                    {account.accountNumber}
                  </option>
                ))}
            </select>
            {selectedSenderAccount && <span className="form-text">Account Balance: {selectedSenderAccount.balance}</span>}
          </div>
          <div className="mb-3">
            <label htmlFor="receiverAccount" className="form-label">
              Receiving Account
            </label>
            <select name="receiverAccount" id="receiverAccount" className="form-select" onChange={handleReceiverAccountChange} disabled={!selectedSenderAccount}>
              <option value="">Select Receiving Account</option>
              {currentCustomer &&
                currentCustomer.accounts
                  .filter((account) => account.accountNumber !== selectedSenderAccount?.accountNumber)
                  .map((account) => (
                    <option key={account.accountNumber} value={account.accountNumber}>
                      {account.accountNumber}
                    </option>
                  ))}
            </select>
            {selectedReceiverAccount && <span className="form-text">Account Balance: {selectedReceiverAccount.balance}</span>}
          </div>
          <div className="mb-3">
            <label htmlFor="amount" className="form-label">
              Amount
            </label>
            <input type="number" className="form-control" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default SelfTransfer;
