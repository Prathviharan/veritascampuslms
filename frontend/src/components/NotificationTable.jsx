import React, { useEffect, useState } from "react";

export default function NotificationTable({
  notifications,
  loading,
  error,
  onDelete,
  deleteLoading,
  deleteError,
}) {
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading notifications</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">All Notifications</h1>

      <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 ">
          <thead class="text-xs text-white uppercase bg-green-500 ">
            <tr>
              <th scope="col" class="px-6 py-3">
                Title
              </th>
              <th scope="col" class="px-6 py-3">
                Date
              </th>
              <th scope="col" class="px-6 py-3">
                Recipiant
              </th>

              <th scope="col" class="px-6 py-3">
                Message
              </th>
              <th scope="col" class="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((noti) => (
              <tr
                key={noti._id}
                class="bg-white border-b  border-gray-200 hover:bg-gray-50"
              >
                <th
                  scope="row"
                  class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                >
                  {noti.title || 'N/A'}
                </th>
                <td className="px-6 py-4">
                  {noti.createdAt
                    ? new Date(noti.createdAt).toLocaleDateString("en-GB") // DD/MM/YYYY
                    : ""}
                </td>
                <td class="px-6 py-4">{noti.recipient}</td>
                <td class="px-6 py-4">{noti.message}</td>
                <td class="px-6 py-4 text-right">
                  <div className="flex gap-4">
                    <a
                      href={`/edit-notification/${noti._id}`}
                      class="font-medium text-blue-600  hover:underline"
                    >
                      Edit
                    </a>
                    <a
                      onClick={() => onDelete(noti._id)}
                      href="#"
                      class="font-medium text-red-600  hover:underline"
                    >
                      {deleteLoading ? "Deleting..." : "Delete"}
                    </a>
                  </div>
                </td>
                {deleteError && (
                  <div className="text-red-500">
                    {deleteError.message || "Delete error"}
                  </div>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
