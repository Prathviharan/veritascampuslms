import React, { useState } from 'react';
import '../../css/AddAssignment.css';
import axios from 'axios';
import Button from '../../components/Button';
import SuccessModal from '../../components/SuccessModal';
import { useNavigate } from 'react-router-dom';

const AddAssignment = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file: null,
    visibility: 'Public',
    deadline: '',
  });

  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, file: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.file) {
      alert("Please select a file.");
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('file', formData.file);
    data.append('visibility', formData.visibility);

    try {
      const localDate = new Date(formData.deadline);
      if (isNaN(localDate.getTime())) throw new Error('Invalid date');

      const utcDate = new Date(Date.UTC(
        localDate.getFullYear(),
        localDate.getMonth(),
        localDate.getDate(),
        localDate.getHours(),
        localDate.getMinutes()
      ));

      data.append('deadline', utcDate.toISOString());

      await axios.post('http://localhost:5000/api/instructor/assignments', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setShowModal(true);
    } catch (error) {
      console.error("Assignment upload failed:", error);
      alert('Upload failed: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleViewAll = () => {
    setShowModal(false);
    navigate('/instructor/added-assignment');
  };

  return (
    <div className="add-assignment">
      <h2>Add New Assignments</h2>
      <form onSubmit={handleSubmit} className="assignment-form" encType="multipart/form-data">
        <input type="text" name="title" placeholder="Title" onChange={handleChange} required />
        <textarea name="description" placeholder="Description" onChange={handleChange} required />
        <input type="file" name="file" onChange={handleChange} required />
        
        <div className="visibility">
          <label>
            <input
              type="radio"
              name="visibility"
              value="Public"
              checked={formData.visibility === 'Public'}
              onChange={handleChange}
            /> Public
          </label>
          <label>
            <input
              type="radio"
              name="visibility"
              value="Private"
              checked={formData.visibility === 'Private'}
              onChange={handleChange}
            /> Private
          </label>
        </div>

        <input
          type="datetime-local"
          name="deadline"
          onChange={handleChange}
          min={new Date().toISOString().slice(0, 16)}
          required
        />

        {/* Remove onClick to avoid double submit */}
        <Button text="Save & Publish" />
      </form>

      {showModal && (
        <SuccessModal
          message="Assignment uploaded successfully!"
          onClose={() => setShowModal(false)}
          onViewAll={handleViewAll}
        />
      )}
    </div>
  );
};

export default AddAssignment;