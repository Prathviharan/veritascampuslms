import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import bbImage from '../../assets/bb.png';

const Dashboard = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [event, setEvent] = useState("");

  // Load events from localStorage on initial load
  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem("events"));
    if (storedEvents) {
      setEvents(storedEvents);
    }
  }, []);

  // Save events to localStorage whenever the events list changes
  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem("events", JSON.stringify(events));
    }
  }, [events]);

  const handleDateClick = (value) => {
    setDate(value);
  };

  const handleAddEvent = () => {
    if (event) {
      const newEvent = { date: date.toDateString(), event };
      setEvents((prevEvents) => [...prevEvents, newEvent]);
      setEvent(""); // Reset the event input field
    }
  };

  const handleDeleteEvent = (index) => {
    const updatedEvents = events.filter((_, i) => i !== index); // Filter out the event by index
    setEvents(updatedEvents); // Update state
  };

  return (
    <div className="dashboard">
      {/* Main Content */}
      <div className="main-content">
        <div className="left-content">
          {/* Recently Accessed Courses Section */}
          <div className="rectangle-2142">
            <div className="rectangle-content">
              <h2 className="section-title">Recently accessed courses</h2>
              <p className="module-image">Module Image</p>
              <div className="course-grid">
                <div className="course-card">
                  <h3>Semester 01</h3>
                  <p>Data Base</p>
                </div>
                <div className="course-card">
                  <h3>Semester 01</h3>
                  <p>System Computer</p>
                </div>
                <div className="course-card">
                  <h3>Semester 01</h3>
                  <p>Web Technology</p>
                </div>
              </div>
            </div>
          </div>

          {/* Course Overview Section */}
          <div className="rectangle-2143">
            <div className="rectangle-content">
              <h2 className="section-title">Course Overview</h2>
              <div className="course-grid">
                <div className="course-card">
                  <h3>Semester 01</h3>
                  <p>Principles of Management</p>
                </div>
                <div className="course-card">
                  <h3>Semester 01</h3>
                  <p>System Computer</p>
                </div>
                <div className="course-card">
                  <h3>Semester 01</h3>
                  <p>Web Technology</p>
                </div>
                <div className="course-card">
                  <h3>Semester 02</h3>
                  <p>Data Structure</p>
                </div>
                <div className="course-card">
                  <h3>Semester 02</h3>
                  <p>Machine Learning</p>
                </div>
                <div className="course-card">
                  <h3>Semester 02</h3>
                  <p>Machine Learning</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="sidebar">
          <div className="sidebar-section1">
            <h3>Timeline</h3>
            <div className="sidebar-section bb">
              <img src={bbImage} alt="bb" className="bb-image" />
            </div>
            <p className="no-activities">No upcoming activities due</p>
          </div>

          <div className="sidebar-section2">
            <h3>Private files</h3>
            <ul className="file-list">
              <li>1 (1).c</li>
              <li>1.c</li>
              <li>2.c</li>
            </ul>
          </div>

          {/* Calendar Section */}
          <div className="sidebar-section calendar">
            <h3>Calendar</h3>
            <Calendar
              onChange={handleDateClick}
              value={date}
            />
            <div className="upcoming-events">
              <h3>Upcoming Events</h3>
              <input
                type="text"
                value={event}
                onChange={(e) => setEvent(e.target.value)}
                placeholder="Add event"
              />
              <button onClick={handleAddEvent}>Add Event</button>
              {events.length > 0 && (
                <ul>
                  {events.map((ev, index) => (
                    <li key={index}>
                      {ev.date}: {ev.event}
                      <button onClick={() => handleDeleteEvent(index)}>Delete</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
