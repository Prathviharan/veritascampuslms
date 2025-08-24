import React, { useEffect, useState } from "react";
import profileimage from "../../assets/profileimage.png";
import axios from "axios";
import { getCurrentUser } from "../../api/user";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const [studentData, setStudentData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const userData = await getCurrentUser();

        if (!userData) {
          throw new Error("User data is missing");
        }

        const studentRes = await axios.get(
          `http://localhost:5000/api/student/profile/${userData._id}`
        );

        const student = studentRes.data.studentProfile;
        setStudentData(student); // store student data in state

        setPreviewImage(
          student.image ? `http://localhost:5000/${student.image}` : ""
        );
      } catch (error) {
        console.error("Failed to fetch student", error);
      }
    };

    fetchStudent();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      await axios.put(
        `http://localhost:5000/api/editStudent/${studentData._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Profile updated!");
      navigate("/studentProfile");
    } catch (error) {
      console.error("Update failed", error);
      alert("Update failed");
    }
  };

  return (
    <div>
      <div className="container d-flex justify-content-center">
        <h2 className="fw-bold fs-2" style={{ color: "#55B649" }}>
          Edit Profile
        </h2>
      </div>
      <div className="container border border-dark mt-4">
        <div className="d-flex justify-content-center align-items-center position-relative">
          <img
            src={previewImage || profileimage}
            alt="Student"
            style={{
              width: "200px",
              height: "200px",
              objectFit: "cover",
              borderRadius: "50%",
              border: "2px solid #ccc",
            }}
            className="mt-5"
          />
          <label
            htmlFor="photo-upload"
            className="ms-3 position-absolute"
            style={{ bottom: "20px", right: "20px" }}
          >
            <i
              className="bi bi-pencil-square"
              style={{ fontSize: "1.5rem", cursor: "pointer" }}
            ></i>
          </label>
          <input
            type="file"
            id="photo-upload"
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <form className="mt-4" onSubmit={handleSubmit}>
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-success fw-bold mt-4 mb-5"
              type="submit"
              style={{
                width: "150px",
                height: "30px",
                fontSize: "15px",
                fontFamily: "'Poppins', sans-serif",
                backgroundColor: "#95C436",
                color: "white",
                border: "1px solid #3E9355",
                borderRadius: "6px",
              }}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
