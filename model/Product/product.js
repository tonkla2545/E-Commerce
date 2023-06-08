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
    sex:{
        type:String,
    },
    image:{
        type:Array,
    },
    date:{
        type:Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Product',productSchema)