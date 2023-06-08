const express = require('express')
const router = express.Router()
const expressSession = require('express-session')

const userController = require('../controller/userController')
const auth = require('../middleware/auth')

router.get('/',userController.index)
router.get('/logout',userController.logout)
router.post('/signup',auth.redirect ,userController.signUp)
router.post('/login',auth.redirect ,userController.logIn)
router.post('/changPass',auth.vertityToken ,userController.changPass)
router.post('/insertAddress',auth.vertityToken ,userController.insertAddress)
router.post('/editAddress/:id',auth.vertityToken ,userController.editAddress)
router.post('/insertCreditCard',auth.vertityToken,userController.insertCreditCard)
router.post('/editCreditCard',auth.vertityToken ,userController.editCreditCard)
router.post('/editProfile',auth.vertityToken ,userController.editProfile)
router.delete('/deleteAddress/:id',auth.vertityToken ,userController.deleteAddress)

module.exports = router