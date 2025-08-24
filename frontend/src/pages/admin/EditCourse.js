import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../../css/EditCourse.css'; // Connect CSS

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [editedCourse, setEditedCourse] = useState({
    title: '',
    instructor: [''],
    description: '',
  });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/adminCourseStats/details/${id}`);
        const course = res.data.course;
        setEditedCourse({
          title: course.title || '',
          description: course.description || '',
          instructor: Array.isArray(course.instructor) && course.instructor.length ? course.instructor : [''],
        });
      } catch (error) {
        console.error('Error fetching course:', error);
        alert('Failed to load course data.');
        navigate('/admin/courses');
      }
    };
    fetchCourse();
  }, [id, navigate]);

  const handleChange = e => {
    const { name, value } = e.target;
    setEditedCourse(prev => ({ ...prev, [name]: value }));
  };

  const handleInstructorChange = (index, value) => {
    const updated = [...editedCourse.instructor];
    updated[index] = value;
    setEditedCourse(prev => ({ ...prev, instructor: updated }));
  };

  const handleAddInstructor = () => {
    setEditedCourse(prev => ({ ...prev, instructor: [...prev.instructor, ''] }));
  };

  const handleRemoveInstructor = (index) => {
    const updated = editedCourse.instructor.filter((_, i) => i !== index);
    setEditedCourse(prev => ({ ...prev, instructor: updated.length ? updated : [''] }));
  };

  const handleSave = async () => {
    if (!editedCourse.title.trim() || !editedCourse.description.trim()) {
      alert('Please fill all fields.');
      return;
    }
    if (editedCourse.instructor.some(i => !i.trim())) {
      alert('Please fill all instructor fields or remove empty ones.');
      return;
    }

    const sanitized = {
      title: editedCourse.title.trim(),
      description: editedCourse.description.trim(),
      instructor: editedCourse.instructor.map(i => i.trim()),
    };

    try {
      await axios.put(`http://localhost:5000/api/adminCourseStats/stats/${id}`, sanitized);
      alert('Course updated successfully!');
      navigate('/admin/courses');
    } catch (error) {
      console.error('Error updating course:', error.response || error.message);
      alert('Failed to update course.');
    }
  };

  const handleCancel = () => {
    navigate('/admin/courses');
  };

  return (
    <div className="edit-course-page">
      <h2>Edit Course</h2>
      <form onSubmit={e => e.preventDefault()}>
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={editedCourse.title}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Instructors:
          {editedCourse.instructor.map((inst, index) => (
            <div className="instructor-field" key={index}>
              <input
                type="text"
                value={inst}
                onChange={(e) => handleInstructorChange(index, e.target.value)}
                placeholder={`Instructor ${index + 1}`}
                required
              />
              {editedCourse.instructor.length > 1 && (
                <button type="button" onClick={() => handleRemoveInstructor(index)}>Remove</button>
              )}
            </div>
          ))}
          <button type="button" className="btn-add-instructor" onClick={handleAddInstructor}>+ Add Instructor</button>
        </label>

        <label>
          Description:
          <textarea
            name="description"
            value={editedCourse.description}
            onChange={handleChange}
            required
          />
        </label>

        <div className="form-buttons">
          <button type="button" onClick={handleSave}>Save</button>
          <button type="button" onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditCourse;
