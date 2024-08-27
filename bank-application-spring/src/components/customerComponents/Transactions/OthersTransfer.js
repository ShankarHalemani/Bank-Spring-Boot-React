import React, { useEffect, useRef, useState } from "react";
import { getCustomerById } from "../../../services/adminService";
import { errorToast, successToast, warnToast } from "../../../utils/Toast/Toast";
import { getAccountByAccountNumber, makeNewTransaction } from "../../../services/customerService";

function OthersTransfer({ onClose }) {
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [selectedSenderAccount, setSelectedSenderAccount] = useState(null);
  const [amount, setAmount] = useState("");
  const formRef = useRef();

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
    };

    checkForAccounts();
  }, [onClose]);

  const handleSenderAccountChange = (e) => {
    const selectedAccountNumber = e.target.value;
    const account = currentCustomer.accounts.find((acc) => acc.accountNumber === parseInt(selectedAccountNumber));
    setSelectedSenderAccount(account);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const selectedReceiverAccountNumber = formRef.current.querySelector("#receiverAccount").value;
      const receiverAccount = await getAccountByAccountNumber(parseInt(selectedReceiverAccountNumber));
      
      if (!receiverAccount) {
        errorToast("Account not found or invalid account number.");
        return;
      }
  
      await makeNewTransaction({
        senderAccount: selectedSenderAccount.accountNumber,
        receiverAccount: receiverAccount.accountNumber,
        amount,
      });
  
      successToast("Transaction completed successfully.");
      onClose();
    } catch (error) {
      console.error(error);
      errorToast("Error completing transaction.");
    }
  };
  

  return (
    <div className="card inner-card mt-1">
      <div className="card-body">
        <form onSubmit={handleSubmit} ref={formRef}>
          <div className="mb-3">
            <label htmlFor="senderAccount" className="form-label">
              Your Account Number
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
              Receiver Account Number
            </label>
            <input type="number" name="receiverAccount" id="receiverAccount" className="form-control" disabled={!selectedSenderAccount} />
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

export default OthersTransfer;
