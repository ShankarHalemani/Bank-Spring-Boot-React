import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./components/loginComponent/Login";
import AdminHomepage from "./components/adminComponents/AdminHomepage";
import Register from "./components/registerComponent/Register";
import FetchCustomers from "./components/customerComponents/FetchCustomers/FetchCustomers ";
import CustomerHome from "./components/customerComponents/customerHome/CustomerHome";
import NotFound from "./utils/helpers/NotFound";
import { ToastContainer } from "react-toastify";
import FetchBanks from "./components/bankComponents/FetchBanks/FetchBanks";
import FetchAccounts from "./components/accountComponents/fetchAccounts/FetchAccounts";
import FetchAccountsTransactions from "./components/accountComponents/fetchAccountsTransactions/FetchAccountsTransactions";
import FetchNonAccountCustomers from "./components/customerComponents/nonAccountCustomers/FetchNonAccountCustomers";
import FetchTransactions from "./components/customerComponents/Transactions/FetchTransactions";

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route exact path="/" element={<Login />}></Route>
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/admin-dashboard" element={<AdminHomepage />} />
        <Route exact path="/customer-dashboard" element={<CustomerHome />} />
        <Route exact path="/fetch-customers" element={<FetchCustomers />} />
        <Route exact path="/fetch-banks" element={<FetchBanks />} />
        <Route exact path="/fetch-accounts" element={<FetchAccounts />} />
        <Route exact path="/fetch-accounts-transactions" element={<FetchAccountsTransactions />} />
        <Route exact path="/fetch-nonaccount-customers" element={<FetchNonAccountCustomers />} />
        <Route exact path="/fetch-transactions" element={<FetchTransactions />} />
        <Route exact path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
