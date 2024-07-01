import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "tailwindcss/tailwind.css";
import Calendar from "react-calendar";
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import _ from "lodash";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "../outils/SortableItem";
import Droppable from "../outils/Droppable";
import { FaBars, FaPaperclip, FaTasks } from "react-icons/fa";
import Navbar from "./Navbar";

import RichTextEditor from "../outils/RichTextEditor";
import AddUser from "./AddUser";
import "react-calendar/dist/Calendar.css";
import { CiCreditCard1, CiCalendarDate } from "react-icons/ci";
import { Editor } from "@tinymce/tinymce-react";
import { BsChatDots } from "react-icons/bs";
const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [todoTasks, setTodoTasks] = useState([]);
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState([]);
  const [newTaskInput, setNewTaskInput] = useState("");
  const [showNewTaskInput, setShowNewTaskInput] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [comment, setComment] = useState("");
  const [users, setUsers] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [openDiv, setOpenDiv] = useState(false);
  const [openDescription, setOpenDescription] = useState(false);
  const [openComment, setOpenComment] = useState(false);
  const [taskId, setTaskId] = useState();
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [dateValue, setDateValue] = useState("");
  const [userData, setUserData] = useState([]);
  const [openInput, setOpenInput] = useState(false);
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    })
  );

  const handleDateChange = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      setDateValue(date.toDateString());
      setIsCalendarOpen(false); // Close the calendar after date selection
      console.log("Selected date: ", date); // Log the selected date or handle it as needed
    } else {
      console.error("Invalid date selected");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!taskId) {
        return;
      }

      console.log("Mounted and waiting for taskId to be retrieved");
      try {
        const response = await axios.get(
          `http://localhost:3000/api/tasks/user-tasks/${taskId}`
        );

        setUsers(response.data.users); // Update state with fetched users
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [taskId]); // Add taskId as a dependency

  useEffect(() => {
    const fetchData = async () => {
      if (!taskId) {
        return;
      }

      console.log("Mounted and waiting for taskId to be retrieved");
      try {
        const response = await axios.get(
          `http://localhost:3000/api/tasks/utils/get-comments/${taskId}`
        );

        setComments(response.data.comments);
        const usersData = response.data.comments.map((comment) => comment.User);
        setUserData(usersData);
        // setComments(response.data.users); // Update state with fetched users
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [taskId]); // Add taskId as a dependency

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/tasks/get-tasks"
        );
        console.log(response);
        if (response.status === 200) {
          const fetchedTasks = response.data || [];
          // Add the type property to each task
          const tasksWithType = fetchedTasks.map((task) => ({
            ...task,
            type: "task",
          }));
          // Save the augmented tasks in your component state
          setTasks(tasksWithType);
          setTodoTasks(tasksWithType.filter((task) => task.status === "todo"));
          setInProgressTasks(
            tasksWithType.filter((task) => task.status === "in Progress")
          );
          setDoneTasks(tasksWithType.filter((task) => task.status === "done"));
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchData();
    console.log(tasks);
  }, []);

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);

    const task = tasks.find((task) => task.task_id === active.id);
    if (task) {
      console.log("Task picked up:", task);
      setActiveTask(task);
    } else {
      console.error("Active item is not a task.");
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const task = tasks.find((task) => task.task_id === activeId);
    if (task) {
      const destinationColumnId = over.id;

      let newStatus;
      switch (destinationColumnId) {
        case "todo":
          newStatus = "todo";
          break;
        case "inProgress":
          newStatus = "in Progress";
          break;
        case "Done":
          newStatus = "Done";
          break;
        default:
          return;
      }

      setTasks((prevTasks) => {
        const updatedTasks = [...prevTasks];
        const taskIndex = updatedTasks.findIndex(
          (task) => task.task_id === activeId
        );

        if (taskIndex !== -1) {
          updatedTasks[taskIndex].status = newStatus;
        }

        return updatedTasks;
      });

      try {
        await axios.put(
          `http://localhost:3000/api/tasks/update-status/${activeId}`,
          {
            status: newStatus,
          }
        );
        console.log("Task status updated successfully.");
      } catch (error) {
        console.error(error);
      }

      updateColumnTasks();
    } else {
      console.error("Active item is not a task.");
    }
  };

  const openMenu = () => {
    setOpen(!open);
  };

  useEffect(() => {
    console.log(comment);
  });
  const updateColumnTasks = () => {
    setTodoTasks(tasks.filter((task) => task.status === "todo"));
    setInProgressTasks(tasks.filter((task) => task.status === "in Progress"));
    setDoneTasks(tasks.filter((task) => task.status === "Done"));
  };
  const handleAddTaskClick = () => {
    setOpenInput(true);
  };

  const handleInputChange = (e) => {
    setNewTaskInput(e.target.value);
  };

  const handleDoneClick = async () => {
    if (newTaskInput.trim()) {
      try {
        const response = await axios.post(
          `http://localhost:3000/api/tasks/create-task/`,
          {
            title: newTaskInput.trim(),
            description: "",
          }
        );
        const newTask = response.data;
        setTasks((prevTasks) => [...prevTasks, newTask]);
        setTodoTasks((prevTasks) => [...prevTasks, newTask]);
        setNewTaskInput("");
        setOpenInput(false);
      } catch (error) {
        console.error("Error creating task:", error);
      }
    }
  };
  const handleOpenDiv = (taskId) => {
    setTaskId(taskId);
    setOpenDiv(!openDiv);
  };
  useEffect(() => {
    console.log(taskId);
  });
  const handleOpenDes = () => {
    setOpenDescription(!openDescription);
  };
  const handleOpenComment = () => {
    setOpenComment(!openComment);
  };

  const debouncedChangeHandler = useCallback(
    _.debounce((value) => {
      console.log("Description changed:", value);
      setDescription(value);
    }, 1000),
    []
  );

  const handlePostDC = async () => {
    try {
      const regex = /(<([^>]+)>)/gi;
      const newComment = comment.replace(regex, "");
      const newDescription = description.replace(regex, "");
      const response = await axios.post(
        `http://localhost:3000/api/tasks/post-dc/${taskId}`,
        {
          comments: newComment,
          description: newDescription,
        }
      );
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const handleTaskMsg = async () => {
    const regex = /(<([^>]+)>)/gi;
    const newContent = comment.replace(regex, "");
    console.log("this is new Content", newContent);
    try {
      const userId = localStorage.getItem("userId");
      console.log(userId);
      const response = await axios.post(
        `http://localhost:3000/api/tasks/utils/create-taskmsg/${taskId}`,
        {
          content: newContent,
          user_id: userId,
        }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditorChange = (value) => {
    setComment(value);
  };
  const handleToggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  const getTaskId = (id) => {};

  const OpenedLayout = () => {
    return (
      <>
        {openDiv && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="relative flex flex-col rounded-lg open-div-bg p-4 w-full max-w-3xl">
              <div className="flex justify-between">
                <div className="flex flex-col space-y-4 w-full">
                  {tasks
                    .filter((task) => taskId === task.task_id)
                    .map((task) => (
                      <div className="" onClick={getTaskId(task.task_id)}>
                        <div className="flex items-start gap-2 ">
                          <CiCreditCard1 className="text-lg text-slate-100" />
                          <p className="text-slate-100 ">{task.title}</p>
                        </div>
                        <div className="translate-y-1">
                          <p className="text-slate-100">Members</p>
                          <img
                            src="https://robohash.org/mail@ashallendesign.co.uk"
                            className="rounded-full w-8 h-8 flex-shrink-0 bg-red-500"
                          />
                        </div>
                        <p className="pt-4 text-slate-100 text-lg font-bold">
                          Due Date
                        </p>
                        <div className="rounded bg-gray-500 w-fit flex flex-row gap-2 items-center">
                          <CiCalendarDate className="text-slate-100" />
                          <p className="text-slate-100">{dateValue}</p>
                        </div>
                      </div>
                    ))}
                  <div className="flex flex-row items-center space-x-2">
                    <FaBars className="text-lg text-slate-100" />
                    <span className="text-lg text-slate-100 font-bold">
                      Description
                    </span>
                  </div>
                  {tasks
                    .filter((task) => taskId === task.task_id)
                    .map((task) => (
                      <div key={task.id} className="">
                        {task.description ? (
                          <div className="mt-2 p-2  rounded-lg border-2 border-customFill bg-customBg">
                            <p className="text-gray-300">{task.description}</p>
                          </div>
                        ) : (
                          <div
                            className="mt-2 p-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200 hover:shadow hover:shadow-white"
                            onClick={() => handleOpenDes(task)}
                          >
                            <span className="text-gray-500">
                              Add a more detailed description...
                            </span>
                          </div>
                        )}

                        {openDescription && (
                          <div>
                            <RichTextEditor
                              onChange={debouncedChangeHandler}
                              value={description}
                            />
                            <button
                              className={`mt-2 p-2 rounded ${
                                description
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                              }`}
                              disabled={!description}
                              onClick={handlePostDC}
                            >
                              Save Description
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  <div>
                    <div className="flex items-center space-x-2 w-full">
                      <FaBars className="text-lg text-slate-100" />
                      <h3 className="text-lg font-bold text-slate-100">
                        Activities
                      </h3>
                    </div>
                    {openComment ? (
                      <div className="mt-2">
                        <RichTextEditor onChange={setComment} value={comment} />
                        <button
                          className={`mt-2 p-2 rounded ${
                            comment
                              ? "bg-blue-500 text-white"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                          onClick={handleTaskMsg}
                        >
                          Add Comment
                        </button>
                      </div>
                    ) : (
                      <div
                        className="mt-2 p-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200 hover:shadow hover:shadow-white"
                        onClick={handleOpenComment}
                      >
                        <span className="text-gray-500">
                          Write a comment...
                        </span>
                      </div>
                    )}
                    {comments.map((c) => (
                      <div className="flex flex-col">
                        <div className="flex flex-row p-1 gap-2 items-center mt-4">
                          <img
                            src="https://robohash.org/mail@ashallendesign.co.uk"
                            className="rounded-full w-8 h-8 flex-shrink-0 bg-red-500"
                          />
                          <p className="text-gray-200">
                            {c.User.firstName} {c.User.lastName}
                          </p>
                        </div>
                        <div className="mt-2 p-2  rounded-lg border-2 border-customFill bg-customBg">
                          {c.content}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className=" flex flex-col p-5  w-6/12	space-y-2 translate-x-5 ">
                  <p className="font-bold text-lg font-bold text-slate-100">
                    Add a Card
                  </p>
                  <ul className="space-y-2">
                    <li
                      className="rounded-lg bg-gray-100 w-auto p-2 cursor-pointer"
                      onClick={openMenu}
                    >
                      Add a member
                    </li>
                    <AddUser open={open} onClose={openMenu} taskId={taskId} />
                    <li
                      className="rounded-lg bg-gray-100 w-auto p-2"
                      onClick={handleToggleCalendar}
                    >
                      Due Date
                    </li>
                    {isCalendarOpen && (
                      <div className="absolute mt-2 z-50">
                        <Calendar
                          onChange={handleDateChange}
                          value={dateValue}
                        />
                      </div>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      
      <div className="flex flex-row h-full w-full p-4 space-x-4  justify-center overflow-auto">
        
        <OpenedLayout />
        <Droppable id="todo">
          <div className="flex flex-col w-full max-w-md sm:max-w-sm lg:max-w-lg xl:max-w-xl min-w-0">
            <h2 className="text-xl font-bold mb-4">Todo</h2>
            <SortableContext
              items={tasks
                .filter((task) => task.status === 'todo')
                .map((task) => task.task_id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col space-y-2">
                {tasks
                  .filter((task) => task.status === 'todo')
                  .map((task) => (
                    <div
                      className="bg-gray-100 p-2 rounded-md shadow-sm flex relative"
                      onClick={() => handleOpenDiv(task.task_id)}
                      key={task.task_id}
                    >
                      <SortableItem task={task} />
                      <div className="absolute bottom-2 left-2 flex space-x-2">
                        <CiCalendarDate className="text-gray-500" />
                        <BsChatDots className="text-gray-500" />
                        <FaPaperclip className="text-gray-500" />
                      </div>
                    </div>
                  ))}
                {openInput ? (
                  <div className="flex flex-col items-center space-y-2">
                    <input
                      className="rounded-lg border-2 border-customFill p-2 w-full"
                      value={newTaskInput}
                      onChange={handleInputChange}
                      placeholder="Enter your task"
                    />
                    <button
                      className="rounded-lg bg-green-500 p-1 text-white w-full"
                      onClick={handleDoneClick}
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <div
                    className="flex justify-center rounded-lg bg-cyan-500 p-1 cursor-pointer"
                    onClick={handleAddTaskClick}
                  >
                    <p className="text-white">Add Task</p>
                  </div>
                )}
              </div>
            </SortableContext>
          </div>
        </Droppable>
        <Droppable id="inProgress">
          <div className="flex flex-col w-full max-w-md sm:max-w-sm lg:max-w-lg xl:max-w-xl min-w-0">
            <h2 className="text-xl font-bold mb-4">In Progress</h2>
            <SortableContext
              items={tasks
                .filter((task) => task.status === 'in Progress')
                .map((task) => task.task_id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col space-y-2 min-h-[100px]">
                {tasks
                  .filter((task) => task.status === 'in Progress')
                  .map((task) => (
                    <div
                      className="bg-gray-100 p-2 rounded-md shadow-sm flex relative"
                      key={task.task_id}
                    >
                      <SortableItem task={task} />
                      <div className="absolute bottom-2 left-2 flex space-x-2">
                        <FaBars className="text-gray-500" />
                        <FaPaperclip className="text-gray-500" />
                      </div>
                    </div>
                  ))}
                <div className="empty-space"></div>
              </div>
            </SortableContext>
          </div>
        </Droppable>
        <Droppable id="done">
          <div className="flex flex-col  max-w-md sm:max-w-sm lg:max-w-lg xl:max-w-xl min-w-0">
            <h2 className="text-xl font-bold mb-4">Done</h2>
            <SortableContext
              items={tasks
                .filter((task) => task.status === 'Done')
                .map((task) => task.task_id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col space-y-2 min-h-[100px]">
                {tasks
                  .filter((task) => task.status === 'Done')
                  .map((task) => (
                    <div
                      className="bg-gray-100 p-2 rounded-md shadow-sm flex relative"
                      key={task.task_id}
                    >
                      <SortableItem task={task} />
                      <div className="absolute bottom-2 left-2 flex space-x-2">
                        <FaBars className="text-gray-500" />
                        <FaPaperclip className="text-gray-500" />
                      </div>
                    </div>
                  ))}
                <div className="empty-space"></div>
              </div>
            </SortableContext>
          </div>
        </Droppable>
      </div>
      <DragOverlay>
        {activeTask && (
          <div className="bg-gray-400 p-2 rounded-md rounded-lg">
            {activeTask.title}
            {activeTask.description}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );

};
export default Tasks;
