import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../css/AddCourse.css';

const AddCourse = () => {
  const navigate = useNavigate();

  const [newCourse, setNewCourse] = useState({
    title: '',
    instructor: [''],
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCourse(prev => ({ ...prev, [name]: value }));
  };

  const handleInstructorChange = (index, value) => {
    const updated = [...newCourse.instructor];
    updated[index] = value;
    setNewCourse(prev => ({ ...prev, instructor: updated }));
  };

  const handleAddInstructor = () => {
    setNewCourse(prev => ({ ...prev, instructor: [...prev.instructor, ''] }));
  };

  const handleRemoveInstructor = (index) => {
    const updated = newCourse.instructor.filter((_, i) => i !== index);
    setNewCourse(prev => ({ ...prev, instructor: updated.length ? updated : [''] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newCourse.title.trim() || !newCourse.description.trim()) {
      alert('Please fill in all fields.');
      return;
    }
    if (newCourse.instructor.some(inst => !inst.trim())) {
      alert('Please fill all instructor fields or remove empty ones.');
      return;
    }

    const sanitized = {
      title: newCourse.title.trim(),
      description: newCourse.description.trim(),
      instructor: newCourse.instructor.map(i => i.trim()),
    };

    try {
      await axios.post('http://localhost:5000/api/adminCourseStats/stats', sanitized);
      alert('Course added successfully!');
      navigate('/admin/courses');
    } catch (error) {
      console.error('Error adding course:', error.response || error.message);
      alert('Failed to add course.');
    }
  };

  const handleCancel = () => navigate('/admin/courses');

  return (
    <div className="add-course-page">
      <h2>Add New Course</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input type="text" name="title" value={newCourse.title} onChange={handleChange} required />
        </label>

        <label>
          Instructors:
          {newCourse.instructor.map((inst, index) => (
            <div key={index} className="instructor-field">
              <input
                type="text"
                value={inst}
                onChange={(e) => handleInstructorChange(index, e.target.value)}
                placeholder={`Instructor ${index + 1}`}
                required
              />
              {newCourse.instructor.length > 1 && (
                <button type="button" onClick={() => handleRemoveInstructor(index)} className="remove-btn">
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={handleAddInstructor} className="btn-save">
            + Add Instructor
          </button>
        </label>

        <label>
          Description:
          <textarea name="description" value={newCourse.description} onChange={handleChange} required />
        </label>

        <div className="form-buttons">
          <button type="submit" className="btn-save">Add Course</button>
          <button type="button" className="btn-cancel" onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AddCourse;
