import axios from "axios";

const API_BASE_URL = `http://localhost:8080`;

export const login = async ({ userInput, passwordInput }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      username: userInput,
      password: passwordInput,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const register = async ({ username, password, firstName, lastName, role, file = null }) => {
  try {
    const formData = new FormData();
    formData.append("registerDTO", JSON.stringify({ username, password, firstName, lastName }));
    formData.append("role", role);

    if (file && role.toLowerCase() !== "admin") {
      formData.append("file", file);
    }

    const response = await axios.post(`${API_BASE_URL}/api/auth/register`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export const isAdmin = async () => {
  const token = localStorage.getItem("Authorization");

  if (!token) {
    return false;
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/api/auth/admin-verification`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        accessToken: token,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const isCustomer = async () => {
  const token = localStorage.getItem("Authorization");

  if (!token) {
    return false;
  }

  try {
    const token = localStorage.getItem("Authorization");
    const response = await axios.get(`${API_BASE_URL}/api/auth/customer-verification`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        accessToken: token,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
