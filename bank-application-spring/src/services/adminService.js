import axios from "axios";
import { errorToast, successToast } from "../utils/Toast/Toast";

export const getAllCustomers = async ({ size, page }) => {
  try {
    const response = await axios.get("http://localhost:8080/api/customers", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Authorization")}`,
      },
      params: {
        size,
        page,
      },
    });

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    errorToast(error.response.data.message);
  }
};

export const getNonAccountCustomers = async ({ size, page }) => {
  try {
    const response = await axios.get("http://localhost:8080/api/customers/active-no-accounts", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Authorization")}`,
      },
      params: {
        size,
        page,
      },
    });

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    errorToast(error.response.data.message);
  }
};

export const getCustomerById = async (customerId) => {
  console.log(customerId);

  try {
    const response = await axios.get(`http://localhost:8080/api/customers/${customerId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Authorization")}`,
      },
    });
    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error(error);
    errorToast(error.response.data.message);
  }
};

export const updateCustomerDetails = async (customer) => {
  try {
    const response = await axios.put(
      `http://localhost:8080/api/customers`,
      {
        customerId: customer.id,
        firstName: customer.firstName,
        lastName: customer.lastName,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Authorization")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    errorToast(error.response.data.message);
  }
};

export const addCustomer = async (customer) => {
  let accessToken = localStorage.getItem("Authorization");
  try {
    const response = await axios.post(
      `http://localhost:8080/api/customers`,
      {
        username: customer.username,
        firstName: customer.firstName,
        lastName: customer.lastName,
        password: customer.password,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error(error);
    errorToast(error.response.data.message);
  }
};

export const searchCustomers = async ({ size, page, customerId, fName, lName, activeStatus }) => {
  try {
    const response = await axios.get("http://localhost:8080/api/customers/search", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Authorization")}`,
      },
      params: {
        customerId,
        firstName: fName,
        lastName: lName,
        active: activeStatus,
        size,
        page,
      },
    });

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    errorToast(error.response.data.message);
  }
};

export const deleteCustomer = async (customerId) => {
  try {
    const response = await axios.delete(`http://localhost:8080/api/customers/${customerId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Authorization")}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    errorToast(error.response.data.message);
  }
};

export const activateCustomer = async (customerId) => {
  try {
    const response = await axios.put(
      `http://localhost:8080/api/customers/activate/${customerId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Authorization")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    errorToast(error.response.data.message);
  }
};

export const getAllBanks = async ({ size, page }) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/banks`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Authorization")}`,
      },

      params: {
        size,
        page,
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    errorToast(error.response.data.message);
  }
};

export const getBankById = async (bankId) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/banks/${bankId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Authorization")}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    errorToast(error.response.data.message);
  }
};

export const updateBankDetails = async (bank) => {
  try {
    const response = await axios.put(
      `http://localhost:8080/api/banks`,
      {
        bankId: bank.bankId,
        fullName: bank.fullName,
        abbreviation: bank.abbreviation,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Authorization")}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(error);
    errorToast(error.response.data.message);
  }
};

export const addBank = async (bank) => {
  try {
    const response = await axios.post(
      `http://localhost:8080/api/banks`,
      {
        fullName: bank.fullName,
        abbreviation: bank.abbreviation,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Authorization")}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(error);
    errorToast(error.response.data.message);
  }
};

export const searchBanks = async ({ size, page, bankId, fullName, abbreviation, activeStatus }) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/banks/search`, {
      params: {
        bankId,
        fullName,
        abbreviation,
        active: activeStatus,
        page,
        size,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Authorization")}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    errorToast(error.response.data.message);
  }
};

export const deleteBank = async (bankId) => {
  try {
    const response = await axios.delete(`http://localhost:8080/api/banks/${bankId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Authorization")}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    errorToast(error.response.data.message);
  }
};

export const activateBank = async (bankId) => {
  try {
    const response = await axios.put(
      `http://localhost:8080/api/banks/activate/${bankId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Authorization")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    errorToast(error.response.data.message);
  }
};

export const getAllAccounts = async ({ size, page }) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/accounts`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Authorization")}`,
      },

      params: {
        size,
        page,
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    errorToast(error.response.data.message);
  }
};

export const createNewAccount = async ({ customerId, bankId }) => {
  try {
    const response = await axios.post(
      `http://localhost:8080/api/accounts/${customerId}/${bankId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Authorization")}`,
        },
      }
    );

    successToast(`Account created for customer with ID : ${customerId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    errorToast(error.response.data.message);
  }
};

export const searchAccounts = async ({ size, page, accountNumber, minBalance, maxBalance, bankName, activeStatus }) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/accounts/search`, {
      params: {
        accountNumber,
        minBalance,
        maxBalance,
        bankName,
        activeStatus,
        page,
        size,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Authorization")}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    errorToast(error.response.data.message);
  }
};

export const deleteAccount = async (accountNumber) => {
  try {
    const response = await axios.delete(`http://localhost:8080/api/accounts/${accountNumber}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Authorization")}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    errorToast(error.response.data.message);
  }
};

export const activateAccount = async (accountNumber) => {
  try {
    const response = await axios.put(
      `http://localhost:8080/api/accounts/activate/${accountNumber}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Authorization")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    errorToast(error.response.data.message);
  }
};

export const searchAccountsTransactions = async ({ size, page, transactionId, senderAccountNumber, receiverAccountNumber, startDate, endDate, minAmount, maxAmount }) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/accounts/transactions/search`, {
      params: {
        transactionId,
        senderAccountNumber,
        receiverAccountNumber,
        startDate,
        endDate,
        minAmount,
        maxAmount,
        page,
        size,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Authorization")}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    errorToast(error.response.data.message);
  }
};

export const viewCustomerDocument = async (customerId) => {
  try {
    console.log("Sending request to view document for customer ID:", customerId);
    const response = await axios.get(`http://localhost:8080/api/file/view/${customerId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("Authorization")}`,
      },
      responseType: "arraybuffer",
    });
    console.log("Response received:", response);

    const file = new Blob([response.data], { type: response.headers["content-type"] });
    const fileURL = URL.createObjectURL(file);
    return fileURL;
  } catch (error) {
    errorToast(error.response.data.message);
  }
};
