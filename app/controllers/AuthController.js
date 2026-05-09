const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cloudinary = require("../config/cloudinary");
const fs = require("fs").promises;
class AuthController {
  async register(req, res) {
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

  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "all fields are needed!",
        });
      }

      const isPresent = await User.findOne({ email });
      if (!isPresent) {
        return res.status(400).json({
          success: false,
          message: "user is not registered!",
        });
      }

      const isMatch = await bcrypt.compare(password, isPresent.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "password did not match!",
        });
      }

      const token = jwt.sign(
        {
          id: isPresent._id,
          name: isPresent.name,
          email: isPresent.email,
          phone: isPresent.phone,
          role: isPresent.role,
          image: isPresent.avatar,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1d" },
      );
      return res.status(200).json({
        success: true,
        message: "token generated successfully!",
        token,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
  
  async logout(req, res) {
    try {
      return res.status(200).json({
        success: true,
        message: "logout successful!",
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
}
module.exports = new AuthController();
