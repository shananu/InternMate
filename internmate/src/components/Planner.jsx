import React, { useEffect, useState } from "react";
import TaskList from "./TaskList";
import MonthView from "./MonthView";
import "../styles/Planner.css";
import TopBar from "./TopBar";

import {
  fetchTasksByDate,
  createTask,
  updateTask,
  deleteTask,
} from "../api/plannerApi";

const Planner = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateObj) => dateObj.toISOString().split("T")[0];

  const loadTasks = async () => {
    try {
      setLoading(true);
      const tasks = await fetchTasksByDate(formatDate(selectedDate));
      setTasks(tasks);
    } catch (err) {
      console.error("❌ Failed to load tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [selectedDate]);

  const handleAddTask = async (title, status = "todo") => {
    try {
      await createTask({
        title,
        date: formatDate(selectedDate),
        status,
      });
      loadTasks();
    } catch (err) {
      console.error("❌ Failed to add task:", err);
    }
  };

  const handleUpdateTask = async (id, updates) => {
    try {
      await updateTask(id, updates);
      loadTasks();
    } catch (err) {
      console.error("❌ Failed to update task:", err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      loadTasks();
    } catch (err) {
      console.error("❌ Failed to delete task:", err);
    }
  };

  return (
    <div className="planner-wrapper">
      <TopBar colr="orange"/>
      <h1 className="planner-heading">✨ Plan Your Day</h1>
      <div className="planner-grid">
        <TaskList
          selectedDate={selectedDate}
          tasks={tasks}
          onAddTask={handleAddTask}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
          loading={loading}
        />
        <MonthView
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </div>
    </div>
  );
};

export default Planner;
