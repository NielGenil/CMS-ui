import { BASE_URL, getAccessToken } from "./api";

export const LoginAPI = async (formData) => {
  const credentials = Object.fromEntries(formData.entries());
  const response = await fetch(`${BASE_URL}/api/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }
  console.log(response);
  return response.json();
};

export const RegisterUserAPI = async (data) => {

  const response = await fetch(`${BASE_URL}/api/register/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
    body: data,
  });
  if (!response.ok) {
    const errorData = await response.json();
    console.log(errorData);
    throw errorData;
  }

  console.log(response);
  return await response.json();
};

export const getCurrentUserAPI = async () => {
 
  const response = await fetch(`${BASE_URL}/api/current-user/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch gender data");
  }

  return await response.json();
};

export const UserListAPI = async () => {
 
  const response = await fetch(`${BASE_URL}/api/user/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch gender data");
  }

  return await response.json();
};

export const UserListIdAPI = async (id) => {

  const response = await fetch(`${BASE_URL}/api/user/${id}/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }

  return await response.json();
};

export const updateUserAPI = async (id, formData) => {

  const response = await fetch(`${BASE_URL}/api/user/${id}/`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
    body: formData, // No need to set headers for FormData
  });

  if (!response.ok) {
    const errorData = await response.json(); // get detailed errors
    console.error("API Error:", errorData); // log to console
    throw errorData; // you can throw this if you want to catch in React
  }
  console.log("response", response);
  return await response.json();
};

export const deleteUserAPI = async (id) => {

  const response = await fetch(`${BASE_URL}/api/user/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to delete user");
  }

  return true;
};

// Example usage
export const getGenderAPI = async () => {

  const response = await fetch(`${BASE_URL}/api/gender/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch gender data");
  }

  return await response.json();
};
