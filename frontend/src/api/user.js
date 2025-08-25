// api/user.js
import axios from "axios";

export const getCurrentUser = async () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");
  const API_URL = process.env.REACT_APP_API_URL || "https://localhost:5000";

  export const getCurrentUser = async () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    
  const endpointMap = {
    student: "/api/me",
    instructor: "/api/instructors/me", // placeholder for future
    admin: "/api/admins/me",          // placeholder for future
  };

  if (!role || !endpointMap[role]) {
    throw new Error("Invalid role or role not defined");
  }
    
  const response = await axios.get(endpointMap[role], {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
