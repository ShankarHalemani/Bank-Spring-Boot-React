import React, { useEffect, useState, useRef } from "react";
import { searchAccountsTransactions } from "../../../services/adminService";
import { sanitizedData } from "../../../utils/helpers/sanitizedData";
import Pagination from "../../../sharedComponents/Pagination/Pagination";
import { useNavigate, useSearchParams } from "react-router-dom";
import { warnToast } from "../../../utils/Toast/Toast";
import { isAdmin } from "../../../services/loginAuthService";
import SharedTable from "../../../sharedComponents/SharedTable/SharedTable";

const FetchAccountsTransactions = () => {
  const [sanitizedAccountTransactions, setSanitizedAccountTransactions] = useState([]);
  const [urlSearchParams, setURLSearchParams] = useSearchParams();
  const [pageSize, setPageSize] = useState(Number(urlSearchParams.get("pageSize")) || 5);
  const [pageNumber, setPageNumber] = useState(Number(urlSearchParams.get("pageNumber")) || 0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchActive, setSearchActive] = useState(true);
  const searchRef = useRef();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useState({
    transactionId: urlSearchParams.get("transactionId") || "",
    senderAccountNumber: urlSearchParams.get("senderAccountNumber") || "",
    receiverAccountNumber: urlSearchParams.get("receiverAccountNumber") || "",
    startDate: urlSearchParams.get("startDate") || "",
    endDate: urlSearchParams.get("endDate") || "",
    minAmount: urlSearchParams.get("minAmount") || "",
    maxAmount: urlSearchParams.get("maxAmount") || "",
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
        await searchAccountTransactions();
      } else {
        await getAllAccountsTransaction();
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
    searchAccountTransactions();
  };

  const handleReset = () => {
    searchRef.current.reset();
    setSearchParams({
      transactionId: "",
      senderAccountNumber: "",
      receiverAccountNumber: "",
      startDate: "",
      endDate: "",
      minAmount: "",
      maxAmount: "",
    });
    setPageNumber(0);
    setPageSize(5);
    setSearchActive(false);
    setURLSearchParams({ pageNumber: "0", pageSize: "5" });
    getAllAccountsTransaction();
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

  const getAllAccountsTransaction = async () => {
    try {
      const response = await searchAccountsTransactions({
        size: pageSize,
        page: pageNumber,
      });

      if (response.content) {
        const keysTobeSelected = ["transactionId", "senderAccountNumber", "receiverAccountNumber", "amount", "transactionTimestamp"];
        const sanitized = sanitizedData({ data: response.content, keysTobeSelected });

        setSanitizedAccountTransactions(sanitized);
        setTotalPages(response.totalPages);
        setSearchActive(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const searchAccountTransactions = async () => {
    try {
      const response = await searchAccountsTransactions({
        ...searchParams,
        size: pageSize,
        page: pageNumber,
      });

      if (response.content) {
        const keysTobeSelected = ["transactionId", "senderAccountNumber", "receiverAccountNumber", "amount", "transactionTimestamp"];
        const sanitized = sanitizedData({ data: response.content, keysTobeSelected });

        setSanitizedAccountTransactions(sanitized);
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
        <input id="transactionId" className="form-control me-2" type="search" placeholder="Transaction ID" aria-label="Search" value={searchParams.transactionId} onChange={handleSearchChange} />
        <input id="senderAccountNumber" className="form-control me-2" type="search" placeholder="Sender Account Number" aria-label="Search" value={searchParams.senderAccountNumber} onChange={handleSearchChange} />
        <input id="receiverAccountNumber" className="form-control me-2" type="search" placeholder="Reciever Account Number" aria-label="Search" value={searchParams.receiverAccountNumber} onChange={handleSearchChange} />
        <input id="startDate" className="form-control me-2" type="date" placeholder="Start Date" aria-label="Search" value={searchParams.startDate} onChange={handleSearchChange} />
        <input id="endDate" className="form-control me-2" type="date" placeholder="End Date" aria-label="Search" value={searchParams.endDate} onChange={handleSearchChange} />
        <input id="minAmount" className="form-control me-2" type="search" placeholder="Minimum Amount" aria-label="Search" value={searchParams.minAmount} onChange={handleSearchChange} />
        <input id="maxAmount" className="form-control me-2" type="search" placeholder="Maximum Amount" aria-label="Search" value={searchParams.maxAmount} onChange={handleSearchChange} />
        <button className="btn btn-secondary ms-2" type="submit">
          Search
        </button>
        <button type="reset" className="btn btn-warning ms-2" onClick={handleReset}>
          Reset
        </button>
      </form>

      <div className="card inner-card mt-1">
        <div className="card-body">
          <SharedTable data={sanitizedAccountTransactions} />
        </div>
      </div>

      {sanitizedAccountTransactions?.length > 0 && (
        <div className="d-flex align-items-center justify-content-between mt-5">
          <Pagination pager={pageObject} onPageChange={onPageChange} />
        </div>
      )}
    </div>
  );
};

export default FetchAccountsTransactions;
