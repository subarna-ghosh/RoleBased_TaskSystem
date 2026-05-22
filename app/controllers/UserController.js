const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cloudinary = require("../config/cloudinary");
const sendEmail = require("../utils/sendMail");
const fs = require("fs").promises;

class UserController {
  async createUser(req, res) {
    try {
      console.log(req.body);
      const { name, email, phone, password } = req.body;
      if (!name || !email || !phone || !password) {
        return res.status(400).json({
          success: false,
          message: "all fields are needed!",
        });
      }

      const isExist = await User.findOne({ email });
      if (isExist) {
        return res.status(400).json({
          success: false,
          message: "user already exists!",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashPass = await bcrypt.hash(password, salt);

      let userData = new User({
        name,
        email,
        phone,
        password: hashPass,
      });

      //   console.log(req.file)
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "admin-upload-user",
        });
        console.log(result);
        await fs.unlink(req.file.path);
        userData.avatar = result.secure_url;
        userData.avatarPublicId = result.public_id;
      }

      const data = await userData.save();
      await sendEmail(req,data);
      if (data) {
        return res.status(200).json({
          success: true,
          message: "user created successfully!",
          data,
        });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  async getUsers(req, res) {
    try {
      const data = await User.find({});
      return res.status(200).json({
        success: true,
        message: "user fetched successfully!",
        count: data.length,
        data,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  async getSingle(req, res) {
    try {
      const id = req.params.id;
      const data = await User.findById(id);
      return res.status(200).json({
        success: true,
        message: "product fetched successfully!",
        count: data.length,
        data,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  async updateSingle(req, res) {
    try {
      const id = req.params.id;
      const data = await User.findByIdAndUpdate(id, req.body, { new: true });
      return res.status(200).json({
        success: true,
        message: "product field updated successfully!",
        data,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  async deleteUser(req, res) {
    try {
      const id = req.params.id;
      const isPresent = await User.findById(id);
      if (!isPresent) {
        return res.status(404).json({
          success: false,
          message: "User is not present!",
        });
      }
      if (isPresent.avatarPublicId) {
        await cloudinary.uploader.destroy(isPresent.avatarPublicId);
      }

      await User.findByIdAndDelete(id);
      return res.status(200).json({
        success: true,
        message: "user deleted successfully!",
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
}
module.exports = new UserController();
