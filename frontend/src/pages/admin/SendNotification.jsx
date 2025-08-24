import React, { useEffect, useState } from "react";
import {
  useGetNotifications,
  useCreateNotification,
  useDeleteNotification,
} from "../../Services/notificationService";
import NotificationForm from "../../components/NotificationForm";
import NotificationTable from "../../components/NotificationTable";

export default function SendNotification() {
  const [notifications, setNotifications] = useState([]);
  const { data, loading, error, refetch } = useGetNotifications();

  // Create notification hook
  const {
    createNotification,
    loading: createLoading,
    error: createError,
    response: createResponse,
  } = useCreateNotification();

  // Delete notification hook
  const {
    deleteNotification,
    loading: deleteLoading,
    error: deleteError,
  } = useDeleteNotification();

  // Initialize notifications
  useEffect(() => {
    if (data) setNotifications(data.data || []);
  }, [data]);

  // Handle creation
  const handleAddNotification = async (formData) => {
    const newNotification = await createNotification(formData);
    if (newNotification) {
      // Optimistic update
      setNotifications((prev) => [newNotification, ...prev]);
      // Optional: Refetch to ensure sync with server
      refetch();
    }
  };

  // Handle deletion
  const handleDeleteNotification = async (id) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    }
  };

  return (
    <>
      <NotificationForm
        onSubmit={handleAddNotification}
        loading={createLoading}
        error={createError}
      />
      <NotificationTable
        notifications={notifications}
        onDelete={handleDeleteNotification}
        deleteLoading={deleteLoading}
        deleteError={deleteError}
      />
    </>
  );
}
