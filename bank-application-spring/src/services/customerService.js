import axios from "axios";
import { errorToast } from "../utils/Toast/Toast";

export const makeNewTransaction = async ({ senderAccount, receiverAccount, amount }) => {
  try {
    const response = await axios.post(
      `http://localhost:8080/api/transactions/${senderAccount}/${receiverAccount}`,
      {},
      {
        params: {
          amount,
        },

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

export const getAccountByAccountNumber = async (accountNumber) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/accounts/${accountNumber}`, {
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


export const searchTransactions = async ({ size, page, transactionId, accountNumber, startDate, endDate, minAmount, maxAmount }) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/transactions/search`, {
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
        Authorization: `Bearer ${localStorage.getItem("Authorization")}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
    errorToast(error.response.data.message);
  }
};
