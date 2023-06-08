const express = require('express')
const router = express.Router()
const expressSession = require('express-session')

const pageController = require('../controller/pageController')
const auth = require('../middleware/auth')

// router.get('/',pageController.index)
router.get('/home',auth.vertityToken ,pageController.home)
router.get('/pageCart',auth.vertityToken ,pageController.pageCart)
router.get('/item',pageController.item)
router.get('/favorlite',auth.vertityToken ,pageController.favorlite)
router.get('/pageOrder',auth.vertityToken ,pageController.pageOrder)

module.exports = router
