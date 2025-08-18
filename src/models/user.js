// const mongoose = require('mongoose');
// const { connectDB } = require('../config/database');

// const userSchema = new mongoose.Schema({
//     firstName: {
//         type: String
//     },
//     lastName:{
//         type:String
//     },
//     emailId:{
//         type:String
//     },
//     password:{
//         type:String,
//         required: true,
//         validate(value){
//             if(!((value.length <=6) && (/\d/.test(value)))){
//                 throw new Error("Password must be at least 6 characters long and contain a number");
//             }
//         }
//     },
//     age:{
//         type:Number
//     },
    
// }, {
//     timestamps: true
// });
// const User = mongoose.model("User",userSchema);
// module.exports = User; 

const validate = require("validator")

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const bcrypt = require("bcrypt");


const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        // Password must be at least 6 characters and contain a number
        if (!(value.length >= 6 && /\d/.test(value))) {
          throw new Error(
            "Password must be at least 6 characters long and contain a number"
          );
        }

      }
      

    },
    gender: {
        type: String,
        validate(value){
          if(!["male", "female", "other"].includes(value)){
            throw new Error("Invalid gender");
          }
        }//,
        // another way to validate
        // enum: {
        //   values: ["male", "female","other"],
        //   message: `{VALUE} is not valid`
        // }
      },
    age: { type: Number },
    photoUrl: {
      type: String,
    },
    about:{
      type:String,
      max:50
      
    }
  },
  { timestamps: true }
);
userSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user._id }, "abcd", {
    expiresIn: "7d",
  });

  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );

  return isPasswordValid;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
