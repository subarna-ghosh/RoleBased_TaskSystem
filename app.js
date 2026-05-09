require('dotenv').config()
const express=require('express')
const app=express()
const db=require('./app/config/db')
db()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

const apiRoutes=require('./app/routes')
app.use(apiRoutes)

const port=3008
app.listen(port,()=>{
    console.log(`server is running on port no-->http://localhost:${port}`)
})