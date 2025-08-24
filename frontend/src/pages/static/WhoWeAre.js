import React from 'react';
import '../../css/WhoWeAre.css';
import { FaGraduationCap, FaUsers, FaUserGraduate, FaMapMarkerAlt, FaMapMarkedAlt, FaChartLine } from 'react-icons/fa';
import vision from '../../assets/vision1.png'
import mission from '../../assets/mission1.png'

function VeritasWebsite() {
  return (
    <div className="website-container">
      <section className="hero-section" id="who-we-are">
        <div className="hero-content">
           
          <h2>Who We Are</h2>
          <p>Get to know the heart of Veritas International Campus</p>
        </div>
      </section>

      <section class="mission-vision-section">
        <h2 class="section-title">Our Mission & Vision</h2>
        <div class="mission-vision-container">
            <div class="mission-box">
                <div class="icon-container">
                    <img src={mission} alt="Target icon"></img>
                </div>
                <div class="content">
                    <p>To provide a transformative educational experience that empowers students to realize their full potential, prepares them for professional success, and instills values of integrity, responsibility, and compassion</p>
                </div>
            </div>
            
            <div class="vision-box">
                <div class="icon-container">
                    <img src={vision} alt="Eye icon"></img>
                </div>
                <div class="content">
                    <p>To become a global center of academic excellence, cultivating innovative minds that drive change and contribute meaningfully to society.</p>
                </div>
            </div>
        </div>
    </section>

      <section className="history-section">
        <h2 className="section-title">Company History</h2>
        <div className="history-container">
          <div className="history-box">
            <div className="history-icon-container">
              <FaMapMarkerAlt className="history-icon" />
            </div>
            <h3>FOUNDED</h3>
            <p>Veritas International was founded in 2024</p>
          </div>
          <div className="history-box">
            <div className="history-icon-container">
              <FaGraduationCap className="history-icon" />
            </div>
            <h3>FOCUS</h3>
            <p>Empower Learning, Inspire Growth</p>
          </div>
          <div className="history-box">
            <div className="history-icon-container">
              <FaMapMarkedAlt className="history-icon" />
            </div>
            <h3>HEADQUARTES</h3>
            <p>Located in Panadura</p>
          </div>
        </div>
      </section>

      <section className="leaders-section">
        <h2 className="section-title">Key Messages From Our Leaders</h2>
        <div className="leaders-container">
          <div className="leader-message">
            <div className="message-content">
              <p>"At Veritas International Campus, our mission is to create a space where education is more than just learning; it's about molding the leaders of tomorrow who are ready to make a global impact. Our journey started in 2024, with a commitment to providing holistic education that empowers individuals not only academically but personally as well. We focus on building character, fostering creativity, and encouraging innovation in every student that walks through our doors."</p>
              <div className="leader-info">
                <p className="leader-name">Mr. Harshana Gamage</p>
                <p className="leader-title">Chairman & Managing Director</p>
                <p className="leader-email">harshanamallika2232@gmail.com</p>
                <p className="leader-company">Veritas International Pvt Ltd</p>
              </div>
            </div>
          </div>
          <div className="leader-message">
            <div className="message-content">
              <p>"Our vision is grounded in creating an institution where students don't just prepare for jobs but for life. At Veritas, we focus on nurturing well-rounded individuals who are equipped with the knowledge, skills, and mindset necessary to succeed in an ever-changing world. We offer programs that challenge students to think critically, communicate effectively, and develop leadership skills that will serve them throughout their careers."</p>
              <div className="leader-info">
                <p className="leader-name">Mrs. Jayani Bandara</p>
                <p className="leader-title">Chief Executive Officer</p>
                <p className="leader-email">jayani.bandara@icloud.com</p>
                <p className="leader-company">Veritas International Pvt Ltd</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="why-choose-section">
        <h2 className="section-title">Why Choose Veritas International Campus?</h2>
        <div className="benefits-container">
          <div className="benefit-item">
            <FaGraduationCap className="benefit-icon" />
            <p>Accredited Programs with global recognition</p>
          </div>
          <div className="benefit-item">
            <FaUserGraduate className="benefit-icon" />
            <p>Experienced Faculty who bring expertise and real world insights</p>
          </div>
          <div className="benefit-item">
            <FaUsers className="benefit-icon" />
            <p>Holistic Development focusing on academic, professional, and personal growth</p>
          </div>
          <div className="benefit-item">
            <FaMapMarkedAlt className="benefit-icon" />
            <p>A vibrant campus in Panadura, close to various cultural and professional hubs</p>
          </div>
          <div className="benefit-item">
            <FaChartLine className="benefit-icon" />
            <p>A commitment to staying ahead of the curve in an ever evolving educational landscape</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default VeritasWebsite;