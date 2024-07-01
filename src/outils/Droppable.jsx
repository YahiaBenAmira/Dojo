// Droppable.jsx
import React from 'react';
import { useDroppable } from '@dnd-kit/core';

const Droppable = ({ id, children }) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <div ref={setNodeRef}       className={`flex flex-col rounded-lg p-4 border-2 ${isOver ? 'border-green-500' : 'border-transparent'}`}
    >
      {children}
    </div>
  );
};

export default Droppable;
