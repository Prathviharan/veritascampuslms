import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  useGetAnnouncements,
  useDeleteAnnouncement,
} from "../../Services/announcementService";
import Layout_Announcement from "./Layout_Announcement";

export default function ViewAnnouncements() {
  const { data, error, loading, refetch } = useGetAnnouncements();
  const {
    deleteAnnouncement,
    error: deleteError,
    loading: deleteLoading,
  } = useDeleteAnnouncement();
  const [announcements, setAnnouncement] = useState([]);

  useEffect(() => {
    if (data) {
      setAnnouncement(data.data);
    }
  }, [data]);
  console.log(announcements);

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error loading announcements</p>;

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      await deleteAnnouncement(id);
      setAnnouncement((prev) => prev.filter((a) => a._id !== id));
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-700">Announcements</h1>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="text-xs uppercase bg-green-600 text-white">
            <tr>
              <th scope="col" className="px-6 py-4">Title</th>
              <th scope="col" className="px-6 py-4">Date</th>
              <th scope="col" className="px-6 py-4">Done By</th>
              <th scope="col" className="px-6 py-4">Status</th>
              <th scope="col" className="px-6 py-4">Message</th>
              <th scope="col" className="px-6 py-4">Send To</th>
              <th scope="col" className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {announcements.map((announcement, idx) => (
              <tr
                key={announcement._id}
                className={`${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                } border-b hover:bg-gray-100 transition-colors`}
              >
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {announcement.title}
                </td>
                <td className="px-6 py-4">
                  {announcement.createdAt
                    ? new Date(announcement.createdAt).toLocaleDateString("en-GB")
                    : ""}
                </td>
                <td className="px-6 py-4">{announcement.doneBy}</td>
                <td className="px-6 py-4">{announcement.status}</td>
                <td className="px-6 py-4">{announcement.message}</td>
                <td className="px-6 py-4">{announcement.sendTo}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex gap-3 justify-end">
                    <Link
                      to={`/edit-announcement/${announcement._id}`}
                      className="inline-block px-3 py-1 rounded text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(announcement._id)}
                      className="inline-block px-3 py-1 rounded text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
