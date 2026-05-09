const express=require('express')
const Router=express()

const authRoutes=require('./authRoutes')
Router.use('/api/auth',authRoutes);

const userRoutes=require('./userRoutes');
Router.use('/api/users',userRoutes);

const taskRoutes=require('./taskRoutes');
Router.use('/api/tasks',taskRoutes);

module.exports=Router