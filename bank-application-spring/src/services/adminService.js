import axios from "axios";

const API_BASE_URL = `http://localhost:8080`;
const accessToken = localStorage.getItem("Authorization");

export const getAllCustomers = async ({ size, page }) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/customers`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
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
    throw error;
  }
};

export const getNonAccountCustomers = async ({ size, page }) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/customers/active-no-accounts`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
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
    throw error;
  }
};

export const getCustomerById = async (customerId) => {
  console.log(customerId);

  try {
    const response = await axios.get(`${API_BASE_URL}/api/customers/${customerId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateCustomerDetails = async (customer) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/customers`,
      {
        customerId: customer.id,
        firstName: customer.firstName,
        lastName: customer.lastName,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addCustomer = async (customer) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/customers`,
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
    throw error;
  }
};

export const searchCustomers = async ({ size, page, customerId, fName, lName, activeStatus }) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/customers/search`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
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
    throw error;
  }
};

export const deleteCustomer = async (customerId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/customers/${customerId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const activateCustomer = async (customerId) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/customers/activate/${customerId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllBanks = async ({ size, page }) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/banks`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },

      params: {
        size,
        page,
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getBankById = async (bankId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/banks/${bankId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateBankDetails = async (bank) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/banks`,
      {
        bankId: bank.bankId,
        fullName: bank.fullName,
        abbreviation: bank.abbreviation,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addBank = async (bank) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/banks`,
      {
        fullName: bank.fullName,
        abbreviation: bank.abbreviation,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const searchBanks = async ({ size, page, bankId, fullName, abbreviation, activeStatus }) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/banks/search`, {
      params: {
        bankId,
        fullName,
        abbreviation,
        active: activeStatus,
        page,
        size,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteBank = async (bankId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/banks/${bankId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const activateBank = async (bankId) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/banks/activate/${bankId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllAccounts = async ({ size, page }) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/accounts`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },

      params: {
        size,
        page,
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createNewAccount = async ({ customerId, bankId }) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/accounts/${customerId}/${bankId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const searchAccounts = async ({ size, page, accountNumber, minBalance, maxBalance, bankName, activeStatus }) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/accounts/search`, {
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
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteAccount = async (accountNumber) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/accounts/${accountNumber}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const activateAccount = async (accountNumber) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/accounts/activate/${accountNumber}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const searchAccountsTransactions = async ({ size, page, transactionId, senderAccountNumber, receiverAccountNumber, startDate, endDate, minAmount, maxAmount }) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/accounts/transactions/search`, {
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
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const viewCustomerDocument = async (customerId) => {
  try {
    console.log("Sending request to view document for customer ID:", customerId);
    const response = await axios.get(`${API_BASE_URL}/api/file/view/${customerId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      responseType: "arraybuffer",
    });
    console.log("Response received:", response);

    const file = new Blob([response.data], { type: response.headers["content-type"] });
    const fileURL = URL.createObjectURL(file);
    return fileURL;
  } catch (error) {
    throw error;
  }
};
