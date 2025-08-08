const mongoose = require('mongoose');
const { connectDB } = require('../config/database');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String
    },
    lastName:{
        type:String
    },
    emailId:{
        type:String
    },
    password:{
        type:String,
        required: true,
        validate(value){
            if(!((value.length <=6) && (/\d/.test(value)))){
                throw new Error("Password must be at least 6 characters long and contain a number");
            }
        }
    },
    age:{
        type:Number
    },
    
}, {
    timestamps: true
});
const User = mongoose.model("User",userSchema);
module.exports = User; 