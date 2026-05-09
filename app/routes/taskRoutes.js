const express = require("express");
const Router = express();
const TaskController = require("../controllers/TaskController");
const authCheck = require("../middleware/authMiddleware");
const allowRole = require("../middleware/roleMiddleware");
const uploadFiles = require("../utils/uploadImage");

Router.post(
  "/create",
  authCheck,
  allowRole("admin", "manager"),
  uploadFiles.array("attachments", 4),
  TaskController.createTask,
);
Router.get("/", authCheck, allowRole("admin","manager"), TaskController.allTasks);
Router.put("/:id",authCheck, allowRole("admin"), uploadFiles.array("attachments", 4),TaskController.updateTask);
Router.patch("/status/:id",authCheck, allowRole("manager"),TaskController.updateTaskStatus);
Router.patch("/assign/:id",authCheck, allowRole("manager"),TaskController.updateAssignTask);
Router.get('/find',authCheck, allowRole("user"),TaskController.viewAssignedTask);

module.exports = Router;
