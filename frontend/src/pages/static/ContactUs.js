import React from "react";
import { Link } from "react-router-dom";

const ContactUs = () => {
  return (
    <div className="container my-5">

      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Contact Us
          </li>
        </ol>
      </nav>

      {/* Page Heading */}
      <div className="mb-5">
        <h2 className="fw-bold" style={{ fontFamily: 'Poppins, sans-serif', color: '#0D3E53' }}>
          Contact Us
        </h2>
        <p style={{ color: '#6c757d' }}>
        Have any questions? We'd love to hear from you
        </p>
      </div>

      {/* Main Grid */}
      <div className="row">
        {/* Contact Info LEFT */}
        <div className="col-md-5 mb-4">
          <div className="d-flex flex-column gap-3">

            <div className="d-flex align-items-start">
              <i className="bi bi-telephone-fill me-3 fs-5 text-primary"></i>
              <p className="mb-0">(+94) 77 479 5371</p>
            </div>

            <div className="d-flex align-items-start">
              <i className="bi bi-envelope-fill me-3 fs-5 text-primary"></i>
              <p className="mb-0">info.veritascampus@gmail.com</p>
            </div>

            <div className="d-flex align-items-start">
              <i className="bi bi-geo-alt-fill me-3 fs-5 text-primary"></i>
              <p className="mb-0">676/1 Colombo - Galle Main Rd,<br />Panadura</p>
            </div>

          </div>
        </div>

        {/* Contact Form RIGHT */}
        <div className="col-md-7">
          <div className="p-4 border rounded" style={{ borderColor: "#FFFBFB", boxShadow: "0px 2px 8px rgba(5, 5, 5, 0.05)" }}>
            <form>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Full Name</label>
                <input type="text" className="form-control" id="name" placeholder="Your name" />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input type="email" className="form-control" id="email" placeholder="you@example.com" />
              </div>
              <div className="mb-3">
                <label htmlFor="contactnumber" className="form-label">Contact Number</label>
                <input type="number" className="form-control" id="contactnumber" placeholder="077 479 5371" />
              </div>
              <div className="mb-3">
                <label htmlFor="subject" className="form-label">Subject</label>
                <input type="text" className="form-control" id="subject" placeholder="Type here" />
              </div>
              <div className="mb-4">
                <label htmlFor="message" className="form-label">Message</label>
                <textarea className="form-control" id="message" rows="5" placeholder="Your message..." />
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="btn btn-success fw-bold"
                  style={{
                    backgroundColor: "#95C436",
                    color: "#fff",
                    padding: "10px 25px",
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "15px",
                    fontWeight: "500",
                    borderRadius: "6px",
                    border: "1px solid #3E9355",
                    width: "250px"
                  }}
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>


      </div>

    </div>
  );
};

export default ContactUs;
