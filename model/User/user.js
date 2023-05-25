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
    role:{
        type:String,
    },
    // UD_Id:{
    //     type: mongoose.Schema.Types.ObjectId
    // },
    token:{
        type:String,
    }
})

module.exports = mongoose.model('User',userSchema)