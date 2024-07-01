import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { useDraggable } from '@dnd-kit/core';




const DraggableUser = ({ user }) => {
  
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: user.user_id,
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : '',
  };

  return (
    <img
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      src={user.image}
      alt={user.name}
      className="w-10 h-10 rounded-full"
      style={style}
    />
  );
};

const SideBar = ({user}) => {

  const [show, setShow] = useState(false);

  const toggleMenu = () => {
    setShow(!show);
  };
  const handleUser = (user) => { 
   
  }
  
  return (
    <div className="relative h-full">
      <div onClick={toggleMenu} className={`button-container ${show ? 'open' : ''}`}>
        <FontAwesomeIcon icon={show ? faChevronLeft : faChevronRight} size="2x" />
      </div>
      <div className={`fixed top-16 left-0 h-full bg-gray-800 transition-transform duration-300 ease-in-out ${show ? 'transform translate-x-0' : 'transform -translate-x-full'}`} style={{ width: '300px', zIndex: 10, }}>
        <div className="relative z-20">
          <div className="flex flex-row justify-between items-center p-4">
            <p className="bold text-white">Board Name</p>
          </div>
          <div className="divide-y divide-gray-700 bg-gray-800 w-full">
            <div className="mt-4">
              <ul className="text-white">
                <li className="py-2 px-4 hover:bg-gray-700 cursor-pointer">Boards Template</li>
                <li className="py-2 px-4 hover:bg-gray-700 cursor-pointer">
                  Members
                  <div className="flex mt-2 space-x-2">
  {user.map(user => (
    <div key={user.id} onClick={() => handleUser(user)}>
      <DraggableUser user={user} />
    </div>
  ))}
</div>

                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
