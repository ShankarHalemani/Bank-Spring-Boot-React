import React, { useEffect, useState, useRef } from "react";
import { getAllAccounts, searchAccounts as searchAccountsService, deleteAccount, activateAccount } from "../../../services/adminService";
import { sanitizedData } from "../../../utils/helpers/sanitizedData";
import AccountTable from "../../../sharedComponents/accountTable/AccountTable";
import Pagination from "../../../sharedComponents/Pagination/Pagination";
import { useNavigate, useSearchParams } from "react-router-dom";
import { errorToast, successToast, warnToast } from "../../../utils/Toast/Toast";
import { isAdmin } from "../../../services/loginAuthService";

const FetchAccounts = () => {
  const [sanitizedAccounts, setSanitizedAccounts] = useState([]);
  const [urlSearchParams, setURLSearchParams] = useSearchParams();
  const [pageSize, setPageSize] = useState(Number(urlSearchParams.get("pageSize")) || 5);
  const [pageNumber, setPageNumber] = useState(Number(urlSearchParams.get("pageNumber")) || 0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchActive, setSearchActive] = useState(true);
  const searchRef = useRef();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useState({
    accountNumber: urlSearchParams.get("accountNumber") || "",
    minBalance: urlSearchParams.get("minBalance") || "",
    maxBalance: urlSearchParams.get("maxBalance") || "",
    bankName: urlSearchParams.get("bankName") || "",
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
        await searchAccounts();
      } else {
        await getAllAccount();
      }
    };

    fetchData();
  }, [pageNumber, pageSize, searchActive]);

  useEffect(() => {
    setURLSearchParams((prevParams) => ({
      ...prevParams,
      pageNumber,
      pageSize,
    }));
  }, [pageNumber, pageSize]);

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
    setURLSearchParams({ ...searchParams });
    searchAccounts();
  };

  const handleReset = () => {
    searchRef.current.reset();
    setSearchParams({
      accountNumber: "",
      minBalance: "",
      maxBalance: "",
      bankName: "",
      activeStatus: "",
    });
    setPageNumber(0);
    setSearchActive(false);
    setURLSearchParams({});
    setPageNumber(0);
    setPageSize(5);
    getAllAccount();
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

  const getAllAccount = async () => {
    try {
      const response = await getAllAccounts({
        size: pageSize,
        page: pageNumber,
      });

      if (response.content) {
        const keysTobeSelected = ["accountNumber", "balance", "bankResponseDTO.fullName", "active"];
        const sanitized = sanitizedData({ data: response.content, keysTobeSelected });

        setSanitizedAccounts(sanitized);
        setTotalPages(response.totalPages);
        setSearchActive(false);
      }
    } catch (error) {
      console.error(error);
      errorToast(error.message);
    }
  };

  const searchAccounts = async () => {
    try {
      const response = await searchAccountsService({
        ...searchParams,
        size: pageSize,
        page: pageNumber,
      });

      if (response.content) {
        const keysTobeSelected = ["accountNumber", "balance", "bankResponseDTO.fullName", "active"];
        const sanitized = sanitizedData({ data: response.content, keysTobeSelected });

        setSanitizedAccounts(sanitized);
        setTotalPages(response.totalPages);
        setSearchActive(true);
      }
    } catch (error) {
      console.error(error);
      errorToast(error.message);
    }
  };

  const handleDeleteAccount = async (accountNumber) => {
    try {
      await deleteAccount(accountNumber);
      successToast(`Account with ID : ${accountNumber} removed successfully`);
      setSanitizedAccounts((prevAccounts) => prevAccounts.map((account) => (account.accountNumber === accountNumber ? { ...account, active: false } : account)));
    } catch (error) {
      console.error(error);
      errorToast(error.message || "Error removing Account");
    }
  };

  const handleActivateAccount = async (accountNumber) => {
    try {
      await activateAccount(accountNumber);
      successToast(`Account with ID : ${accountNumber} activated successfully`);
      setSanitizedAccounts((prevAccounts) => prevAccounts.map((account) => (account.accountNumber === accountNumber ? { ...account, active: true } : account)));
    } catch (error) {
      console.error(error);
      errorToast(error.message || "Error activating Account");
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
        <input id="accountNumber" className="form-control me-2" type="search" placeholder="Account Number" aria-label="Search" value={searchParams.accountNumber} onChange={handleSearchChange} />
        <input id="minBalance" className="form-control me-2" type="search" placeholder="Minimum Balance" aria-label="Search" value={searchParams.minBalance} onChange={handleSearchChange} />
        <input id="maxBalance" className="form-control me-2" type="search" placeholder="Maximum Balance" aria-label="Search" value={searchParams.maxBalance} onChange={handleSearchChange} />
        <input id="bankName" className="form-control me-2" type="search" placeholder="Bank Name" aria-label="Search" value={searchParams.bankName} onChange={handleSearchChange} />
        <select id="activeStatus" className="form-select" aria-label="Default select example" value={searchParams.activeStatus} onChange={handleSearchChange}>
          <option value="">Account Status</option>
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
          <AccountTable data={sanitizedAccounts} onDeleteAccount={handleDeleteAccount} onActivateAccount={handleActivateAccount} />
        </div>
      </div>

      {sanitizedAccounts?.length > 0 && (
        <div className="d-flex align-items-center justify-content-between mt-5">
          <Pagination pager={pageObject} onPageChange={onPageChange} />
        </div>
      )}
    </div>
  );
};

export default FetchAccounts;
