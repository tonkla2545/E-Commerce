const express = require('express')
const router = express.Router()
const expressSession = require('express-session')

const userController = require('../controller/userController')
const auth = require('../middleware/auth')

router.get('/index',auth.vertityToken ,userController.index)
router.get('/logout',userController.logout)
router.post('/signup',userController.signUp)
router.post('/login',userController.logIn)
router.post('/editProfile',userController.editProfile)

module.exports = router