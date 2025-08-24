import React from "react";

export default function AnnouncementForm({
  initialValues,
  onSubmit,
  loading,
  error,
  success,
}) {
  const [formData, setFormData] = React.useState(initialValues);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 mx-auto  ">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="md:col-span-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={handleChange}
              className="bg-gray-50 w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Done By */}
          <div>
            <label htmlFor="doneBy" className="block text-sm font-medium text-gray-700 mb-1">
              Done By
            </label>
            <input
              type="text"
              id="doneBy"
              value={formData.doneBy}
              onChange={handleChange}
              className="bg-gray-50 w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <input
              type="text"
              id="status"
              value={formData.status}
              onChange={handleChange}
              className="bg-gray-50 w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Message */}
          <div className="md:col-span-2">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              id="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              className="bg-gray-50 w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Send To */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Send to
            </label>
            <div className="flex flex-wrap gap-8">
              <div className="flex items-center">
                <input
                  id="sendTo"
                  type="radio"
                  value="student"
                  checked={formData.sendTo === "student"}
                  onChange={handleChange}
                  name="sendTo"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="sendTo" className="ml-2 text-sm text-gray-700">
                  Student
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="sendTo"
                  type="radio"
                  value="instructor"
                  checked={formData.sendTo === "instructor"}
                  onChange={handleChange}
                  name="sendTo"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="sendTo" className="ml-2 text-sm text-gray-700">
                  Instructor
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mt-8">
          {/* <button
            type="button"
            className="px-5 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Attachments
          </button> */}
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
          >
            {loading ? "Posting..." : "Post Announcement"}
          </button>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mt-4 text-red-500">{error.message || "Error occurred"}</div>
        )}
        {success && (
          <div className="mt-4 text-green-600 font-medium text-center">
            Posted successfully!
          </div>
        )}
      </form>

      
      
    </div>
  );
}
