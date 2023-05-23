const mongoose = require('mongoose')

const userDetailSchema = new mongoose.Schema({
    address:{
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

module.exports = mongoose.model('UserDetail',userDetailSchema)