import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCustomerById } from "../../../services/adminService";
import { isCustomer } from "../../../services/loginAuthService";
import { warnToast } from "../../../utils/Toast/Toast";
import Modal from "../../../sharedComponents/ModalComponents/Modal";
import OthersTransfer from "../Transactions/OthersTransfer";
import SelfTransfer from "../Transactions/SelfTransfer";

const CustomerHome = () => {
  const navigate = useNavigate();
  const [isNewTransactionModalOpen, setNewTransactionModalOpen] = useState(false);
  const [isSelfTransferModalOpen, setSelfTransferModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);

  useEffect(() => {
    const checkCustomer = async () => {
      const customerStatus = await isCustomer();
      if (!customerStatus) {
        warnToast("Unauthorized Access! Login First");
        navigate("/");
      }
    };

    checkCustomer();
  }, [navigate]);

  useEffect(() => {
    const getCurrentCustomer = async () => {
      const response = await getCustomerById(localStorage.getItem("userId"));
      if (response) {
        setCurrentCustomer(response);
      }
    };

    getCurrentCustomer();
  }, [setCurrentCustomer]);

  useEffect(() => {
    if (!isNewTransactionModalOpen && !isSelfTransferModalOpen) {
      const refreshCustomerData = async () => {
        const response = await getCustomerById(localStorage.getItem("userId"));
        if (response) {
          setCurrentCustomer(response);
        }
      };

      refreshCustomerData();
    }
  }, [isNewTransactionModalOpen, isSelfTransferModalOpen]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleMakeTransaction = () => {
    setNewTransactionModalOpen(true);
  };

  const handleSelfTransfer = () => {
    setSelfTransferModalOpen(true);
  };

  const handleGetAllTransactions = () => {
    navigate("/fetch-transactions");
  };

  return (
    <div className="customer-dashboard">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="/customer-dashboard">
            <i className="fas fa-user-circle me-2"></i>
            {currentCustomer ? `${currentCustomer.id} | ${currentCustomer.firstName} ${currentCustomer.lastName}` : "Customer Dashboard"}
          </a>
          <div className="d-flex align-items-center">
            {currentCustomer && (
              <span className="text-light me-4">
                <i className="fas fa-wallet me-2"></i>
                Balance: Rs.{currentCustomer.totalBalance.toFixed(2)}
              </span>
            )}
            <button className="btn btn-outline-light" type="button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          <div className="col">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">Make New Transaction</h5>
                <p className="card-text">Make a transaction to another customer's account.</p>
                <button className="btn btn-primary" onClick={handleMakeTransaction}>
                  New Transaction
                </button>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">Self Account Transfer</h5>
                <p className="card-text">Transfer funds between your own accounts.</p>
                <button className="btn btn-primary" onClick={handleSelfTransfer}>
                  Self Transfer
                </button>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">Get All Transactions</h5>
                <p className="card-text">Retrieve all your transactions.</p>
                <button className="btn btn-primary" onClick={handleGetAllTransactions}>
                  View
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal title="New Transaction" isOpen={isNewTransactionModalOpen} onClose={() => setNewTransactionModalOpen(false)}>
        <OthersTransfer onClose={() => setNewTransactionModalOpen(false)} />
      </Modal>
      <Modal title="Self Transfer" isOpen={isSelfTransferModalOpen} onClose={() => setSelfTransferModalOpen(false)}>
        <SelfTransfer onClose={() => setSelfTransferModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default CustomerHome;
