import React, { useState } from "react";
import { addBank } from "../../../services/adminService";
import { errorToast, successToast } from "../../../utils/Toast/Toast";
import { showValidationMessages, validateField, validateForm } from "../../../utils/validator/validator";

const AddNewBank = ({ onClose }) => {
  const [bank, setBank] = useState({
    fullName: "",
    abbreviation: "",
  });
  const [isTouched, setIsTouched] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    abbreviation: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBank({ ...bank, [name]: value });
    setFormData({ ...bank, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showValidationMessages();
      setIsTouched(true);
      return;
    }
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
            <input type="text" id="fullName" name="fullName" className="form-control" value={bank.fullName} onChange={handleChange} onBlur={() => validateField("fullName", formData.fullName, "required|min:2|max:50")} />
            {isTouched && validateField("fullName", formData.fullName, "required|min:2|max:50")}
          </div>
          <div className="mb-3">
            <label htmlFor="abbreviation" className="form-label">
              Abbreviation
            </label>
            <input type="text" id="abbreviation" name="abbreviation" className="form-control" value={bank.abbreviation} onChange={handleChange} onBlur={() => validateField("abbreviation", formData.abbreviation, "required|min:2|max:50")} />
            {isTouched && validateField("abbreviation", formData.abbreviation, "required|min:2|max:50")}
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
