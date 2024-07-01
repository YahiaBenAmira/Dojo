// SocketContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("token");

    const newSocket = io("http://localhost:3000", {
      auth: {
        token: `${token}`,
      },
    });

    // Listen for the "connect" event
    newSocket.on("connect", () => {
      console.log("Connected to socket:", newSocket.id);
      // Now the socket is connected, you can set it in state or perform other actions
      setSocket(newSocket);
      localStorage.setItem("socketId", newSocket.id);
    });

    // Clean up function
    return () => {
      newSocket.disconnect();
      console.log("Disconnected from socket");
    };
  }, []);



  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
