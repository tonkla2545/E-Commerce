const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    U_Id:{
        type:mongoose.Schema.Types.ObjectId
    },
    P_Id:{
        type:mongoose.Schema.Types.ObjectId
    },
    A_Id:{
        type:mongoose.Schema.Types.ObjectId
    },
    CD_Id:{
        type:mongoose.Schema.Types.ObjectId
    },
    size:{
        type:Object,
    },
    Quantity:{
        type:Number
    },
    priceTotel:{
        type:Number,
    },
    status:{
        type:String,
        default:"กำลังตรวจสอบ"
    },
    date:{
        type:Date,
        default: Date.now
    }
})

module.exports = mongoose.model("order",orderSchema)