const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Task = require("../models/Task");

// Get all tasks for a specific date
router.get("/:date", auth, async (req, res) => {
  try {
    const tasks = await Task.find({
      userId: req.user.id,
      date: req.params.date,
    });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Create a new task
router.post("/", auth, async (req, res) => {
  const { title, status, date } = req.body;

  console.log("🟡 Incoming data:", req.body);
  console.log("🟢 User ID:", req.user?.id);

  try {
    const newTask = new Task({
      title,
      status: status || "todo",
      date,
      userId: req.user.id,
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    console.error("❌ Task creation error:", err);
    res.status(500).json({ error: "Failed to create task" });
  }
});

// Update a task
router.put("/:id", auth, async (req, res) => {
  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: "Failed to update task" });
  }
});

// Delete a task
router.delete("/:id", auth, async (req, res) => {
  try {
    await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete task" });
  }
});

module.exports = router;
