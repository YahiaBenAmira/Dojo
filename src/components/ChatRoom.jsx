import React, { useState, useEffect } from "react";
import axios from "axios";
import Menu from "./Menu";
import { useLocation, Outlet, Link, useParams } from "react-router-dom";
import OnlineMenu from "./Onlinemenu.jsx";
import { useSocket } from "../contexts/SocketContext.jsx";

const ChatRoom = () => {
  const location = useLocation();
  const { socket } = useSocket();
  const { roomdata } = location.state || { roomdata: [] }; // Ensure roomdata is initialized as an array
  const [roomInfo, setRoomInfo] = useState([]);
 
  const [roomName, setRoomName] = useState("");
 
  const [usersInfo, setUsersInfo] = useState([]);
  const [selectedUser, setSelectedUser] = useState({
    name: "",
    user_id: "",
  });


  useEffect(() => {
    // Check if roomdata is not null and is an array with at least one element
    if (roomdata && roomdata.length > 0) {
      setRoomInfo(roomdata[0]); // Set the first object in roomdata array to roomInfo state
    }
  }, [roomdata]);



  useEffect(() => {
    
    const fetchData = async () => {
      try {
        const chatroomId = localStorage.getItem("chatroomId");
        const response = await axios.get(
          `http://localhost:3000/api/chat/chatroom/${chatroomId}`
        );
        
        const roomNames = response.data.data.chatroom.map((room) => room.name);
          console.log(roomNames);
        const Users = response.data.data.users.map((user) => ({
          id: user.user_id,
          firstName: user.firstName,
        }));

        setRoomName(roomNames);
        setUsersInfo(Users);
      } catch (error) {
        console.error("Error fetching chatrooms:", error);
      }
    };

    fetchData();
  }, []);



  const HandleClickUser = (user, id) => {
    console.log(`HandleClickUser called with user: ${user}, id: ${id}`);

    setSelectedUser({ name: user, user_id: id });

    const userId = localStorage.getItem("userId");
    const recipientId = id;

    console.log(
      `Emitting joinPrivateRoom with senderId: ${userId}, recipientId: ${recipientId}`
    );

    socket.emit("joinPrivateRoom", { senderId: userId, recipientId });
  };

  const handleChatRoomJoin = () => {
    socket.emit("joinChatroom", roomInfo.chatroom_id, roomName);
  };

  useEffect(() => {
    localStorage.setItem("selectedUserId", selectedUser.user_id);
  });
  const currentUserId = localStorage.getItem("userId");
  return (
    <div>
      <div class="flex flex-row h-screen antialiased text-gray-800">
        <div class="flex flex-row w-auto flex-shrink-0 bg-indigo-200 p-4">
        
          <div class="flex flex-col w-full h-full pl-4 pr-4 py-4 -mr-4">
            <div class="flex flex-row items-center">
              <div class="flex flex-row items-center">
                <div class="text-xl font-semibold">Messages</div>
                <div class="flex items-center justify-center ml-2 text-xs h-5 w-5 text-white bg-red-500 rounded-full font-medium">
                  5
                </div>
              </div>
              <div class="ml-auto">
                <button class="flex items-center justify-center h-7 w-7 bg-gray-200 text-gray-500 rounded-full">
                  <svg
                    class="w-4 h-4 stroke-current"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
            <div class="mt-5">
              <ul class="flex flex-row items-center justify-between">
                <li>
                  <a
                    href="#"
                    class="flex items-center pb-3 text-xs font-semibold relative text-indigo-800"
                  >
                    <span>All Conversations</span>
                    <span class="absolute left-0 bottom-0 h-1 w-6 bg-indigo-800 rounded-full"></span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    class="flex items-center pb-3 text-xs text-gray-700 font-semibold"
                  >
                    <span>Archived</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    class="flex items-center pb-3 text-xs text-gray-700 font-semibold"
                  >
                    <span>Starred</span>
                  </a>
                </li>
              </ul>
            </div>
            <div class="mt-5">
              <div class="text-xs text-gray-400 font-semibold uppercase">
                Team
              </div>
            </div>
            <div class="mt-2">
              <div class="flex flex-col -mx-4">
                <div class="relative flex flex-row items-center p-4">
                  <div class="absolute text-xs text-gray-500 right-0 top-0 mr-4 mt-3">
                    5 min
                  </div>
                  <div class="flex items-center justify-center h-10 w-10 rounded-full bg-pink-500 text-pink-300 font-bold flex-shrink-0">
                    T
                  </div>

                  <div class="flex flex-col flex-grow ml-3">
                    <div class="flex items-center">
                      <Link
                        class="text-sm font-medium"
                        to={`/ChatRoom/${roomInfo.chatroom_id}/chatroom`}
                        onClick={handleChatRoomJoin}
                      >
                        {roomInfo ? roomInfo.name : ""}
                      </Link>
                      <div class="h-2 w-2 rounded-full bg-green-500 ml-2"></div>
                    </div>
                    <div class="text-xs truncate w-40 ">
                   Company chatroom
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-5">
              <div class="text-xs text-gray-400 font-semibold uppercase">
                Personal
              </div>
            </div>
            {usersInfo
              .filter((user) => user.id != currentUserId)
              .map((user) => (
                <Link
                  key={user.id}
                  to={`/ChatRoom/${user.id}/user`}
                  className="h-auto overflow-hidden relative pt-2"
                  onClick={() => HandleClickUser(user.firstName, user.id)}
                >
                  <div className="flex flex-col divide-y h-auto overflow-y-auto -mx-4">
                    <div className="flex flex-row items-center p-4 relative">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-pink-500 text-pink-300 font-bold flex-shrink-0">
                        {user.firstName[0]}
                      </div>
                      <div className="flex flex-grow ml-3">
                        <div className="text-sm font-medium">
                          {user.firstName} {user.id}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>

        <div className="w-8/12">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
