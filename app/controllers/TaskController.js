const Task = require("../models/Task");
const User = require("../models/User");
const cloudinary = require("../config/cloudinary");
const fs = require("fs").promises;

class TaskController {
  async createTask(req, res) {
    try {
      const { title, description, dueDate, assignedTo } = req.body;

      if (!title || !description) {
        return res.status(400).json({
          success: false,
          message: "All required fields are needed",
        });
      }

      let attachments = [];

      console.log(req.files);

      // upload files to cloudinary
      if (req.files && req.files.length > 0) {
        for (let file of req.files) {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "tasks",
          });

          attachments.push({
            url: result.secure_url,
            public_id: result.public_id,
          });

          // delete local file
          await fs.unlink(file.path);
        }
      }

      let task = new Task({
        title,
        description,
        assignedBy: req.user.id,
        dueDate,
        assignedTo,
        attachments,
      });

      const showData = await task.save();

      return res.status(201).json({
        success: true,
        message: "Task created successfully",
        data: showData,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  async allTasks(req, res) {
    try {
      const showAll = await Task.find({});
      return res.status(200).json({
        success: true,
        message: "Fetched data successfully",
        count: showAll.length,
        data: showAll,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  async updateTask(req, res) {
    try {
      const id = req.params.id;
      const updateData = await Task.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      return res.status(200).json({
        success: true,
        message: "Data updated successfully",
        data: updateData,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  async updateTaskStatus(req, res) {
    try {
      const id = req.params.id;
      const updateData = await Task.findByIdAndUpdate(
        id,
        { status: "In Progress" },
        {
          new: true,
        },
      );
      return res.status(200).json({
        success: true,
        message: "Data fields updated successfully",
        data: updateData,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  async updateAssignTask(req, res) {
    try {
      const id = req.params.id;
      const { assignedTo } = req.body;

      // check employee exists
      const employee = await User.findById(assignedTo);

      if (!employee) {
        return res.status(404).json({
          success: false,
          message: "Employee not found",
        });
      }
      // check role
      if (employee.role !== "user") {
        return res.status(400).json({
          success: false,
          message: "Task can only be assigned to employee/user",
        });
      }
      // update task
      const updateData = await Task.findByIdAndUpdate(
        id,
        {
          assignedTo,
        },
        {
          new: true,
        },
      );
      return res.status(200).json({
        success: true,
        message: "Task assigned successfully!",
        data: updateData,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  async viewAssignedTask(req, res) {
    try {
      // we are going to pass the employee in the token
      const tasks = await Task.find({
        assignedTo: req.user.id,
      });
      return res.status(200).json({
        success: true,
        message: "Here is your Task!",
        tasks,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
}

module.exports = new TaskController();
