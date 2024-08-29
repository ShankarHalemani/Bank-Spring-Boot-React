import React, { useState } from "react";
import { addCustomer, createNewAccount } from "../../../services/adminService";
import { errorToast, successToast } from "../../../utils/Toast/Toast";
import { showValidationMessages, validateField, validateForm, validatePassword, validateUsername } from "../../../utils/validator/validator";

const AddCustomerForm = ({ onClose }) => {
  const [isTouched, setIsTouched] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    password: "",
    bankId: "",
  });
  const [customer, setCustomer] = useState({
    username: "",
    firstName: "",
    lastName: "",
    password: "",
    bankId: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer({ ...customer, [name]: value });
    setFormData({ ...customer, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showValidationMessages();
      setIsTouched(true);
      return;
    }
    try {
      const response = await addCustomer(customer);
      if (response) {
        const customerId = response.id;
        const bankId = customer.bankId;
        await createNewAccount({ customerId, bankId });
      }

      setMessage(response?.message || "Customer added successfully.");
      successToast("Customer added successfully.");
      setCustomer({
        username: "",
        firstName: "",
        lastName: "",
        password: "",
        bankId: "",
      });
      onClose();
    } catch (error) {
      setMessage("Error adding customer.");
      errorToast("Error adding customer.");
    }
  };

  return (
    <div className="card inner-card mt-1">
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input type="text" id="username" name="username" className="form-control" value={customer.username} onChange={handleChange} onBlur={() => validateUsername(formData.username)} />
            {isTouched && validateUsername(formData.username)}
          </div>
          <div className="mb-3">
            <label htmlFor="firstName" className="form-label">
              First Name
            </label>
            <input type="text" id="firstName" name="firstName" className="form-control" value={customer.firstName} onChange={handleChange} onBlur={() => validateField("firstName", formData.firstName, "required|min:2|max:50")} />
            {isTouched && validateField("firstName", formData.firstName, "required|min:2|max:50")}
          </div>
          <div className="mb-3">
            <label htmlFor="lastName" className="form-label">
              Last Name
            </label>
            <input type="text" id="lastName" name="lastName" className="form-control" value={customer.lastName} onChange={handleChange} onBlur={() => validateField("lastName", formData.lastName, "required|min:2|max:50")} />
            {isTouched && validateField("lastName", formData.lastName, "required|min:2|max:50")}
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input type="password" id="password" name="password" className="form-control" value={customer.password} onChange={handleChange} onBlur={() => validatePassword(formData.password)} />
            {isTouched && validatePassword(formData.password)}
          </div>

          <div className="mb-3">
            <label htmlFor="bankId" className="form-label">
              Bank ID
            </label>
            <input type="text" id="bankId" name="bankId" className="form-control" value={customer.bankId} onChange={handleChange} onBlur={() => validateField("bankId", formData.bankId, "required|notNaN")} />
            {isTouched && validateField("bankId", formData.bankId, "required|notNaN")}
          </div>
          <button type="submit" className="btn btn-primary">
            Add Customer
          </button>
        </form>
        {message && <div className="mt-3 alert alert-info">{message}</div>}
      </div>
    </div>
  );
};

export default AddCustomerForm;
