import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/veritas.jpg";

const Navbar = () => {
  return (
    <div>
      {/* Top green bar */}
      <div className="h-[30px] bg-[#55B649]"></div>

      <nav className="flex flex-wrap items-center justify-between px-6 py-4 bg-white shadow-md">
        {/* Left: Logo & Brand */}
        <div className="flex items-center space-x-4">
          <img src={logo} alt="Logo" className="w-20 h-auto" />
          <div className="h-10 border-l-2 border-black"></div>
          <span className="text-2xl font-bold">LearnDash</span>
        </div>

        {/* Right: Nav Links */}
        <ul className="list-none flex flex-col md:flex-row md:space-x-6 mt-4 md:mt-0 font-bold text-base">
          <li>
            <Link to="/" className="text-black hover:text-green-600">
              HOME
            </Link>
          </li>
          <li>
            <Link to="/whoweare" className="text-black hover:text-green-600">
              WHO WE ARE
            </Link>
          </li>
          <li>
            <Link to="/programmes" className="text-black hover:text-green-600">
              PROGRAMMES
            </Link>
          </li>
          <li>
            <Link to="/news" className="text-black hover:text-green-600">
              NEWS
            </Link>
          </li>
          <li>
            <Link to="/contactus" className="text-black hover:text-green-600">
              CONTACT US
            </Link>
          </li>
          <li>
            <Link
              to="/signin"
              className="text-black underline hover:text-green-600"
            >
              GET STARTED
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
