import React, { useEffect, useState } from "react";
import axios from "axios";
import { AudioRecorder } from "react-audio-voice-recorder";
import ReactDOM from "react-dom/client";
import OnlineMenu from "./Onlinemenu";
import { Outlet, useLocation, useParams } from "react-router-dom";
import { useSocket } from "../contexts/SocketContext.jsx";
import ChatBox from "./ChatBox.jsx";
import ChatRoom from "./ChatRoom.jsx";

const PrivateChatroom = () => {
  const [privateMessages, setPrivateMessages] = useState([]);
  const { socket } = useSocket();
  const currentUserId = localStorage.getItem("userId");
  const user_id = location.pathname.includes("/user");
  const sendPrivateMessage = async () => {
    try {
      const formData = new FormData();
      const messageType = "private";
      const userId = localStorage.getItem("userId");
      const socketId = localStorage.getItem("socketId");
      const recipientId = user_id; // The ID of the recipient user
      formData.append("userId", userId);
      formData.append("message", message);
      formData.append("senderSocketId", socketId);
      formData.append("type", messageType);
      formData.append("recipientId", recipientId);
      if (audioBlob) {
        formData.append("audio", audioBlob);
        setAudioBlob(null);
      }

      const response = await axios.post(
        "http://localhost:3000/api/chat/private-message",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        const { message, senderSocketId } = response.data.data;
        const recipientId = localStorage.getItem("selectedUserId");
        socket.emit("privateMessage", { message, recipientId, senderSocketId });

        setPrivateMessages((prevMessages) => [
          ...prevMessages,
          {
            messageData: message,
            userId: senderSocketId,
            recipientId,
            type: "private",
          },
        ]);

        console.log("emitted successfully!");
      }
      setMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleRecordingComplete = (blob) => {
    const url = URL.createObjectURL(blob);
    setAudioBlob(blob);
    setAudioUrl(url);
  };

  const handleNotAllowedOrFound = (error) => {
    console.error("getUserMedia error:", error);
  };

  useEffect(() => {
    const handlePrivateMessage = (data) => {
      console.log("Received private message:", data);
      setPrivateMessages((prevMessages) => [
        ...prevMessages,
        {
          messageData: data.messageData,
          userId: data.userId,
          recipientId: data.recipientId,
          type: "private",
        },
      ]);
    };

    socket.on("privateMessage", handlePrivateMessage);

    return () => {
      socket.off("privateMessage", handlePrivateMessage);
    };
  }, [socket]);

  return (
    <div>
      
      <ChatRoom messages={privateMessages} sendPrivateMessage={sendPrivateMessage} isPrivate={true}/>
    </div>
  );
};
// import chatbox ui and pass functions directly , since component is being loaded when routed , functions will be passed as props .
export default PrivateChatroom;
