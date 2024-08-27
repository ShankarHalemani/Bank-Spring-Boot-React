import React, { useRef } from "react";
import { createNewAccount } from "../../../services/adminService";
import { errorToast } from "../../../utils/Toast/Toast";

const AddNewAccount = ({ onClose }) => {
  const formRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const customerId = formRef.current.querySelector("#customerId").value;
    const bankId = formRef.current.querySelector("#bankId").value;

    try {
      await createNewAccount({ customerId, bankId });
      onClose();
    } catch (error) {
      console.error(error);
      errorToast("Error creating account");
    }
  };

  return (
    <div className="card inner-card shadow-lg p-4">
        <div className="card-body">
        <form onSubmit={handleSubmit} ref={formRef}>
          <div className="form-group mb-2">
            <label htmlFor="customerId">Customer ID</label>
            <input type="text" className="form-control" id="customerId" name="customerId" />
          </div>
          <div className="form-group mb-2">
            <label htmlFor="bankId">Bank ID</label>
            <input type="text" className="form-control" id="bankId" name="bankId" required />
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
