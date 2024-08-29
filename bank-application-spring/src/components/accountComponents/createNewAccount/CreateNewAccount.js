import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createNewAccount, getCustomerById } from "../../../services/adminService";
import { isAdmin } from "../../../services/loginAuthService";
import Login from "../../loginComponent/Login";
import { errorToast, successToast } from "../../../utils/Toast/Toast";
import { showValidationMessages, validateField, validateForm } from "../../../utils/validator/validator";

const CreateNewAccount = ({ currentCustomer, onClose, onCreateAccount }) => {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const formRef = useRef();
  const [isTouched, setIsTouched] = useState(false);
  const [formData, setFormData] = useState({
    customerId: "",
    bankId: "",
  });

  useEffect(() => {
    const fetchCustomerData = async () => {
      const adminStatus = await isAdmin();
      setIsAdminUser(adminStatus);

      if (!adminStatus) {
        navigate("/");
        return;
      }

      try {
        const customerData = await getCustomerById(currentCustomer.id);
        setCustomer(customerData);
      } catch (error) {
        console.error("Error fetching customer:", error);
        errorToast("Failed to fetch customer data.");
      }
    };

    fetchCustomerData();
  }, [navigate, currentCustomer.id]);

  if (!isAdminUser) return <Login />;
  if (!customer) return <div>Loading customer data...</div>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showValidationMessages();
      setIsTouched(true);
      return;
    }

    const customerId = currentCustomer.id;
    const bankId = formRef.current.querySelector("#bankId").value;

    try {
      const response = await createNewAccount({ customerId, bankId });
      if (response) {
        successToast("Account Created");
      }
      onClose();
      const newAccountCustomer = await getCustomerById(currentCustomer.id);
      console.log(newAccountCustomer);
      onCreateAccount(newAccountCustomer);
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
    <div className="card">
      <div className="card-body update-customer shadow-lg p-4">
        <form onSubmit={handleSubmit} ref={formRef}>
          <div className="form-group mb-2">
            <label htmlFor="username">Customer ID</label>
            <input type="text" className="form-control" id="customerId" name="customerId" value={customer.id} onChange={handleInputChange} disabled />
          </div>
          <div className="form-group mb-2">
            <label htmlFor="firstName">Bank ID</label>
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

export default CreateNewAccount;
