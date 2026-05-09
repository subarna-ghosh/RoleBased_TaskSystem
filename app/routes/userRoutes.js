const express=require('express')
const Router=express()
const UserController=require('../controllers/UserController');
const authCheck=require('../middleware/authMiddleware');
const allowRole=require('../middleware/roleMiddleware');

Router.post('/create',authCheck,allowRole("admin"),UserController.createUser);

module.exports=Router