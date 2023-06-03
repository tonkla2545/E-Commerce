const mongoose = require('mongoose')

const creditCardSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    cardNumber:{
        type:Number,
    },
    expDate:{
        type:String,
    },
    CVV:{
        type:String,
    },
    U_Id:{
        type:mongoose.Schema.Types.ObjectId
    }
})

module.exports = mongoose.model('CreditCard',creditCardSchema)