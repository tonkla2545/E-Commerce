const express = require('express')
const router = express.Router()
const expressSession = require('express-session')

const productController = require('../controller/productController')
const auth = require('../middleware/auth')

router.get('/product',productController.index)
router.post('/insertProduct',auth.vertityToken,productController.insertProduct)

module.exports = router