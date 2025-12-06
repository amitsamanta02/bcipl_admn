import React, { useState, useEffect, useRef } from 'react';
import { Menu, User, LogOut } from 'lucide-react';
import useStore from '../../store/useStore';

import { useDispatch } from "react-redux";
import { clearUser } from "../../redux/reducers/authSlice";

const Header = () => {
  const dispatch = useDispatch();

  const { sidebarOpen, toggleSidebar } = useStore();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const handleLogout = () => {
    // clear token in Redux
    dispatch(
      clearUser()
    );
  }


  return (
    <header
      className={`fixed top-0 right-0 z-50 transition-all duration-300 
        ${sidebarOpen ? 'left-64' : 'left-16'}
        bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700
        px-4 py-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-0`}
    >
      {/* Left Side */}
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
        >
          <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* Right Side */}
      <div className="flex items-center space-x-3 relative" ref={userMenuRef}>

        {/* User Avatar */}
        <div
          className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center cursor-pointer"
          onClick={() => setShowUserMenu((prev) => !prev)}
        >
          <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </div>

        {/* Dropdown Menu */}
        {showUserMenu && (
          <div className="absolute top-10 right-0 bg-white dark:bg-dark-700 shadow-lg rounded-md py-2 w-40 border border-gray-200 dark:border-dark-600">
            <button
              onClick={handleLogout}
              className="w-full flex text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-600"
            >
              <LogOut className="w-5 h-5 text-gray-600 dark:text-gray-300 me-2" />
              Logout
            </button>
          </div>
        )}

      </div>
    </header>
  );
};

export default Header;