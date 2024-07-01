import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../contexts/SocketContext.jsx";
import svg from "../assets/subtle-prism.svg";

function Room() {
  const [chatrooms, setChatrooms] = useState([]);
  const { socket } = useSocket();
  const [roomdata, setRoomData] = useState("");
  const [invitationKey, setInvitationKey] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [showJoinInput, setShowJoinInput] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isValidCode, setIsValidCode] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState(null);
  const fileTypes = ["JPG", "PNG", "GIF"];
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchUserChatrooms = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/chat/user/${userId}`
        );
        console.log(response);
        if (response.data.success) {
          const chatrooms = response.data.data;
          console.log(chatrooms); // Ensure you receive an array of chatrooms

          // Assuming you want to process each chatroom
          chatrooms.forEach((chatroom) => {
            console.log(chatroom.name);
            console.log(chatroom.chatroom_id);

            // Handle each chatroom as needed
            localStorage.setItem("chatroomId", chatroom.chatroom_id);
            localStorage.setItem("roomName", chatroom.name);
            socket.emit("joinChatroom", chatroom.name, chatroom.chatroom_id);
          });
          console.log('Setting chatroom info to roomdata state',response.data.data);
          setRoomData(chatrooms)
          navigate("/ChatRoom", { state: { roomdata: response.data.data }});
        } else {
          console.error("No chatrooms found");
        }
      } catch (error) {
        console.error("Error fetching user chatrooms:", error);
      }
    };

    fetchUserChatrooms();
  }, [navigate, socket]);

  const joinChatroom = async () => {
    const userId = localStorage.getItem("userId");
    try {
      const response = await axios.post(
        `http://localhost:3000/api/chat/join/${userId}/${invitationKey}`
      );
      console.log(response);
      localStorage.setItem(
        "chatroomId",
        response.data.data.chatroom.chatroom_id
      );
      localStorage.setItem("roomName", response.data.data.chatroom.name);
      socket.emit(
        "joinChatroom",
        response.data.data.chatroom.name,
        response.data.data.chatroom.chatroom_id
      );
      setRoomData(response.data.data.chatroom);
      return response;
    } catch (error) {
      console.error("Error joining chatroom:", error);
      setRoomData("An error occurred while joining chatroom");
      throw error;
    }
  };

  const handleCheckCode = async () => {
    setIsChecking(true);
    try {
      const response = await joinChatroom();
      if (response && response.data.success) {
        setIsValidCode(true); // Set validity to true
        setRoomData(response.data.data.chatroom); // Set room data
        // Navigate to ChatRoom component
        navigate("/ChatRoom", {
          state: { roomdata: response.data.data.chatroom },
        });
      } else {
        setIsValidCode(false);
      }
    } catch (error) {
      console.error("Error joining chatroom:", error);
      setIsValidCode(false);
    }
    setIsChecking(false);
  };

  return (
    <div className="flex justify-center">
      <label
        htmlFor="InvitationKey"
        className="relative block w-full overflow-hidden rounded-md border border-cyan-400 px-3 pt-3 shadow-sm focus-within:border-black-600 focus-within:ring-1 focus-within:ring-black-600"
      >
        <input
          type="text"
          id="InvitationKey"
          placeholder="Invitation Key"
          value={invitationKey}
          onChange={(e) => setInvitationKey(e.target.value)}
          className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
        />
        <span className="absolute start-3 top-3 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:text-xs">
          Invitation Key
        </span>
      </label>

      <button
        className="mt-2 px-4 py-2 text-white rounded-md bg-cyan-500 hover:bg-cyan-500"
        onClick={handleCheckCode}
        disabled={isChecking}
      >
        {isChecking ? (
          <div role="status">
            <svg
              aria-hidden="true"
              className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
          "Join"
        )}
      </button>

      {!isChecking && isValidCode && (
        <div className="text-green-600 mt-2">
          Valid Code<br></br>Redirecting...
        </div>
      )}
      {!isChecking && !isValidCode && (
        <div className="text-red-600 mt-2">Invalid Code</div>
      )}
    </div>
  );
}

export default Room;
