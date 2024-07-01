import React, { useContext, useState, createContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
export const AuthContext = createContext({});

export const AuthContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [authenticated, setisAuthenticated] = useState(
    !!localStorage.getItem("userId")
  );
  const [user, setUser] = useState();
  const signIn = async (payload) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/user/login",
        payload
      );
      if (response.status === 200) {
        localStorage.setItem("userId", response.data.data.user.user_id);
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem('companyId',response.data.data.user.company_id)
        setisAuthenticated(true);
        
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getUser = async () => {
    if (!authenticated) {
      return;
    }
    const userId = localStorage.getItem("userId");
    try {
      const response = await axios.get(
        `http://localhost:3000/api/user/${userId}`
      );

      setUser(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);
  return (
    <AuthContext.Provider value={{ signIn, authenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
