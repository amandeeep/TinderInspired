const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const {validateSignup} = require("../utils/validation");
const User = require("../models/user");

authRouter.post("/signup", async (req,res) => {
    try{
        const {firstName, lastName, emailId, password, age, photoUrl, gender} = req.body;
        const checkUserExist = await User.findOne({emailId});
        if(checkUserExist){
            return res.status(400).send({ error: "User already exists" });
        }validateSignup(req);
        const passHash = await bcrypt.hash(password, 10);
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passHash,
            age,
            photoUrl,
            gender
        });
        await user.save();
        const token = await user.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true
    });
       res.status(201).send({
            success: true,
            data: user
        });
    }catch(err){
         res.status(500).send({ error: "Signup failed: " + err.message });
    }
    
    
})


authRouter.post("/login", async (req,res) => {
    const {emailId, password} = req.body;
    try{
        const user = await User.findOne({emailId});
        if(!user){
            res.status(401).send("Invalid credentials");
            //throw new Error("Invalid credentials");
        }
        //const validPass = await bcrypt.compare(password, user.password);
         const validPass = await user.validatePassword(password);
        if(!validPass){
            res.status(401).send("Invalid credentials");
            //throw new Error("Invalid credentials");
        }else{
            const token = await user.getJWT();
            res.cookie("token", token, {
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000), 
                httpOnly: true 
            });
            res.send(user);
        }
    }catch(err){
        res.send("Login failed: "+ err.message);
    }
})

authRouter.get("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout Successful!!");
});

module.exports = {authRouter};