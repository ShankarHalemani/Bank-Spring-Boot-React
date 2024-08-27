import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Pagination from "../../../sharedComponents/Pagination/Pagination";
import Modal from "../../../sharedComponents/ModalComponents/Modal";
import UpdateBank from "../updateBank/UpdateBank";
import BankTable from "../../../sharedComponents/bankTable/BankTable";
import { sanitizedData } from "../../../utils/helpers/sanitizedData";
import { errorToast, successToast, warnToast } from "../../../utils/Toast/Toast";
import { activateBank, deleteBank, getAllBanks, getBankById, searchBanks as searchBanksService } from "../../../services/adminService";
import { isAdmin } from "../../../services/loginAuthService";

const FetchBanks = () => {
  const [sanitizedBanks, setSanitizedBanks] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchActive, setSearchActive] = useState(true);
  const [selectedBank, setSelectedBank] = useState(null);
  const [isUpdateBankModalOpen, setUpdateBankModalOpen] = useState(false);
  const searchRef = useRef();
  const navigate = useNavigate();
  const [urlSearchParams, setURLSearchParams] = useSearchParams();
  const [searchParams, setSearchParams] = useState({
    bankId: urlSearchParams.get("bankId") || "",
    fullName: urlSearchParams.get("fullName") || "",
    abbreviation: urlSearchParams.get("abbreviation") || "",
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
        await searchBanks();
      } else {
        await getAllBank();
      }
    };

    fetchData();
  }, [pageNumber, pageSize, searchActive]);

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
    searchBanks();
  };

  const handleReset = () => {
    searchRef.current.reset();
    setSearchParams({
      bankId: "",
      fullName: "",
      abbreviation: "",
      activeStatus: "",
    });
    setPageNumber(0);
    setSearchActive(false);
    setURLSearchParams({});
    getAllBank();
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

  const getAllBank = async () => {
    try {
      const response = await getAllBanks({
        size: pageSize,
        page: pageNumber,
      });

      if (response.content) {
        const keysTobeSelected = ["bankId", "fullName", "abbreviation", "active"];
        const sanitized = sanitizedData({ data: response.content, keysTobeSelected });

        setSanitizedBanks(sanitized);
        setTotalPages(response.totalPages);
        setSearchActive(false);
      }
    } catch (error) {
      console.error(error);
      errorToast(error.message);
    }
  };

  const searchBanks = async () => {
    try {
      const response = await searchBanksService({
        ...searchParams,
        size: pageSize,
        page: pageNumber,
      });

      if (response.content) {
        const keysTobeSelected = ["bankId", "fullName", "abbreviation", "active"];
        const sanitized = sanitizedData({ data: response.content, keysTobeSelected });

        setSanitizedBanks(sanitized);
        setTotalPages(response.totalPages);
        setSearchActive(true);
      }
    } catch (error) {
      console.error(error);
      errorToast(error.message);
    }
  };

  const handleUpdateBank = async (bankId, updatedData) => {
    try {
      const bankData = await getBankById(bankId);
      setSelectedBank(bankData);
      setUpdateBankModalOpen(true);

      if (updatedData) {
        setSanitizedBanks((prevBanks) => prevBanks.map((bank) => (bank.bankId === updatedData.bankId ? { ...bank, ...updatedData } : bank)));
        setUpdateBankModalOpen(false);
      }
    } catch (error) {
      console.error(error);
      errorToast(error.message);
    }
  };

  const handleDeleteBank = async (bankId) => {
    try {
      await deleteBank(bankId);
      successToast(`Bank with ID : ${bankId} removed successfully`);
      setSanitizedBanks((prevBanks) => prevBanks.map((bank) => (bank.bankId === bankId ? { ...bank, active: false } : bank)));
    } catch (error) {
      console.error(error);
      errorToast(error.message || "Error removing bank");
    }
  };

  const handleActivateBank = async (bankId) => {
    try {
      const response = await activateBank(bankId);
      successToast(`Bank with ID : ${response.bankId} activated successfully`);

      setSanitizedBanks((prevBanks) => prevBanks.map((bank) => (bank.bankId === bankId ? { ...bank, active: true } : bank)));
    } catch (error) {
      console.error(error);
      errorToast(error.message || "Error activating bank");
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
        <input id="bankId" className="form-control me-2" type="search" placeholder="Bank ID" aria-label="Search" value={searchParams.bankId} onChange={handleSearchChange} />
        <input id="fullName" className="form-control me-2" type="search" placeholder="Bank Full Name" aria-label="Search" value={searchParams.fullName} onChange={handleSearchChange} />
        <input id="abbreviation" className="form-control me-2" type="search" placeholder="Bank Abbreviation" aria-label="Search" value={searchParams.abbreviation} onChange={handleSearchChange} />
        <select id="activeStatus" className="form-select" aria-label="Default select example" value={searchParams.activeStatus} onChange={handleSearchChange}>
          <option value="">Bank Status</option>
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
          <BankTable data={sanitizedBanks} onUpdateBank={handleUpdateBank} onDeleteBank={handleDeleteBank} onActivateBank={handleActivateBank} />
        </div>
      </div>

      {sanitizedBanks?.length > 0 && (
        <div className="d-flex align-items-center justify-content-between mt-5">
          <Pagination pager={pageObject} onPageChange={onPageChange} />
        </div>
      )}

      <Modal title="Update Bank" isOpen={isUpdateBankModalOpen} onClose={() => setUpdateBankModalOpen(false)}>
        {selectedBank && <UpdateBank currentBank={selectedBank} onBankUpdate={handleUpdateBank} onClose={() => setUpdateBankModalOpen(false)} />}
      </Modal>
    </div>
  );
};

export default FetchBanks;
