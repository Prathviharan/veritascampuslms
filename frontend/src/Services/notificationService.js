import useApiGet from "../Hooks/useApiGet";
import useApiPost from "../Hooks/useApiPost";
import useApiPut from "../Hooks/useApiPut";
import useApiDelete from "../Hooks/useApiDelete";

export const useGetNotifications = () => {
  return useApiGet(`/api/notification/get`);
};

export const useGetNotificationById = (id) => {
  return useApiGet(id ? `/api/notification/get/${id}` : null);
};

export const useCreateNotification = () => {
  const { postData, loading, error, response } = useApiPost();
  return {
    createNotification: (notificationData) =>
      postData("/api/notification/create", notificationData),
    loading,
    error,
    response,
  };
};

export const useUpdateNotification = () => {
  const { putData, loading, error, response } = useApiPut();
  return {
    updateNotification: (id, updateData) =>
      putData(`/api/notification/update/${id}`, updateData),
    loading,
    error,
    response,
  };
};

export const useDeleteNotification = () => {
  const { deleteData, loading, error, response } = useApiDelete();
  return {
    deleteNotification: (id) => deleteData(`/api/notification/delete/${id}`),
    loading,
    error,
    response,
  };
};
