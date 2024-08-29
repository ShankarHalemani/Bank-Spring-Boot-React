import React, { useEffect, useState, useRef } from "react";
import { getAllCustomers, searchCustomers as searchCustomersService, getCustomerById, deleteCustomer, activateCustomer } from "../../../services/adminService";
import { sanitizedData } from "../../../utils/helpers/sanitizedData";
import Pagination from "../../../sharedComponents/Pagination/Pagination";
import Modal from "../../../sharedComponents/ModalComponents/Modal";
import UpdateCustomerForm from "../updateCustomer/UpdateCustomer";
import { useNavigate, useSearchParams } from "react-router-dom";
import { errorToast, successToast, warnToast } from "../../../utils/Toast/Toast";
import { isAdmin } from "../../../services/loginAuthService";
import SharedTable from "../../../sharedComponents/SharedTable/SharedTable";

const FetchCustomers = () => {
  const [sanitizedCustomers, setSanitizedCustomers] = useState([]);
  const [urlSearchParams, setURLSearchParams] = useSearchParams();
  const [pageSize, setPageSize] = useState(Number(urlSearchParams.get("pageSize")) || 5);
  const [pageNumber, setPageNumber] = useState(Number(urlSearchParams.get("pageNumber")) || 0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchActive, setSearchActive] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isUpdateCustomerModalOpen, setUpdateCustomerModalOpen] = useState(false);
  const searchRef = useRef();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useState({
    customerId: urlSearchParams.get("customerId") || "",
    fName: urlSearchParams.get("fName") || "",
    lName: urlSearchParams.get("lName") || "",
    activeStatus: urlSearchParams.get("activeStatus") || "",
  });

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
      if (searchActive) {
        await searchCustomers();
      } else {
        await getAllCustomer();
      }
    };

    fetchData();
  }, [pageNumber, pageSize, searchActive]);

  useEffect(() => {
    setURLSearchParams({
      ...searchParams,
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
    });
  }, [pageNumber, pageSize, searchParams]);

  const handleSearchChange = (e) => {
    const { id, value } = e.target;
    setSearchParams((prevParams) => ({
      ...prevParams,
      [id]: value,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPageNumber(0);
    setSearchActive(true);
    setURLSearchParams({ ...searchParams, pageNumber: "0", pageSize: pageSize.toString() });
    searchCustomers();
  };

  const handleReset = () => {
    searchRef.current.reset();
    setSearchParams({
      customerId: "",
      fName: "",
      lName: "",
      activeStatus: "",
    });
    setPageNumber(0);
    setPageSize(5);
    setSearchActive(false);
    setURLSearchParams({ pageNumber: "0", pageSize: "5" });
    getAllCustomer();
  };

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
      const response = await getAllCustomers({
        size: pageSize,
        page: pageNumber,
      });

      if (response.content) {
        const keysTobeSelected = ["id", "firstName", "lastName", "totalBalance", "active"];
        const sanitized = sanitizedData({ data: response.content, keysTobeSelected });

        setSanitizedCustomers(sanitized);
        setTotalPages(response.totalPages);
        setSearchActive(false);
      }
    } catch (error) {
      console.error(error);
      errorToast(error.message);
    }
  };

  const searchCustomers = async () => {
    try {
      const response = await searchCustomersService({
        ...searchParams,
        size: pageSize,
        page: pageNumber,
      });

      if (response.content) {
        const keysTobeSelected = ["id", "firstName", "lastName", "totalBalance", "active"];
        const sanitized = sanitizedData({ data: response.content, keysTobeSelected });

        setSanitizedCustomers(sanitized);
        setTotalPages(response.totalPages);
        setSearchActive(true);
      }
    } catch (error) {
      console.error(error);
      errorToast(error.message);
    }
  };

  const handleUpdateCustomer = async (customerId, updatedData) => {
    try {
      const customerData = await getCustomerById(customerId);
      setSelectedCustomer(customerData);
      setUpdateCustomerModalOpen(true);

      if (updatedData) {
        getAllCustomer();
        // setSanitizedCustomers((prevCustomers) => prevCustomers.map((customer) => (customer.id === updatedData.id ? { ...customer, ...updatedData } : customer)));
        setUpdateCustomerModalOpen(false);
      }
    } catch (error) {
      console.error(error);
      errorToast(error.message);
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    try {
      await deleteCustomer(customerId);
      successToast(`Customer with ID : ${customerId} removed successfully`);
      setSanitizedCustomers((prevCustomers) => prevCustomers.map((customer) => (customer.id === customerId ? { ...customer, active: false } : customer)));
    } catch (error) {
      console.error(error);
      errorToast(error.message || "Error removing customer");
    }
  };

  const handleActivateCustomer = async (customerId) => {
    try {
      const response = await activateCustomer(customerId);
      successToast(`Customer with ID : ${response.id} activated successfully`);

      setSanitizedCustomers((prevCustomers) => prevCustomers.map((customer) => (customer.id === customerId ? { ...customer, active: true } : customer)));
    } catch (error) {
      console.error(error);
      errorToast(error.message || "Error activating customer");
    }
  };

  const actions = {
    activate: handleActivateCustomer,
    delete: handleDeleteCustomer,
    update: handleUpdateCustomer,
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

      <form className="d-flex" role="search" ref={searchRef} onSubmit={handleSearch}>
        <input id="customerId" className="form-control me-2" type="search" placeholder="Customer ID" aria-label="Search" value={searchParams.customerId} onChange={handleSearchChange} />
        <input id="fName" className="form-control me-2" type="search" placeholder="First Name" aria-label="Search" value={searchParams.fName} onChange={handleSearchChange} />
        <input id="lName" className="form-control me-2" type="search" placeholder="Last Name" aria-label="Search" value={searchParams.lName} onChange={handleSearchChange} />
        <select id="activeStatus" className="form-select" aria-label="Default select example" value={searchParams.activeStatus} onChange={handleSearchChange}>
          <option value="">Customer Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
        <button className="btn btn-secondary ms-2" type="submit">
          Search
        </button>
        <button type="reset" className="btn btn-warning ms-2" onClick={handleReset}>
          Reset
        </button>
      </form>

      <div className="card inner-card mt-1">
        <div className="card-body">
          <SharedTable data={sanitizedCustomers} actions={actions} />
        </div>
      </div>

      {sanitizedCustomers?.length > 0 && (
        <div className="d-flex align-items-center justify-content-between mt-5">
          <Pagination pager={pageObject} onPageChange={onPageChange} />
        </div>
      )}

      <Modal title="Update Customer" isOpen={isUpdateCustomerModalOpen} onClose={() => setUpdateCustomerModalOpen(false)}>
        {selectedCustomer && <UpdateCustomerForm currentCustomer={selectedCustomer} onCustomerUpdate={handleUpdateCustomer} onClose={() => setUpdateCustomerModalOpen(false)} />}
      </Modal>
    </div>
  );
};

export default FetchCustomers;
