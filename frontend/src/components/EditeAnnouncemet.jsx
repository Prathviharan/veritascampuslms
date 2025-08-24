// EditAnnouncement.jsx

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetAnnouncementById,
  useUpdateAnnouncement,
} from "../Services/announcementService";

export default function EditAnnouncement() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    doneBy: "",
    status: "",
    message: "",
    sendTo: "",
  });

  const {
    data: announcementData,
    loading: fetchLoading,
    error: fetchError,
  } = useGetAnnouncementById(id);

  const {
    updateAnnouncement,
    loading: updateLoading,
    error: updateError,
    response: updateResponse,
  } = useUpdateAnnouncement();

  useEffect(() => {
    if (announcementData?.data) {
      setFormData({
        title: announcementData.data.title || "",
        doneBy: announcementData.data.doneBy || "",
        status: announcementData.data.status || "",
        message: announcementData.data.message || "",
        sendTo: announcementData.data.sendTo || "",
      });
    }
  }, [announcementData]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateAnnouncement(id, formData);
    navigate("/admin/announcements");
  };

  if (fetchLoading) return <div className="text-center p-8">Loading announcement...</div>;
  if (fetchError)
    return <div className="text-red-500 text-center p-8">Error: {fetchError}</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Edit Announcement
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="doneBy"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Done By
              </label>
              <input
                type="text"
                id="doneBy"
                value={formData.doneBy}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="status"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Status
              </label>
              <input
                type="text"
                id="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Message
              </label>
              <textarea
                id="message"
                rows="4"
                value={formData.message}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Send To
              </label>
              <div className="flex items-center gap-8">
                <label className="flex items-center">
                  <input
                    id="sendTo"
                    type="radio"
                    value="student"
                    checked={formData.sendTo === "student"}
                    onChange={handleInputChange}
                    name="sendTo"
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Student</span>
                </label>
                <label className="flex items-center">
                  <input
                    id="sendTo"
                    type="radio"
                    value="instructor"
                    checked={formData.sendTo === "instructor"}
                    onChange={handleInputChange}
                    name="sendTo"
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Instructor</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={updateLoading}
                className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 disabled:opacity-50"
              >
                {updateLoading ? "Updating..." : "Update"}
              </button>
            </div>

            {updateError && (
              <div className="text-red-500 mt-2">
                {updateError.message || "Error updating announcement"}
              </div>
            )}
            {updateResponse && (
              <div className="text-green-600 mt-2 font-medium">
                Updated successfully!
              </div>
            )}
          </div>
        </form>
      </div>
      <div className="w-full md:w-1/2 hidden md:block">
  {/* Replace first two images with a blank block */}
  <div className="w-full h-full bg-black flex items-center justify-center">
    {/* Optional: add text or icon inside if you want */}
    <span className="text-white"></span>
  </div>
</div>

{/* Keep this last image outside if it’s meant to be separate */}
<img
  src="https://www.cae.net/wp-content/uploads/2015/10/shutterstock_760431790-scaled.jpg"
  alt="Announcement Visual"
  className="object-cover w-full h-full"
/>

        
        
          
        
    </div>
    
  );
}
