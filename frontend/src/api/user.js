// src/api/user.js
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"; // fallback for local dev

export const getCurrentUser = async () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");

  const endpointMap = {
    student: "/me",
    instructor: "/instructors/me",
    admin: "/admins/me",
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
