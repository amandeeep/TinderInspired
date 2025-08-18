const express = require("express");
const User = require("../models/user");
const connectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();
const {adminAuth} = require("../middleWears/adminAuth");

userRouter.get("/user/requests/received", adminAuth, async (req, res) => {
    try{
        const user = req.user;
        const requests = await connectionRequest.find({
            toUserId: user._id,
            status: "interested",


        }).populate("fromUserId", "firstName lastName photoUrl");
        // another way to make array
        // populate("fromUserId", ["firstName", "lastName"])

        res.json({
            message: "Data fetched successfully",
            data: requests
        })
    }catch(err){
        res.send("Some error arise this is catch block "+ err.message);
    }
})

userRouter.get("/user/connections", adminAuth, async (req,res) => {
    try{
        const user = req.user;
        console.log(user._id)
        const request = await connectionRequest.find({
            $or: [
                {fromUserId: user._id, status: "accepted"},
                {toUserId: user._id, status: "accepted"}
            ]
        }).populate("fromUserId", "firstName lastName photoUrl age gender about").populate("toUserId", "firstName lastName photoUrl");

        const data = request.map((row) => {
            if(row.fromUserId._id.toString() === user._id.toString()){
                return row.toUserId;
            }else{
                return row.fromUserId;
            }
        });
        console.log(data);
        res.json({data});
    }catch(err){
        res.send({message : err.message});
    }
})

userRouter.get("/feed", adminAuth, async (req, res) =>{
    try{
        const user = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit> 50 ? 50 : limit;
        const skip = (page-1)*limit;
        const request = await connectionRequest.find({
            $or:[{
                fromUserId: user._id
                 },
                 {
                toUserId: user._id
                 }
                ]
        }).select("fromUserId toUserId")
        const hideFeed = new Set();
        request.forEach((req) => {
            hideFeed.add(req.fromUserId.toString());
            hideFeed.add(req.toUserId.toString());
        })
        const data = await User.find({
            $and:[
                {_id: {$nin: Array.from(hideFeed)}},
                {_id: {$ne: user._id}}
            ]
        }).select("firstName lastName photoUrl age gender").skip(skip).limit(limit);
        res.json({
            message: "Feed fetched successfully",
            data
        });
    }catch(err){
        res.json({
            message: "Error in feed "+err.message ,
            
        })
    }
})
module.exports = {userRouter};