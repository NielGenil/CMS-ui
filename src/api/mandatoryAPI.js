import { BASE_URL, getAccessToken } from "./api";

// export const mandatoryAPI = async (data) => {
//   const response = await fetch(`${BASE_URL}/api/mandatory/`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json", // ✅ Required for JSON body
//       Authorization: `Bearer ${getAccessToken()}`, // ✅ Fix typo: "Authrization" → "Authorization"
//     },
//     body: JSON.stringify(data), // ✅ Convert object to JSON string
//   });

//   if (!response.ok) {
//   const text = await response.text();
//   let errorData;
//   try {
//     errorData = JSON.parse(text);
//   } catch {
//     errorData = { detail: text };
//   }
//   console.error("Server error:", errorData);
//   throw errorData;
// }

//   return await response.json();
// };

// For GET (retrieving list)
export const getMandatoryAPI = async () => {
  const response = await fetch(`${BASE_URL}/api/mandatory/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });

  if (!response.ok) {
    throw await response.json();
  }

  return await response.json();
};


export const createMandatoryAPI = async (data) => {
  const response = await fetch(`${BASE_URL}/api/mandatory/`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json", 
        Authorization: `Bearer ${getAccessToken()}`
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw await response.json();
  }

  return await response.json();
};

export const updateMandatoryAPI = async ({id, data}) => {
  const response = await fetch(`${BASE_URL}/api/mandatory/${id}/`, {
    method: "PUT",
    headers: {
        "Content-Type": "application/json", 
        Authorization: `Bearer ${getAccessToken()}`
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw await response.json();
  }
  console.log("ID", id)
  console.log("DATA", data)
  return await response.json();
};
