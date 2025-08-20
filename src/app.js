


const express = require("express");
const app = express();
const cors = require("cors");
const User = require("./models/user");
const Customer = require("./models/customer");
const { connectDB } = require("./config/database");
const { validateSignup, validateEditProfileData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {adminAuth} = require("./middleWears/adminAuth");
const {authRouter} = require("./routes/auth")
const {profileRouter} = require("./routes/profile");
const {requestRouter} = require("./routes/request");
const {userRouter} = require("./routes/user");
// cors
app.use(cors({
  // origin: "http://localhost:5173",
  origin: "https://pusle-match.onrender.com",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", authRouter);
app.use("/", userRouter);



// Get user by emailId from request body
app.get("/data", async (req, res) => {
  const userEmail = req.body.emailId;
  if (!userEmail) return res.status(400).send("emailId is required in body");

  try {
    const user = await User.findOne({ emailId: userEmail });
    console.log("user =>", user);
    if (!user) return res.status(404).send("User not found");
    res.json(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get all users
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    console.log("users =>", users);
    res.json(users);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get one user by firstName from query string
app.get("/oneData", async (req, res) => {
  const firstName = req.query.firstName;
  if (!firstName) return res.status(400).send("firstName is required in query");

  try {
    const user = await User.findOne({ firstName });
    console.log("one =>", user);
    if (!user) return res.status(404).send("User not found");
    res.json(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get user by MongoDB _id from body
app.get("/mongooseId", async (req, res) => {
  const id = req.body._id;
  if (!id) return res.status(400).send("_id is required in body");

  try {
    const user = await User.findById(id);
    console.log("mongo =>", user);
    if (!user) return res.status(404).send("User not found");
    res.json(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Delete user by id from body
app.delete("/user", async (req, res) => {
  const id = req.body.id;
  if (!id) return res.status(400).send("id is required in body");

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) return res.status(404).send("User not found");
    console.log("User deleted successfully");
    res.send("User deleted successfully");
  } catch (err) {
    res.status(400).send("Wrong request: " + err.message);
  }
});

// Update user by emailId in body (expects { mail: "email", ...updates })
app.patch("/profile/edit", adminAuth,async (req, res) => {
  const { emailId, ...updates } = req.body;
  // if (!emailId) return res.status(400).send("mail is required in body");

  // try {
  //   const updatedUser = await User.findOneAndUpdate({ emailId }, updates, {
  //     new: true,
  //     runValidators: true,
  //   });

  //   if (!updatedUser) return res.status(404).send("User not found");
  //   console.log("User updated:", updatedUser);
  //   res.json(updatedUser);
  // } catch (err) {
  //   res.status(400).send("Wrong request: " + err.message);
  // }

  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfuly`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

// Signup route
// app.post("/signup", async (req, res) => {
//   try {
//     validateSignup(req);

//     const { firstName, lastName, emailId, password, age } = req.body;
//     const passHash = await bcrypt.hash(password, 10);

//     const user = new User({
//         firstName,
//         lastName,
//         emailId,
//         password: passHash,
//         age
//     });
//     console.log("Creating user:", user);

//     await user.save();

//     console.log("User signup successfully");
//     res.status(201).send("User signup successfully"+user);
//   } catch (err) {
//     res.status(400).send("Wrong request: " + err.message);
//   }
// });



// login api is here

// app.post("/login", async (req,res) => {
//     try{
//         const {emailId, password} = req.body;
//         const user = await User.findOne({emailId:emailId});
//         if(!user){
//             throw new Error("Invalid credentials");
//         }
//         const isPass = await bcrypt.compare(password, user.password);
//         if(isPass){
//           const token = await jwt.sign({_id: user._id}, "abcd");
//             console.log(token);
//             res.cookie("token", token);
//             res.send("Login successful");
            
//         }else{
//             throw new Error("Invalid credentials");
//         }
        
//     }
//     catch(err){
//             res.status(400).send("Wrong request: " + err.message);
//         }
    


// })

// app.get("/profile", adminAuth,async (req,res) => {
//   const cookies = req.cookies;
//   const {token} = cookies;
//   const decodedMsg = await jwt.verify(token, "abcd");
//   console.log("decodedMsg =>", decodedMsg);

//   const {_id} = decodedMsg;
  
//   console.log("Logged in user is: " + _id);
//   console.log("cookies =>", cookies);
//    res.send("Reading cookies");
// })

// Create a customer (hardcoded data)
app.post("/customer", async (req, res) => {
  try {
    const customer = new Customer({
      firstName: "Aman",
      lastName: "Chamar",
      order: "Rolls Royce",
      size: 56,
      location: "Uganda",
    });

    await customer.save();

    console.log("Customer created successfully");
    res.status(201).send("Customer created successfully");
  } catch (err) {
    res.status(400).send("Wrong request by customer: " + err.message);
  }
});

// Start server after DB connection
connectDB()
  .then(() => {
    console.log("Database connections established ....");
    app.listen(3000, () => {
      console.log("Server is successfully listening on port 3000...");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!", err);
  });
