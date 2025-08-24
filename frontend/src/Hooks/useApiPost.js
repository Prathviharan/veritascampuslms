import { useState } from "react";
import axiosInstance from "./axiosInstance";

const useApiPost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const postData = async (url, postData) => {
    setLoading(true);
    try {
      const result = await axiosInstance.post(url, postData);
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

  return { postData, loading, error, response };
};

export default useApiPost;
