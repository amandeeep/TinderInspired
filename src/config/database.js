// // const mongoose = require("mongoose");

// // const connectDB = async () => {
// //     await mongoose.connect("mongodb+srv://akshayvideo:akshay@namaste.mgpkbbg.mongodb.net/helloworld")
// // }

// // module.exports = {connectDB};

// const mongoose = require("mongoose");

// const connectDB = async () => {
//     await mongoose.connect("mongodb+srv://akshayvideo:akshay@namaste.mgpkbbg.mongodb.net/helloworld");
//     console.log("Main DB connected: helloworld");
// };

// // Create a **separate connection** for the second DB
// const dbNew = mongoose.createConnection("mongodb+srv://akshayvideo:akshay@namaste.mgpkbbg.mongodb.net/customer");

// dbNew.on('connected', () => {
//     console.log("dbNew connected: customer");
// });

// module.exports = { connectDB, dbNew };



const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://akshayvideo:akshay@namaste.mgpkbbg.mongodb.net/helloworld"
    );
    console.log("Main DB connected: helloworld");
  } catch (error) {
    console.error("Error connecting to main DB:", error.message);
    throw error;
  }
};

// Separate connection for customer DB
const dbNew = mongoose.createConnection(
  "mongodb+srv://akshayvideo:akshay@namaste.mgpkbbg.mongodb.net/customer"
);

dbNew.on("connected", () => {
  console.log("dbNew connected: customer");
});

dbNew.on("error", (err) => {
  console.error("dbNew connection error:", err);
});

module.exports = { connectDB, dbNew };
