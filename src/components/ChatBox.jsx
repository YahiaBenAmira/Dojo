import React, { useEffect, useState } from "react";
import axios from "axios";
import { AudioRecorder } from "react-audio-voice-recorder";
import toast, { Toaster } from "react-hot-toast";

import ReactDOM from "react-dom/client";
import OnlineMenu from "./Onlinemenu";
import { Outlet, useLocation, useParams } from "react-router-dom";
import { useSocket } from "../contexts/SocketContext.jsx";
const ChatBox = ({}) => {
  const location = useLocation();
  const [message, setMessage] = useState("");
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [senderSocketId, setSenderSocketId] = useState(null);
  const [privateMessages, setPrivateMessages] = useState([]);
  const [privateAudioMessages, setPrivateAudioMessages] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [audioMessages, setAudioMessages] = useState([]);
  const currentUserId = localStorage.getItem("userId");
  const { socket } = useSocket();

  const { roomInfo } = location.state || {};
  const user_id = location.pathname.includes("/user");
  const chatroom_id = location.pathname.includes("/chatroom");

  const sendPrivateMessage = async () => {
    try {
      const formData = new FormData();

      const userId = localStorage.getItem("userId");

      const recipientId = localStorage.getItem("selectedUserId");
      formData.append("senderId", userId);
      formData.append("message", message);

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
        const senderId = userId;
        console.log(message);
        console.log(recipientId);
        socket.emit("privateMessage", {
          message,
          recipientId,
          senderId,
        });
        console.log("emitted succesfully!");
      }
      console.log(response);
      setMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  const sendChatroomMessage = async () => {
    try {
      const formData = new FormData();

      const selectedChatroom = localStorage.getItem("chatroomId");
      const roomName = localStorage.getItem("roomName");
      console.log("This is roomName in chatBox", roomName);
      const userId = localStorage.getItem("userId");
      formData.append("chatroomId", selectedChatroom);
      formData.append("userId", userId);
      formData.append("message", message);

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
      if (response.status == 201) {
        const chatroomId = response.data.data.chatroomId;
        const senderId = localStorage.getItem("userId");
        const message = response.data.data.message;

        socket.emit("chatroomMessage", {
          chatroomId,
          message,
          senderId,
          roomName,
        });

        console.log("emitted succesfully! ");
      }
      console.log(response);
      setMessage("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendMessage = async () => {
    switch (true) {
      case user_id:
        await sendPrivateMessage();
        break;
      case chatroom_id:
        await sendChatroomMessage();
        break;
      default:
        break;
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
    const handleReceiveMessage = ({ senderId, message, recipientId }) => {
      console.log(`Message from ${senderId}: ${message} to ${recipientId}`);
      setPrivateMessages((prevMessages) => [
        ...prevMessages,
        { senderId, message, recipientId },
      ]);
      const reciever = localStorage.getItem("selectedUserId");
      if (recipientId != reciever) {
        toast.success(`New message from ${senderId}: ${message}`, {
          icon: "📩",
          duration: 5000, // Duration of the toast notification in milliseconds
          position: "top-right", // Position of the toast notification on the screen
          style: {
            background: "#333", // Background color of the toast notification
            color: "#fff", // Text color of the toast notification
          },
        });
      }
    };

    const handleChatroomMessage = ({ senderId, message }) => {
      console.log("Received chatroom message:", message, senderId);
      setChatMessages((prevMessages) => [
        ...prevMessages,
        {
          senderId,
          message,
        },
      ]);
    };

    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("receiveChatroomMessage", handleChatroomMessage);

    // Cleanup function to remove the listeners when the component unmounts
    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("receiveChatroomMessage", handleChatroomMessage);
    };
  }, [socket]);
  const notify = () => toast("Here is your toast.");

  // useEffect(() => {
  //   socket.on("receiveMessage", ({ senderId, message }) => {
  //     console.log(`Message from ${senderId}: ${message}`);
  //     // Update state to display the message
  //     setPrivateMessages((prevMessages) => [
  //       ...prevMessages,
  //       { senderId, message },
  //     ]);
  //   });

  //   // Handle incoming audio messages
  //   // socket.on("audioMessage", (data) => {
  //   //   const blob = new Blob([data.audioData], {
  //   //     type: data.audioFile.mimetype,
  //   //   });
  //   //   const audioMessageWithBlob = { ...data, audioBlob: blob };
  //   //   if (data.recipientId) {
  //   //     setPrivateAudioMessages((prevAudioMessages) => [
  //   //       ...prevAudioMessages,
  //   //       { ...audioMessageWithBlob, type: "private" },
  //   //     ]);
  //   //   } else {
  //   //     setAudioMessages((prevAudioMessages) => [
  //   //       ...prevAudioMessages,
  //   //       { ...audioMessageWithBlob, type: "global" },
  //   //     ]);
  //   //   }
  //   // });
  //   const handleChatroomMessage = (data) => {
  //     console.log("Received chatroom message:", data);
  //     setChatMessages((prevMessages) => [
  //       ...prevMessages,
  //       {
  //         userId: data.userId,
  //         messageData: data.message,
  //         chatroomId: data.chatroomId,
  //       },
  //     ]);
  //   };

  //   socket.on("chatroomMessage", handleChatroomMessage);
  // }, [socket, privateMessages]);
  return (
    <div class="flex flex-col  bg-white px-4 py-6 z-50 h-full w-full">
      <div class="flex flex-row items-center py-4 px-6 rounded-2xl shadow">
        <div class="flex items-center justify-center h-10 w-10 rounded-full bg-pink-500 text-pink-100">
          T
        </div>
        <div class="flex flex-col ml-3">
          {roomInfo ? roomInfo.name : ""}
          <div class="text-xs text-gray-500">Active</div>
        </div>
        <div class="ml-auto">
          <ul class="flex flex-row items-center space-x-2">
            
          </ul>
        </div>
      </div>
      <div className="flex flex-col h-full w-full overflow-y-auto	p-2.5">
        {chatMessages.map((message, index) => (
          
          <div
            key={index}
            className={`flex ${
              message.userId === currentUserId ? "justify-end" : "justify-start"
            } mb-4 ml-4 translate-y-4`}
          >
               <img
                src="https://robohash.org/mail@ashallendesign.co.uk"
                className="rounded-full w-8 h-8 flex-shrink-0 bg-red-500"
              />
            <div
              className={`p-3 rounded-lg ${
                message.userId === currentUserId
                  ? "bg-indigo-100 shadow translate-x-6 mr-4"
                  : "bg-white shadow translate-x-6 mr-4"
              }`}
            >
           
              <div>{message.message}</div>
            </div>
          </div>
        ))}

        {privateMessages.map(
          (message, index) => (
            console.log(message),
            (
              <div
                key={index}
                className={`flex ${
                  message.recipientId == currentUserId
                    ? "justify-end"
                    : "justify-start"
                } mb-4 ml-4 translate-y-4`}
              >
                <div
                  className={`p-3 rounded-lg ${
                    message.senderId == currentUserId
                      ? "bg-indigo-100 shadow translate-x-6 mr-4"
                      : "bg-white shadow translate-x-6 mr-4"
                  }`}
                >
                  <div>{message.message}</div>
                </div>
              </div>
            )
          )
        )}
      </div>

      <div class="flex flex-row items-center">
        <div class="flex flex-row items-center w-full border rounded-3xl h-12 px-2">
          <div>
           
          </div>
          <div class="w-full p-4">
            <input
              type="text"
              onChange={(e) => setMessage(e.target.value)}
              class="border border-transparent w-full focus:outline-none text-sm h-10 flex items-center"
              placeholder="Type your message...."
            />
          </div>
          <div class="flex flex-row">
            <button class="flex items-center justify-center h-10 w-8 text-gray-400">
              
            </button>
          </div>
        </div>
        <div class="ml-6">
          <button
            class="flex items-center justify-center h-10 w-10 rounded-full bg-gray-200 hover:bg-gray-300 text-indigo-800 text-white"
            onClick={handleSendMessage}
          >
            <svg
              class="w-5 h-5 transform rotate-90 -mr-px"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              ></path>
            </svg>
          </button>

          <Toaster />
        </div>
      </div>
    </div>
  );
};
export default ChatBox;
