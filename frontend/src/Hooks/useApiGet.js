import { useState, useEffect } from "react";
import axiosInstance from "./axiosInstance";

const useApiGet = (url, initialData = null) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!url) return; 
    setLoading(true);
    try {
      const response = await axiosInstance.get(url);
      setData(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
};

export default useApiGet;
