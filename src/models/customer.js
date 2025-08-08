const mongoose = require("mongoose");
const { dbNew } = require("../config/database");
const customerSchema = new mongoose.Schema({
    'firstName': {
        type: String,
    },
    'lastName': {
        type: String,
    },
    'order': {
        type: String
    },
    Size:{
        type:Number
    },
    location:{
        type: String
    }
})

module.exports = dbNew.model("Customer", customerSchema)