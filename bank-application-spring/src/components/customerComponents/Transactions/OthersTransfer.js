import React, { useEffect, useRef, useState } from "react";
import { getCustomerById } from "../../../services/adminService";
import { errorToast, successToast, warnToast } from "../../../utils/Toast/Toast";
import { getAccountByAccountNumber, makeNewTransaction } from "../../../services/customerService";
import { showValidationMessages, validateField, validateForm } from "../../../utils/validator/validator";

function OthersTransfer({ onClose }) {
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [selectedSenderAccount, setSelectedSenderAccount] = useState(null);
  const [amount, setAmount] = useState("");
  const formRef = useRef();
  const [isTouched, setIsTouched] = useState(false);
  const [formData, setFormData] = useState({ amount: "", receiverAccount: "" });

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
    if (!validateForm()) {
      showValidationMessages();
      setIsTouched(true);
      return;
    }
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

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    if (id === "amount") {
      setAmount(e.target.value);
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
            <input type="number" name="receiverAccount" id="receiverAccount" className="form-control" disabled={!selectedSenderAccount} onChange={handleInputChange} onBlur={() => validateField("Reciever account", formData.receiverAccount, "required|notNaN")} />
            {isTouched && validateField("Reciever account", formData.receiverAccount, "required|notNaN")}
          </div>
          <div className="mb-3">
            <label htmlFor="amount" className="form-label">
              Amount
            </label>
            <input type="number" className="form-control" id="amount" value={amount} onChange={handleInputChange} onBlur={() => validateField("Amount", formData.amount, "required|notNaN")} />
            {isTouched && validateField("Amount", formData.amount, "required|notNaN")}
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
