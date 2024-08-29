import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../../sharedComponents/ModalComponents/Modal";
import AddCustomerForm from "../customerComponents/addNewCustomer/AddCustomerForm";
import { isAdmin } from "../../services/loginAuthService";
import { warnToast } from "../../utils/Toast/Toast";
import AddNewBank from "../bankComponents/addNewBank/AddNewBank";
import AddNewAccount from "../accountComponents/addNewAccount/AddNewAccount";

const AdminHomepage = () => {
  const navigate = useNavigate();
  const [isAddCustomerModalOpen, setAddCustomerModalOpen] = useState(false);
  const [isAddBankModalOpen, setAddBankModalOpen] = useState(false);
  const [isAddAccountModalOpen, setAddAccountModalOpen] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const adminStatus = await isAdmin();
      if (!adminStatus) {
        warnToast("Unauthorized Access! Login First");
        navigate("/");
      }
    };

    checkAdmin();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };


  const handleGetAllCustomers = () => {
    navigate("/fetch-customers");
  };
  
  const handleAddNewCustomer = () => {
    setAddCustomerModalOpen(true);
  };
  
  const handleGetAllBanks = () => {
    navigate("/fetch-banks");
  };
  
  const handleAddNewBank = () => {
    setAddBankModalOpen(true);
  };
  
  const handleGetAllAccounts = () => {
    navigate("/fetch-accounts");
  };
  
  const handleAddAccount = () => {
    setAddAccountModalOpen(true);
  };
  
  const handleGetNonAccountCustomers = () => {
    navigate("/fetch-nonaccount-customers");
  };
  
  const handleGetAllTransactions = () => {
    navigate("/fetch-accounts-transactions");
  };


  return (
    <div className="admin-dashboard">
      <nav className="navbar navbar-expand-lg navbar-light bg-dark">
        <div className="container-fluid">
          <h4 className="navbar-brand" style={{ color: "white" }}>Admin Dashboard</h4>
          <button className="btn btn-outline-light" type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="container mt-4">
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          <div className="col">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">Get All Customers</h5>
                <p className="card-text">Fetch and view all registered customers.</p>
                <button className="btn btn-primary" onClick={handleGetAllCustomers}>
                  View
                </button>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">Add New Customer</h5>
                <p className="card-text">Add a new customer to the system.</p>
                <button className="btn btn-primary" onClick={handleAddNewCustomer}>
                  Add
                </button>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">Get All Banks</h5>
                <p className="card-text">Retrieve the list of all banks.</p>
                <button className="btn btn-primary" onClick={handleGetAllBanks}>
                  View
                </button>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">Add New Bank</h5>
                <p className="card-text">Add a new bank to the system.</p>
                <button className="btn btn-primary" onClick={handleAddNewBank}>
                  Add
                </button>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">Get All Accounts</h5>
                <p className="card-text">View all bank accounts.</p>
                <button className="btn btn-primary" onClick={handleGetAllAccounts}>
                  View
                </button>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">Add New Account</h5>
                <p className="card-text">Create a new bank account.</p>
                <button className="btn btn-primary" onClick={handleAddAccount}>
                  Add
                </button>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">Get Unverified Customers</h5>
                <p className="card-text">Fetch customers without accounts.</p>
                <button className="btn btn-primary" onClick={handleGetNonAccountCustomers}>
                  View
                </button>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">Get All Transactions</h5>
                <p className="card-text">Retrieve all transactions.</p>
                <button className="btn btn-primary" onClick={handleGetAllTransactions}>
                  View
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal title="Add New Customer" isOpen={isAddCustomerModalOpen} onClose={() => setAddCustomerModalOpen(false)}>
        <AddCustomerForm onClose={() => setAddCustomerModalOpen(false)} />
      </Modal>
      <Modal title="Add New Bank" isOpen={isAddBankModalOpen} onClose={() => setAddBankModalOpen(false)}>
        <AddNewBank onClose={() => setAddBankModalOpen(false)} />
      </Modal>
      <Modal title="Add New Account" isOpen={isAddAccountModalOpen} onClose={() => setAddAccountModalOpen(false)}>
        <AddNewAccount onClose={() => setAddAccountModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default AdminHomepage;



