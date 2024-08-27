import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBankById, updateBankDetails } from "../../../services/adminService";
import { isAdmin } from "../../../services/loginAuthService";
import Login from "../../loginComponent/Login";
import "../updateBank/UpdateBank.css";
import { errorToast, successToast } from "../../../utils/Toast/Toast";

const UpdateBank = ({ currentBank, onClose, onBankUpdate }) => {
  const navigate = useNavigate();
  const [bank, setBank] = useState(null);
  const [isAdminUser, setIsAdminUser] = useState(false);

  useEffect(() => {
    const fetchBankData = async () => {
      const adminStatus = await isAdmin();
      setIsAdminUser(adminStatus);

      if (!adminStatus) {
        navigate("/");
        return;
      }

      try {
        const bankData = await getBankById(currentBank.bankId);
        setBank(bankData);
      } catch (error) {
        console.error("Error fetching Bank:", error);
        errorToast("Failed to fetch Bank data.")
      }
    };

    fetchBankData();
  }, [navigate, currentBank.bankId]);

  if (!isAdminUser) return <Login />;
  if (!bank) return <div>Loading Bank data...</div>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBank((prevBank) => ({
      ...prevBank,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedBank = await updateBankDetails(bank);
      console.log(updatedBank);
      successToast(`Bank with ID : ${currentBank.bankId} updated successfully`);
      onBankUpdate(currentBank.bankId, updatedBank);
      onClose();
    } catch (error) {
      console.error(error);
      errorToast("Error updating Bank")
    }
  };

  return (
    <div className="card">
      <div className="card-body update-Bank shadow-lg p-4">
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-2">
            <label htmlFor="fullName">Full Name</label>
            <input type="text" className="form-control" id="fullName" name="fullName" value={bank.fullName} onChange={handleChange} />
          </div>
          <div className="form-group mb-2">
            <label htmlFor="abbreviation">Abbreviation</label>
            <input type="text" className="form-control" id="abbreviation" name="abbreviation" value={bank.abbreviation} onChange={handleChange} />
          </div>
          <button type="submit" className="btn btn-primary mt-2">
            Update
          </button>
          <button type="button" className="btn btn-secondary mt-2 ms-2" onClick={onClose}>
            Close
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateBank;
