import { useState } from "react";
import axiosInstance from "./axiosInstance";

const useApiPut = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const putData = async (url, updateData) => {
    setLoading(true);
    try {
      const result = await axiosInstance.put(url, updateData);
      setResponse(result.data);
      setError(null);
      return result.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { putData, loading, error, response };
};

export default useApiPut;
