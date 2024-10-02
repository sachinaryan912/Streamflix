import React, { useState } from 'react';
import './Navbar.css'; // Add CSS styles here for responsive design
import { FaSearch } from 'react-icons/fa'; // AI search icon
import { BsThreeDotsVertical } from 'react-icons/bs'; // Dropdown icon

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        {/* Logo: Mobile vs Desktop */}
        <div className="logo">
          <img
            src={window.innerWidth < 768 ? "/path-to-mobile-logo.png" : "/path-to-desktop-logo.png"}
            alt="Logo"
            className="logo-image"
          />
        </div>

        {/* AI-powered search button */}
        <button className="ai-search-btn">
          <FaSearch className="search-icon" />
          <span>AI Powered Search</span>
        </button>

        {/* Square icon with dropdown */}
        <div className="dropdown">
          <button onClick={toggleDropdown} className="dropdown-icon">
            <BsThreeDotsVertical size={24} />
          </button>

          {dropdownOpen && (
            <div className="dropdown-menu">
              <ul>
                <li>Profile</li>
                <li>Settings</li>
                <li>Logout</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
