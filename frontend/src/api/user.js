// src/api/user.js
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000"; // fallback for local dev

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

  const response = await axios.get(`${API_URL}${endpointMap[role]}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
