const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    brand:{
        type:String,
    },
    priceUnit:{
        type:Number,
    },
    size:{
        type:Array,
    },
    category:{
        type:String,
    },
    sex:{
        type:String,
    },
    image:{
        type:Array,
    },
    description:{
        type:String,
    },
    date:{
        type:Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Product',productSchema)