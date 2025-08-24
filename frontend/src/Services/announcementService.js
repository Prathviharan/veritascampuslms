import useApiGet from "../Hooks/useApiGet";
import useApiPost from "../Hooks/useApiPost";
import useApiPut from "../Hooks/useApiPut";
import useApiDelete from "../Hooks/useApiDelete";

export const useGetAnnouncements = () => {
  return useApiGet("/api/announcement/get");
};

export const useGetAnnouncementById = (id) => {
  return useApiGet(id ? `/api/announcement/get/${id}` : null);
};

export const useCreateAnnouncement = () => {
  const { postData, loading, error, response } = useApiPost();
  return {
    createAnnouncement: (announcementData) =>
      postData("/api/announcement/create", announcementData),
    loading,
    error,
    response,
  };
};

export const useUpdateAnnouncement = () => {
  const { putData, loading, error, response } = useApiPut();
  return {
    updateAnnouncement: (id, updateData) =>
      putData(`/api/announcement/update/${id}`, updateData),
    loading,
    error,
    response,
  };
};

export const useDeleteAnnouncement = () => {
  const { deleteData, loading, error, response } = useApiDelete();
  return {
    deleteAnnouncement: (id) => deleteData(`/api/announcement/delete/${id}`),
    loading,
    error,
    response,
  };
};
