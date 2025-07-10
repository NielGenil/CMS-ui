export const BASE_URL = "http://127.0.0.1:8000";

export function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

export const getAccessToken = () => getCookie("access");

// api.js or api/auth.js
export const verifyTokenAPI = async (token) => {
  const response = await fetch(`${BASE_URL}/api/token/verify/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }), // properly formatted
  });

  return await response.json();
};

