import React, { useState } from "react";
import { addBank } from "../../../services/adminService";
import { errorToast, successToast } from "../../../utils/Toast/Toast";

const AddNewBank = ({onClose}) => {
  const [bank, setBank] = useState({
    fullName: "",
    abbreviation: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBank({ ...bank, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addBank(bank);
      setMessage(response?.message || "Bank added successfully.");
      successToast("Bank added successfully.");
      setBank({
        fullName: "",
        abbreviation: "",
      });
      onClose();
    } catch (error) {
      setMessage("Error adding Bank.");
      errorToast("Error adding Bank.");
    }
  };

  return (
    <div className="card inner-card mt-1">
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          
          <div className="mb-3">
            <label htmlFor="fullName" className="form-label">
              Full Name
            </label>
            <input type="text" id="fullName" name="fullName" className="form-control" value={bank.fullName} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="abbreviation" className="form-label">
              Abbreviation
            </label>
            <input type="text" id="abbreviation" name="abbreviation" className="form-control" value={bank.abbreviation} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary">
            Add Bank
          </button>
        </form>
        {message && <div className="mt-3 alert alert-info">{message}</div>}
      </div>
    </div>
  );
};

export default AddNewBank;
