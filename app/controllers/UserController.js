const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cloudinary = require("../config/cloudinary");
const fs = require("fs").promises;

class UserController {
  async createUser(req, res) {
    try {
      // console.log(req.body)
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
          message: "user is already registered!",
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
          folder: "auth-profile",
        });
        console.log(result);
        await fs.unlink(req.file.path);
        userData.avatar = result.secure_url;
        userData.avatarPublicId = result.public_id;
      }

      const data = await userData.save();
      return res.status(200).json({
        success: true,
        message: "user registered successfully!",
        data,
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
