const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    U_Id:{
        type:mongoose.Schema.Types.ObjectId
    },
    P_Id:{
        type:mongoose.Schema.Types.ObjectId
    },
    size:{
        type:Object,
    },
    Quantity:{
        type:Number,
        default: 1
    },
    priceTotel:{
        type:Number,
    }
    // date:{
    //     type:Date,
    //     default: Date.now
    // }
})

module.exports = mongoose.model("cart",cartSchema)