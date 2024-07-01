import React,{useState} from "react";

const OnlineMenu = () => { 
    const [selectedUser, setSelectedUser] = useState(null);
    const users = [
        { id: 1, name: 'User 1', online: true },
        { id: 2, name: 'User 2', online: false },
        { id: 3, name: 'User 3', online: true },
      ];
    
      const handleUserClick = (user) => {
        setSelectedUser(user);
      };


      return(
<div className="bg-violet-50 h-full p-4 rounded-lg">
          <div className="flex flex-col justify-start items-end w-56">
            {users.map((user, index) => (
              <div key={user.id} className="w-full relative">
                <div
                  className={`py-2 px-4 rounded-lg cursor-pointer ${
                    selectedUser && selectedUser.id === user.id && 'bg-gray-200'
                  }`}
                  onClick={() => handleUserClick(user)}
                >
                  {user.name}
                </div>
                {user.online && (
                  <div className="absolute top-1 right-1 w-4 h-4 bg-green-500 rounded-full"></div>
                )}
                {index !== users.length - 1 && (
                  <div className="w-full h-px bg-gray-400"></div>
                )}
              </div>
            ))}
          </div>
        </div>
    
      )
}
export default OnlineMenu