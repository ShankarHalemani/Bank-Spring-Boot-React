import axios from "axios";

const API_BASE_URL = `http://localhost:8080`;
const accessToken = localStorage.getItem("Authorization");

export const makeNewTransaction = async ({ senderAccount, receiverAccount, amount }) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/transactions/${senderAccount}/${receiverAccount}`,
      {},
      {
        params: {
          amount,
        },

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

export const getAccountByAccountNumber = async (accountNumber) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/accounts/${accountNumber}`, {
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

export const searchTransactions = async ({ size, page, transactionId, accountNumber, startDate, endDate, minAmount, maxAmount }) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/transactions/search`, {
      params: {
        transactionId,
        accountNumber,
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
