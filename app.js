require('dotenv').config()
require('./config/database').connect()

const express = require('express')
const app = express()
const ejs = require('ejs')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const expressSession = require('express-session')
const cors = require('cors')
 
global.logggedIn = null


app.use(express.json())
app.use(express.urlencoded())
app.use(flash())
app.use(expressSession({
    secret: "node secret"
}))

app.use("*", (req,res,next) =>{
    logggedIn = req.session.userId
    next()
})

// app.use((req,res,next) =>{
//     res.header('Access-Control-Allow-Origin','*')
//     res.header('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept')
//     next()
// })

app.use(cors())

const userRouter = require('./router/userRouter')
const productRouter = require('./router/productRouter')
const pageRouter = require('./router/pageRouter')

app.use(userRouter)
app.use(productRouter)
app.use(pageRouter)

module.exports = app