// const mongoose = require("mongoose");
// const { dbNew } = require("../config/database");
// const customerSchema = new mongoose.Schema({
//     'firstName': {
//         type: String,
//     },
//     'lastName': {
//         type: String,
//     },
//     'order': {
//         type: String
//     },
//     Size:{
//         type:Number
//     },
//     location:{
//         type: String
//     }
// })

// module.exports = dbNew.model("Customer", customerSchema)





const mongoose = require("mongoose");
const { dbNew } = require("../config/database");

const customerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  order: { type: String, required: true },
  size: { type: Number },
  location: { type: String },
},{timestamps: true});

const Customer = dbNew.model("Customer", customerSchema);

module.exports = Customer;
