import React, { useEffect, useRef, useState } from "react";
import { sanitizedData } from "../../../utils/helpers/sanitizedData";
import Pagination from "../../../sharedComponents/Pagination/Pagination";
import { useNavigate, useSearchParams } from "react-router-dom";
import { warnToast } from "../../../utils/Toast/Toast";
import { isCustomer } from "../../../services/loginAuthService";
import { searchTransactions } from "../../../services/customerService";
import { getCustomerById } from "../../../services/adminService";
import SharedTable from "../../../sharedComponents/SharedTable/SharedTable";

const FetchTransactions = () => {
  const [sanitizedTransactions, setSanitizedTransactions] = useState([]);
  const [urlSearchParams, setURLSearchParams] = useSearchParams();
  const [pageSize, setPageSize] = useState(Number(urlSearchParams.get("pageSize")) || 5);
  const [pageNumber, setPageNumber] = useState(Number(urlSearchParams.get("pageNumber")) || 0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchActive, setSearchActive] = useState(true);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const navigate = useNavigate();
  const searchRef = useRef();
  const [searchParams, setSearchParams] = useState({
    transactionId: urlSearchParams.get("transactionId") || "",
    accountNumber: urlSearchParams.get("accountNumber") || "",
    startDate: urlSearchParams.get("startDate") || "",
    endDate: urlSearchParams.get("endDate") || "",
    minAmount: urlSearchParams.get("minAmount") || "",
    maxAmount: urlSearchParams.get("maxAmount") || "",
  });

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
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (searchActive) {
        await searchTransaction();
      } else {
        await getAllTransaction();
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
    searchTransaction();
  };

  const handleReset = () => {
    searchRef.current.reset();
    setSearchParams({ transactionId: "", accountNumber: "", startDate: "", endDate: "", minAmount: "", maxAmount: "" });
    setPageNumber(0);
    setPageSize(5);
    setSearchActive(false);
    setURLSearchParams({ pageNumber: "0", pageSize: "5" });
    getAllTransaction();
  };

  const onPageChange = (newPageNumber) => {
    setPageNumber(newPageNumber);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleBack = () => {
    navigate("/customer-dashboard");
  };

  const pageObject = {
    pageSize,
    pageNumber,
    setPageNumber,
    setPageSize,
    totalPages,
  };

  const getAllTransaction = async () => {
    try {
      const response = await searchTransactions({
        size: pageSize,
        page: pageNumber,
      });

      if (response.content) {
        const keysTobeSelected = ["transactionId", "senderAccountNumber", "receiverAccountNumber", "amount", "transactionTimestamp"];
        const sanitized = sanitizedData({ data: response.content, keysTobeSelected });

        setSanitizedTransactions(sanitized);
        setTotalPages(response.totalPages);
        setSearchActive(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const searchTransaction = async () => {
    try {
      const response = await searchTransactions({
        ...searchParams,
        size: pageSize,
        page: pageNumber,
      });

      if (response.content) {
        const keysTobeSelected = ["transactionId", "senderAccountNumber", "receiverAccountNumber", "amount", "transactionTimestamp"];
        const sanitized = sanitizedData({ data: response.content, keysTobeSelected });

        setSanitizedTransactions(sanitized);
        setTotalPages(response.totalPages);
        setSearchActive(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="card dashboard-card mb-3">
      <nav className="navbar bg-body-tertiary mb-5">
        <div className="container-fluid">
          <a className="navbar-brand" href="/customer-dashboard">
            <i className="fas fa-user-circle me-2"></i>
            {currentCustomer ? `${currentCustomer.id} | ${currentCustomer.firstName} ${currentCustomer.lastName}` : "Customer Dashboard"}
          </a>
          <div className="d-flex align-items-center">
            {currentCustomer && (
              <span className="me-4" style={{ color: "black" }}>
                <i className="fas fa-wallet me-2"></i>
                Balance: Rs.{currentCustomer.totalBalance.toFixed(2)}
              </span>
            )}
            <button className="btn btn-outline-danger d-flex me-1" type="button" onClick={handleLogout}>
              Logout
            </button>
            <button className="btn btn-outline-secondary d-flex me-1" type="button" onClick={handleBack}>
              Back
            </button>
          </div>
        </div>
      </nav>

      <form className="d-flex" role="search" onSubmit={handleSearch} ref={searchRef}>
        <input id="transactionId" className="form-control me-2" type="search" placeholder="Transaction ID" aria-label="Search" value={searchParams.transactionId} onChange={handleSearchChange} />
        <input id="startDate" className="form-control me-2" type="date" placeholder="Start Date" aria-label="Search" value={searchParams.startDate} onChange={handleSearchChange} />
        <input id="endDate" className="form-control me-2" type="date" placeholder="End Date" aria-label="Search" value={searchParams.endDate} onChange={handleSearchChange} />
        <input id="minAmount" className="form-control me-2" type="number" placeholder="Minimum Amount" aria-label="Search" value={searchParams.minAmount} onChange={handleSearchChange} />
        <input id="maxAmount" className="form-control me-2" type="number" placeholder="Maximum Amount" aria-label="Search" value={searchParams.maxAmount} onChange={handleSearchChange} />
        <select id="accountNumber" className="form-select me-2" value={searchParams.accountNumber} onChange={handleSearchChange}>
          <option value="">Select Account Number</option>
          {currentCustomer &&
            currentCustomer.accounts.map((account) => (
              <option key={account.accountNumber} value={account.accountNumber}>
                {account.accountNumber}
              </option>
            ))}
        </select>
        <button className="btn btn-secondary ms-2" type="submit">
          Search
        </button>
        <button type="button" className="btn btn-warning ms-2" onClick={handleReset}>
          Reset
        </button>
      </form>

      <div className="card inner-card mt-1">
        <div className="card-body">
          <SharedTable data={sanitizedTransactions} />
        </div>
      </div>

      {sanitizedTransactions?.length > 0 && (
        <div className="d-flex align-items-center justify-content-between mt-5">
          <Pagination pager={pageObject} onPageChange={onPageChange} />
        </div>
      )}
    </div>
  );
};

export default FetchTransactions;
