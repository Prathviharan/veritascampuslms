import React, { useState } from "react";
import { useCreateAnnouncement } from "../../Services/announcementService";
import AnnouncementForm from "../../components/AnnouncementForm";
import { useNavigate } from "react-router-dom";


export default function CreateAnnouncement() {
  const [formData, setFormData] = useState({
    title: "",
    doneBy: "",
    status: "",
    message: "",
    sendTo: "",
  });

  const navigate = useNavigate();
  const { createAnnouncement, loading, error, response } = useCreateAnnouncement();

  const handleSubmit = async (formData) => {
    try {
      const result = await createAnnouncement(formData);
      if (result) {
        setFormData({
          title: "",
          doneBy: "",
          status: "",
          message: "",
          sendTo: "",
        });
        navigate("/admin/announcements");
      }
      return result;
    } catch (error) {
      console.error("Announcement creation failed:", error);
    }
  };

  return (
    <div>
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 ">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Create Announcement
        </h1>
        <AnnouncementForm
          initialValues={formData}
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
          success={response}
        />
      </div>
      
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
