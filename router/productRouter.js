const express = require('express')
const router = express.Router()
const expressSession = require('express-session')

const productController = require('../controller/productController')
const auth = require('../middleware/auth')

// router.get('/product',productController.index)
router.post('/insertProduct',auth.vertityToken ,auth.admin ,productController.insertProduct)
router.post('/addInCart/:id',auth.vertityToken ,productController.addInCart)
router.delete('/deleteCart/:id',auth.vertityToken, productController.deleteCart)
router.post('/checkOut/:id',auth.vertityToken ,productController.checkOut)
router.post('/cancelOrder',auth.vertityToken ,productController.cancelOrder)
router.post('/addFavorlite',auth.vertityToken ,productController.addFavorlite)
router.post('/deleteFavorlite',auth.vertityToken ,productController.deleteFavorlite)

module.exports = router