import React, { useState } from "react";
import { addBank, addCustomer, createNewAccount } from "../../../services/adminService";
import { errorToast, successToast } from "../../../utils/Toast/Toast";

const AddCustomerForm = ({ onClose }) => {
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
            <input type="text" id="username" name="username" className="form-control" value={customer.username} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="firstName" className="form-label">
              First Name
            </label>
            <input type="text" id="firstName" name="firstName" className="form-control" value={customer.firstName} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="lastName" className="form-label">
              Last Name
            </label>
            <input type="text" id="lastName" name="lastName" className="form-control" value={customer.lastName} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input type="password" id="password" name="password" className="form-control" value={customer.password} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label htmlFor="bankId" className="form-label">
              Bank ID
            </label>
            <input type="text" id="bankId" name="bankId" className="form-control" value={customer.bankId} onChange={handleChange} required />
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
