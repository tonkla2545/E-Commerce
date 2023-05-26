const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    price:{
        type:Number,
    },
    size:{
        type:Object ,
    },
    category:{
        type:String,
    },
    sex:{
        type:String,
    },
    image:{
        type:String,
    },
    description:{
        type:String,
    },
})

module.exports = mongoose.model('Product',productSchema)