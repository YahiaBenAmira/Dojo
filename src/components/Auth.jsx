import React, { useState } from "react";
import axios from "axios";

import { io } from "socket.io-client";
import { useAuthContext } from "../contexts/AuthContext";
const Login = () => {
  const { signIn } = useAuthContext();

  const [loginData, setLoginData] = useState({
    userName: "",
    password: "",
  });
  

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    console.log(event.target.value);
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const onSubmit = () => {
    signIn(loginData);
  };

  return (
    <div className="h-screen bg-gradient-to-tr from-blue-200 via-indigo-200 to-pink-200 w-screen py-16 px-4">
      <div className="flex flex-col items-center justify-center">


        <div className="bg-white shadow rounded lg:w-1/3 md:w-1/2 w-full p-10 mt-16">
          <p
            tabIndex="0"
            className="focus:outline-none text-2xl font-extrabold leading-6 text-gray-800 text-center"
          >
           Welcome to Dojo
          </p>
          <p
            tabIndex="0"
            className="focus:outline-none text-sm mt-4 font-medium leading-none text-gray-500"
          >
            

          </p>

          <div className="w-full flex items-center justify-between py-5">
            <hr className="w-full bg-gray-400" />
            <hr className="w-full bg-gray-400" />
          </div>

          <div>
            <label
              htmlFor="username"
              className="text-sm font-medium leading-none text-gray-800"
            >
              Username
            </label>
            <input
              id="username"
              name="userName"
              type="text"
              className="bg-gray-200 border rounded text-xs font-medium leading-none text-gray-800 py-3 w-full pl-3 mt-2"
              value={loginData.userName}
              onChange={handleInputChange}
            />
          </div>

          <div className="mt-6 w-full">
            <label
              htmlFor="pass"
              className="text-sm font-medium leading-none text-gray-800"
            >
              Password
            </label>
            <div className="relative flex items-center justify-center">
              <input
                id="pass"
                name="password"
                type="password"
                className="bg-gray-200 border rounded text-xs font-medium leading-none text-gray-800 py-3 w-full pl-3 mt-2"
                value={loginData.password}
                onChange={handleInputChange}
              />
              <div className="absolute right-0 mt-2 mr-3 cursor-pointer">
                {/* Password visibility toggle icon */}
              </div>
            </div>
          </div>
          <div className="mt-8">
            <button
              type="submit"
              className="focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 text-sm font-semibold leading-none text-white focus:outline-none bg-indigo-700 border rounded hover:bg-indigo-600 py-4 w-full"
              onClick={onSubmit}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
