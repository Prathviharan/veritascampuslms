import { useState } from "react";
import axiosInstance from "./axiosInstance";

const useApiDelete = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const deleteData = async (url) => {
    setLoading(true);
    try {
      const result = await axiosInstance.delete(url);
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

  return { deleteData, loading, error, response };
};

export default useApiDelete;
