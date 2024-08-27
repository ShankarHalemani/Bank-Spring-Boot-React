import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCustomerById, updateCustomerDetails } from "../../../services/adminService";
import { isAdmin } from "../../../services/loginAuthService";
import Login from "../../loginComponent/Login";
import "../updateCustomer/UpdateCustomer.css";
import { errorToast, successToast } from "../../../utils/Toast/Toast";

const UpdateCustomer = ({ currentCustomer, onClose, onCustomerUpdate }) => {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [isAdminUser, setIsAdminUser] = useState(false);

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
        errorToast("Failed to fetch customer data.")
      }
    };

    fetchCustomerData();
  }, [navigate, currentCustomer.id]);

  if (!isAdminUser) return <Login />;
  if (!customer) return <div>Loading customer data...</div>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prevCustomer) => ({
      ...prevCustomer,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedCustomer = await updateCustomerDetails(customer);
      console.log(updatedCustomer);
      successToast(`Customer with ID : ${currentCustomer.id} updated successfully`);
      onCustomerUpdate(currentCustomer.id, updatedCustomer);
      onClose();
    } catch (error) {
      console.error(error);
      errorToast("Error updating customer")
    }
  };

  return (
    <div className="card inner-card">
      <div className="card-body update-customer shadow-lg p-4">
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-2">
            <label htmlFor="username">Username / Email:</label>
            <input type="email" className="form-control" id="username" name="username" value={customer.username} disabled />
          </div>
          <div className="form-group mb-2">
            <label htmlFor="firstName">First Name:</label>
            <input type="text" className="form-control" id="firstName" name="firstName" value={customer.firstName} onChange={handleChange} />
          </div>
          <div className="form-group mb-2">
            <label htmlFor="lastName">Last Name:</label>
            <input type="text" className="form-control" id="lastName" name="lastName" value={customer.lastName} onChange={handleChange} />
          </div>
          <button type="submit" className="btn btn-primary mt-2">
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateCustomer;
