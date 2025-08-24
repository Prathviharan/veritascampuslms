import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Alert, Spinner } from 'react-bootstrap';

const UpdateLectureMaterial = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    date: '',
    visibility: 'Public',
    file: null,
  });
  const [course, setCourse] = useState({ name: '', code: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const errorRef = useRef(null);

  useEffect(() => {
    axios.get(`/api/instructor/lecture-material/${id}`)
      .then(res => {
        setForm({
          ...res.data,
          file: null // don’t preload file object
        });
        return axios.get(`/api/courses/${res.data.courseId}`);
      })
      .then(res => setCourse(res.data))
      .catch(err => console.error('Error fetching data:', err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setForm(prev => ({ ...prev, file: acceptedFiles[0] }));
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': [],
      'application/msword': [],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
      'application/vnd.ms-powerpoint': [],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': []
    },
    multiple: false,
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        data.append(key, value);
      }
    });

    try {
      await axios.put(`/api/instructor/lecture-material/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate(-1); // Go back after success
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {isSubmitting && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center bg-white bg-opacity-75" style={{ zIndex: 1050 }}>
          <Spinner animation="border" variant="primary" role="status" style={{ width: '3rem', height: '3rem' }} />
          <div className="mt-3 text-primary fw-medium">Updating lecture material...</div>
        </div>
      )}

      <div className="container my-5">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
            <li className="breadcrumb-item"><Link to="/programmes">Programmes</Link></li>
            <li className="breadcrumb-item active" aria-current="page">Update</li>
          </ol>
        </nav>

        {/* Form Card */}
        <div className="mx-auto p-4 bg-white rounded shadow" style={{ maxWidth: "900px" }}>
          <h2 style={{ color: '#55B649' }}>
            Update Lecture Material - {course.code} {course.name && `(${course.name})`}
          </h2>

          {error && (
            <Alert ref={errorRef} variant="danger" onClose={() => setError('')} dismissible>
              {error}
            </Alert>
          )}

          <form onSubmit={handleUpdate} encType="multipart/form-data">
            <div className="row">
              <div className="col-md-6 mb-3">
                <div className="form-floating">
                  <input
                    id="title"
                    name="title"
                    type="text"
                    className="form-control"
                    placeholder="Lecture Title"
                    value={form.title || ''}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    required
                  />
                  <label htmlFor="title">Title<span className="text-danger fw-bold">*</span></label>
                </div>
              </div>

              <div className="col-md-6 mb-3">
                <div className="form-floating">
                  <input
                    id="date"
                    name="date"
                    type="date"
                    className="form-control"
                    value={form.date || ''}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  <label htmlFor="date">Date</label>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="form-floating">
                <select
                  id="visibility"
                  name="visibility"
                  className="form-select"
                  value={form.visibility}
                  onChange={handleChange}
                  disabled={isSubmitting}
                >
                  <option value="Public">Public</option>
                  <option value="Private">Private</option>
                </select>
                <label htmlFor="visibility">Visibility</label>
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label">Upload File</label>
              <div
                {...getRootProps()}
                className={`border border-2 rounded p-3 text-center bg-light ${isSubmitting ? 'opacity-50' : 'border-secondary hover:border-primary bg-white'}`}
                style={{ cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
              >
                <input {...getInputProps()} disabled={isSubmitting} />
                {isDragActive ? (
                  <p className="mb-0">Drop the file here...</p>
                ) : form.file ? (
                  <p className="mb-0">{form.file.name}</p>
                ) : (
                  <p className="mb-0">Drag & drop a file here, or click to select</p>
                )}
              </div>
            </div>

            <div className="d-flex justify-content-end mt-4">
              <button
                type="submit"
                className="btn btn-success px-4 py-2 fw-semibold"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Updating...' : 'Update'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdateLectureMaterial;
