import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FaBars, FaPaperclip } from 'react-icons/fa';

function SortableItem({ task }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.task_id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="relative p-4">
      <div className="relative right-4 bottom-3 ">
      <p className="bg-pink-500 rounded-lg w-20 text-center">{task.title}</p>
      <p className="  ">{task.description}</p>
      </div>

     
    </div>
  );
}

export default SortableItem;
