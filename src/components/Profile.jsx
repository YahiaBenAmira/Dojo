import React, { useEffect, useState } from "react";
import axios from "axios"; // Make sure you have axios installed

const Profile = () => {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem("userId");
      const response = await axios.get(
        `http://localhost:3000/api/user/${userId}`
      );
      console.log(response.data);
    
        setUserData(response.data);
      
    };
    fetchData();
  }, []);
  const renderPassword = (password) => {
    return "*".repeat(Math.min(password.length, 8));
  };
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center rounded-lg">
      <div className="bg-white shadow-lg rounded-lg p-6 md:p-12 max-w-md w-full">
        <div className="flex justify-center">
          <img
            src={userData.profilePicture}
            alt="Profile"
            className="w-24 h-24 rounded-full shadow-md"
          />
        </div>
        <div className="text-center mt-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            {userData.firstName} {userData.lastName}
          </h1>
          <p className="text-gray-600 mt-2">{userData.bio}</p>
        </div>
        <div className="mt-4">
          <div className="flex justify-between items-center mt-4">
            <span className="text-gray-600">Email:</span>
            <span className="text-gray-800">{userData.email}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-600">Phone:</span>
            <span className="text-gray-800">{userData.phone}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-600">Location:</span>
            <span className="text-gray-800">{userData.location}</span>
          </div>
          <div className="flex  gap-1 items-center mt-2">
            <span className="text-gray-600">Password:</span>
            <span className="text-gray-800 ">
              {userData.password ? renderPassword(userData.password) : ""}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
