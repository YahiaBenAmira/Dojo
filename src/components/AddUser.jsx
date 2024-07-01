import React, { useEffect, useState } from "react";
import axios from "axios";

const AddUser = ({ open, onClose, taskId }) => {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const companyId = localStorage.getItem("companyId");
        const response = await axios.get(
          `http://localhost:3000/api/company/get-all/${companyId}`
        );
        if (response.status === 200 || response.status === 201) {
          setUsers(response.data.company.users);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const assignUser = async (id) => {
    try {
    const response =  await axios.post(`http://localhost:3000/api/tasks/assign-user/${taskId}`, {
        user_id: id
      });
      console.log(response)
    } catch (error) {
      console.log(error);
    }
  };

  const retrieveIdAndAssignUser = async (id) => {
    setUserId(id);
    console.log(id);
    await assignUser(id);
  };

  const filteredUsers = users.filter(user => 
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {open && (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center z-60 mr-1">
          <div className="bg-white rounded-lg p-4 max-w-md shadow-lg">
            <div className="flex flex-col space-y-2 p-2">
              <p className="font-bold">Members</p>
              <input
                className="rounded border p-2 focus:border-blue-500"
                placeholder="Search for members"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
              <p className="font-bold">Card Members</p>
              <div className="space-y-1">
                {filteredUsers.map((user) => (
                  <div
                    key={user.user_id}
                    className="flex items-center space-x-2 hover:rounded-lg hover:bg-red-500 p-1 transition-all duration-200"
                    tabIndex={0}
                    onClick={() => retrieveIdAndAssignUser(user.user_id)}
                  >
                    <img
                      src="https://robohash.org/mail@ashallendesign.co.uk"
                      className="rounded-full w-8 h-8 flex-shrink-0 bg-red-500"
                      alt={`${user.firstName} ${user.lastName}`}
                    />
                    <span>{user.firstName}</span>
                    <span>{user.lastName}</span>
                  </div>
                ))}
              </div>
              <button
                className="mt-2 p-2 bg-blue-500 text-white rounded"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddUser;
