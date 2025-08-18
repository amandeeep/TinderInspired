const express = require("express");
const profileRouter = express.Router();
const {adminAuth} = require("../middleWears/adminAuth");

profileRouter.get("/profile", adminAuth, async (req, res) => {
    try{
        const user = req.user;
        res.send(user);
    }catch(err){
        res.send("Error: "+err.message);
    }
})

module.exports = {profileRouter};