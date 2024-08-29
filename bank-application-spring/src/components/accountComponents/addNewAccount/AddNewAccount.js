import React, { useRef, useState } from "react";
import { createNewAccount } from "../../../services/adminService";
import { errorToast, successToast } from "../../../utils/Toast/Toast";
import { showValidationMessages, validateField, validateForm } from "../../../utils/validator/validator";

const AddNewAccount = ({ onClose }) => {
  const formRef = useRef();
  const [isTouched, setIsTouched] = useState(false);
  const [formData, setFormData] = useState({
    customerId: "",
    bankId: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showValidationMessages();
      setIsTouched(true);
      return;
    }

    const customerId = formRef.current.querySelector("#customerId").value;
    const bankId = formRef.current.querySelector("#bankId").value;

    try {
      const response = await createNewAccount({ customerId, bankId });
      if (response) {
        successToast("Account added");
      }
      onClose();
    } catch (error) {
      console.error(error);
      errorToast("Error creating account");
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <div className="card inner-card shadow-lg p-4">
      <div className="card-body">
        <form onSubmit={handleSubmit} ref={formRef}>
          <div className="form-group mb-2">
            <label htmlFor="customerId">Customer ID</label>
            <input type="text" className="form-control" id="customerId" name="customerId" onChange={handleInputChange} onBlur={() => validateField("customerId", formData.customerId, "required|notNaN")} />
            {isTouched && validateField("customerId", formData.customerId, "required|notNaN")}
          </div>
          <div className="form-group mb-2">
            <label htmlFor="bankId">Bank ID</label>
            <input type="text" className="form-control" id="bankId" name="bankId" onChange={handleInputChange} onBlur={() => validateField("bankId", formData.bankId, "required|notNaN")} />
            {isTouched && validateField("bankId", formData.bankId, "required|notNaN")}
          </div>
          <button type="submit" className="btn btn-primary mt-2">
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNewAccount;
