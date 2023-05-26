const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        require:[true, "Please procide email"],
    },
    password:{
        type:String,
        require:[true, "Please procide password"],
    },
    firstname:{
        type:String,
    },
    lastname:{
        type:String,
    },
    image:{
        type:String,
        default: null
    },
    birthday:{
        type:String,
    },
    sex:{
        type:String,
    },
    role:{
        type:String,
    },
    token:{
        type:String,
    }
})

module.exports = mongoose.model('User',userSchema)