const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium",
    },
    dueDate: {
      type: Date,
    },
    attachments: [
      {
        url: String,
        public_id: String,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Task = mongoose.model("TaskModel", taskSchema);
module.exports = Task;
