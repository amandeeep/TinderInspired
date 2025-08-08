const express = require("express");
//const connectDB = require("./config/database");
//const dbNew = require("./config/database");
const app = express(); 
const User = require("./models/user");
const Customer = require("./models/customer")
const { connectDB, dbNew } = require("./config/database");

app.use(express.json());


app.get("/data", async (req,res) => {
    const userEmail = req.body.emailId;
    const userId = await User.find({emailId: userEmail});
    console.log("userId => ", userId);
    res.send("userId displayed in console");

})
app.get("/feed", async (req,res) => {
    const users = await User.find({});
    console.log("users => ", users);
    res.send(users);
})
app.get("/oneData", async (req,res) => {
    const one = await User.findOne({firstName: req.query.firstName});
    console.log("one => ", one);
    res.send(one);
})
app.get("/mongooseId", async (req,res) => {
    const mongo = await User.findById(req.body._id);
    console.log("mongo => ", mongo);
    res.send(mongo);

})
app.delete("/user", async (req,res) => {
    const id = req.body.id;
    try{
        const users = await User.findByIdAndDelete(id);
        console.log("User deleted successfully(console message)");
        res.send("User deleted successfully");
    }catch(err){
        res.status(400).send("Wrong request"+ err.message);
    }
    
})
app.patch("/user", async (req,res) => {
    const {mail, ...updates} = req.body; // when you want update mail id and access user by its mail id
    //const mail = req.body.emailId; // when you want to update user details except mail id
    const body = req.body;
    try{
        const user = await User.findOneAndUpdate({emailId: mail}, body,{ new: true });
        console.log(user);
        res.send("User updated successfully" + user);
    }catch(err){
        res.status(400).send("Wrong request"+ err.message);
    }
})

app.post("/signup", async (req,res) => {
    
//    const user = new User({
//     'firstName': "Chaman",
//     "LastName": "Singh",
//     "emailId": "amand@jam.in",
//     "password": "asldkjf",
//     "age": 24
//    })

    console.log(req.body);
    const user = new User(req.body);
    console.log("user => ", user);
   
   try{
    await user.save();
    console.log("User signup successfully(console message)");
    res.send("User signup successfully");
   }catch(err){
    res.status(400).send("Wrong request"+ err.message);
   }
})
app.post("/customer", async (req, res) => {
    const customer = new Customer({
        'firstName': "Aman",
        'lastName': "Chamar",
        'order' : "Rolls Royce",
        "Size": 56,
        "Location": "Uganda"
    })
    try{
        await customer.save();
        console.log("Customer created successfully(console message)");
        res.send("Customer created successfully");
    }catch(err){
        res.status(400).send("Wrong request by customer"+ err.message);
    }
})


connectDB()
.then(() => {
    console.log("Database connections established ....");
    app.listen(3000, () => {
    console.log("Server is successfully listening on port 3000...");
});  
})
.catch((err) => {
    console.log("Database cannot be connected!!");
})

         