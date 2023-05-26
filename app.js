require('dotenv').config()
require('./config/database').connect()

const express = require('express')
const app = express()
const ejs = require('ejs')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const expressSession = require('express-session')

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


const userRouter = require('./router/userRouter')
const productRouter = require('./router/productRouter')

app.use(userRouter)
app.use(productRouter)

module.exports = app