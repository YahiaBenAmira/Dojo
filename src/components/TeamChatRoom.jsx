import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useSocket } from "../contexts/SocketContext.jsx";
import ChatBox from "./ChatBox.jsx";
import ChatRoom from "./ChatRoom.jsx";

const TeamChatRoom = () => {
  const location = useLocation();
  const [chatMessages, setChatMessages] = useState([]);
  const [audioBlob, setAudioBlob] = useState(null);
  const { socket } = useSocket();
  const { roomInfo } = location.state || {};
  const chatroom_id = location.pathname.includes("/chatroom");

  const sendChatroomMessage = async (message) => {
    try {
      const formData = new FormData();
      const messageType = "global";
      const selectedChatroom = localStorage.getItem("chatroomId");
      const roomName = localStorage.getItem("roomName");
      const userId = localStorage.getItem("userId");
      formData.append("chatroomId", selectedChatroom);
      formData.append("userId", userId);
      formData.append("message", message);
      formData.append("type", messageType);
      if (audioBlob) {
        formData.append("audio", audioBlob);
        setAudioBlob(null);
      }

      const response = await axios.post(
        "http://localhost:3000/api/chat/send-message",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 201) {
        const chatroomId = response.data.data.chatroomId;
        const message = response.data.data.message;

        socket.emit("chatroomMessage", {
          chatroom_id: chatroomId,
          message,
          roomName,
          userId,
        });

        console.log("emitted successfully!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRecordingComplete = (blob) => {
    const url = URL.createObjectURL(blob);
    setAudioBlob(blob);
  };

  useEffect(() => {
    console.log("Component mounted. Proceeding...");

    const handleChatroomMessage = (data) => {
      console.log("Received chatroom message:", data);
      setChatMessages((prevMessages) => [
        ...prevMessages,
        {
          userId: data.userId,
          messageData: data.message,
          chatroomId: data.chatroomId,
        },
      ]);
    };

    socket.on("chatroomMessage", handleChatroomMessage);

    return () => {
      console.log("Component unmounted. Cleaning up...");
      socket.off("chatroomMessage", handleChatroomMessage);
    };
  }, [socket]);

  return (
    <div>
      <ChatRoom messages={chatMessages} sendMessage={sendChatroomMessage}/>
    </div>
  );
};

export default TeamChatRoom;
