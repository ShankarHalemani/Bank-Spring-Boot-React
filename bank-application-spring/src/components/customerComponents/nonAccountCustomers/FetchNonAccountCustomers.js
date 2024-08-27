import React, { useEffect, useState } from "react";
import { getCustomerById, getNonAccountCustomers, viewCustomerDocument } from "../../../services/adminService";
import { sanitizedData } from "../../../utils/helpers/sanitizedData";
import Pagination from "../../../sharedComponents/Pagination/Pagination";
import Modal from "../../../sharedComponents/ModalComponents/Modal";
import { useNavigate } from "react-router-dom";
import { errorToast, warnToast } from "../../../utils/Toast/Toast";
import { isAdmin } from "../../../services/loginAuthService";
import NATable from "../../../sharedComponents/nonAccountCustomerTable/NATable";
import CreateNewAccount from "../../accountComponents/createNewAccount/CreateNewAccount";

const FetchNonAccountCustomers = () => {
  const [sanitizedCustomers, setSanitizedCustomers] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isCreateNewAccountModalOpen, setCreateNewAccountModalOpen] = useState(false);
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchData = async () => {
      await getAllCustomer();
    };

    fetchData();
  }, [pageNumber, pageSize]);

  const onPageChange = (newPageNumber) => {
    setPageNumber(newPageNumber);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleBack = () => {
    navigate("/admin-dashboard");
  };

  const pageObject = {
    pageSize,
    pageNumber,
    setPageNumber,
    setPageSize,
    totalPages,
  };


  const getAllCustomer = async () => {
    try {
      const response = await getNonAccountCustomers({
        size: pageSize,
        page: pageNumber,
      });

      if (response.content) {
        const keysTobeSelected = ["id", "firstName", "lastName"];
        const sanitized = sanitizedData({ data: response.content, keysTobeSelected });

        const uniqueCustomers = sanitized.filter((customer, index, self) => index === self.findIndex((c) => c.id === customer.id));

        setSanitizedCustomers(uniqueCustomers);
        setTotalPages(response.totalPages);
      }
    } catch (error) {
      console.error(error);
      errorToast(error.message);
    }
  };

  const handleCreateAccount = async (customerId, updatedData) => {
    try {
      const response = await getCustomerById(customerId);
      setSelectedCustomer(response);
      setCreateNewAccountModalOpen(true);

      if (updatedData) {
        setSanitizedCustomers((prevCustomers) => prevCustomers.map((customer) => (customer.id === updatedData.id ? updatedData : customer)));
      }
    } catch (error) {
      console.error(error);
      errorToast(error.message);
    }
  };

  const handleViewDocument = async (customerId) => {
    try {
      const documentUrl = await viewCustomerDocument(customerId);
      window.open(documentUrl, "_blank");
    } catch (error) {
      console.error(error);
      alert("Failed to load the document.");
    }
  };
  

  const handleAccountCreationSuccess = (updatedCustomer) => {
    setSanitizedCustomers((prevCustomers) => prevCustomers.filter((customer) => customer.id !== updatedCustomer.id));
    setCreateNewAccountModalOpen(false);
  };

  return (
    <div className="card dashboard-card mb-3">
      <nav className="navbar bg-body-tertiary mb-5">
        <div className="container-fluid">
          <h4 className="navbar-brand">Admin Dashboard</h4>
          <div className=" d-flex">
            <button className="btn btn-outline-danger d-flex me-1" type="button" onClick={handleLogout}>
              Logout
            </button>
            <button className="btn btn-outline-secondary d-flex me-1" type="button" onClick={handleBack}>
              Back
            </button>
          </div>
        </div>
      </nav>

      <div className="card inner-card mt-1">
        <div className="card-body">
          <NATable data={sanitizedCustomers} onCreateNewAccount={handleCreateAccount} onViewDocument={handleViewDocument} />
        </div>
      </div>

      {sanitizedCustomers?.length > 0 && (
        <div className="d-flex align-items-center justify-content-between mt-5">
          <Pagination pager={pageObject} onPageChange={onPageChange} />
        </div>
      )}

      <Modal title="Create New Account" isOpen={isCreateNewAccountModalOpen} onClose={() => setCreateNewAccountModalOpen(false)}>
        {selectedCustomer && <CreateNewAccount currentCustomer={selectedCustomer} onClose={() => setCreateNewAccountModalOpen(false)} onCreateAccount={handleAccountCreationSuccess} />}
      </Modal>
    </div>
  );
};

export default FetchNonAccountCustomers;
