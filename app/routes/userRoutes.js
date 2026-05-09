const express=require('express')
const Router=express()
const UserController=require('../controllers/UserController');
const authCheck=require('../middleware/authMiddleware');
const allowRole=require('../middleware/roleMiddleware');
const uploadUserImage=require('../utils/uploadImage');

Router.post('/create',authCheck,allowRole("admin"),uploadUserImage.single('avatar'),UserController.createUser);
Router.get('/find/all',authCheck,allowRole("admin"),UserController.getUsers);
Router.get('/find/single/:id',authCheck,allowRole("admin"),UserController.getSingle);
Router.patch('/find/field/:id',authCheck,allowRole("admin"),UserController.updateSingle);

module.exports=Router