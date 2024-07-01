import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BsFillPersonFill,
  BsListCheck,
  BsChat,
  BsPerson,
} from "react-icons/bs";
import Navbar from "./Navbar";
import Room from "./Room";
import Profile from "./Profile";
import Announcement from './Announcements'
import { MdAnnouncement } from "react-icons/md";
import Tasks from "./Tasks";

const HomeScreen = () => {
  const [selectedNavItem, setSelectedNavItem] = useState("Tasks"); // State to track selected navigation item

  const handleNavItemClick = (itemName) => {
    setSelectedNavItem(itemName);
  };

  return (
    <div className="flex flex-row h-screen w-auto p-4 space-x-4 bg-gradient-to-tr from-blue-200 via-indigo-200 to-pink-200 justify-center overflow-auto">
      {/* Left side menu */}
      <div className="flex flex-col items-center justify-start bg-slate-900 rounded-lg p-4 w-80">
        {/* User icon */}
        <BsFillPersonFill className="text-gray-200 text-4xl mb-6" />

        {/* Navigation items */}
        <ul className="flex flex-col space-y-4">
          <li
            className={`p-2 rounded-lg cursor-pointer flex items-center text-gray-200 w-60 ${
              selectedNavItem === "Tasks" && "bg-gray-200 text-slate-900"
            }`}
            onClick={() => handleNavItemClick("Tasks")}
          >
            <BsListCheck className="text-gray-600 mr-2" />
            Tasks
          </li>
          <li
            className={`p-2 rounded-lg cursor-pointer flex items-center text-gray-200 w-60 ${
              selectedNavItem === "Chatroom" && "bg-gray-200 text-slate-900"
            }`}
            onClick={() => handleNavItemClick("Chatroom")}
          >
            <BsChat className="text-gray-600 mr-2" />
            Chatroom
          </li>
          <li
            className={`p-2 rounded-lg cursor-pointer flex items-center text-gray-200 w-60 ${
              selectedNavItem === "Profile" && "bg-gray-200 text-slate-900"
            }`}
            onClick={() => handleNavItemClick("Profile")}
          >
            <BsPerson className="text-gray-600 mr-2" />
            Profile
          </li>
          <li
            className={`p-2 rounded-lg cursor-pointer flex items-center text-gray-200 w-60 ${
              selectedNavItem === "Announcement" && "bg-gray-200 text-slate-900"
            }`}
            onClick={() => handleNavItemClick("Announcement")}
          >
            <MdAnnouncement className="text-gray-600 mr-2" />
            Announcement
          </li>
        </ul>
      </div>
      {/* Main content */}
      <div className="flex flex-col flex-grow pl-8 space-y-4">
        <Navbar />

        {/* Announcement section */}
       
        <div className="mt-8">
          {selectedNavItem === 'Chatroom' && <Room />}
        </div>
        <div className="mt-8">
          {selectedNavItem === 'Profile' && <Profile />}
        </div>
        <div className="mt-8">
          {selectedNavItem === 'Announcement' && <Announcement />}
        </div>
        <div className="mt-8">
          {selectedNavItem === 'Tasks' && <Tasks />}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
