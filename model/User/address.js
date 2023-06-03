const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema({
    firstname:{
        type:String,
        default: null
    },
    lastname:{
        type:String,
        default: null
    },
    address:{
        type:String,
        default: null
    },
    county:{
        type:String,
        default: null
    },
    province:{
        type:String,
        default: null
    },
    zipCode:{
        type:String,
        default: null
    },
    country:{
        type:String,
        default: null
    },
    phoneNumber:{
        type:String,
        default: null,
    },
    U_Id:{
        type: mongoose.Schema.Types.ObjectId
    }
})

module.exports = mongoose.model('address',addressSchema)