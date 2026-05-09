const express=require('express')
const Router=express()
const AuthController=require('../controllers/AuthController');
const uploadAvatar=require('../utils/uploadImage');

Router.post("/register",uploadAvatar.single('avatar'),AuthController.register);
Router.post("/login",AuthController.login);
Router.post("/logout",AuthController.logout);

module.exports=Router