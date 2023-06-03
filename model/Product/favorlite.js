const mongoose = require('mongoose')

const favorliteSchema = new mongoose.Schema({
    U_Id:{
        type:mongoose.Schema.Types.ObjectId
    },
    P_Id:{
        type:mongoose.Schema.Types.ObjectId
    },
})

module.exports = mongoose.model("favorlite",favorliteSchema)