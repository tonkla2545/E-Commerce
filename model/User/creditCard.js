const mongoose = require('mongoose')

const credirCardSchema = new mongoose.Schema({
    firstname:{
        type:String,
    },
    lastname:{
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

module.exports = mongoose.model('CredirCard',credirCardSchema)