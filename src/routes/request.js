const express = require("express");
const requestRouter = express.Router();
const {adminAuth} = require("../middleWears/adminAuth");
const User = require("../models/user");
const connectionRequest = require("../models/connectionRequest");
const sendMail = require("../utils/mailer");
requestRouter.post("/request/send/:status/:reqUserId", adminAuth, async(req,res) => {
    try {
        const user = req.user;
        const { status, reqUserId } = req.params;
        const fromUserId = req.user._id;
        const allowedStatus = ["interested","ignored"];
        if(!allowedStatus.includes(status)){
            return res.send("Invalid status");
        }
        
        const toUser = await User.findById(reqUserId);
        if (!toUser) {
            return res.status(404).send("Recipient user not found");
        }
        const connectionExists = await connectionRequest.findOne({
            $or: [
                // {fromUserId, reqUserId},
                // {fromUserId: reqUserId, reqUserId: fromUserId}
                { fromUserId, toUserId: reqUserId },
                { fromUserId: reqUserId, toUserId: fromUserId }
            ],
            

        })
        if(connectionExists){
                return res.send({message: "Connection request already exists"});
            }

        const newRequest = new connectionRequest({
            fromUserId,
            toUserId : reqUserId,
            status
        })
        const data = await newRequest.save();


        // send email 

        if (status === "interested" && toUser.emailId) {
            console.log(toUser.emailId)
            const htmlContent = `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Hello ${toUser.firstName},</h2>
                    <p><b>${user.firstName}</b> has shown interest in connecting with you!</p>
                    <p style="margin-top:20px;">
                        👉 <a href="https://pusle-match.onrender.com/requests" style="color:blue;">View Request</a>
                    </p>
                    <br>
                    <p>Best regards,<br/>TechConnect Team</p>
                </div>
            `;

            await sendMail(
                toUser.emailId,
                "🔔 New Connection Interest",
                htmlContent
            );
        }

        res.json({
            message: `${req.user.firstName} is ${status} in ${toUser.firstName}`,
            data,
        })
    }catch(err){
        res.send("error in connection request" + err.message);
    }
    
})

requestRouter.post("/request/received/:status/:reqUserId", adminAuth, async (req, res) => {
    try{
        const user = req.user;
        const {status, reqUserId} = req.params;
        const validStatus = ["accepted", "rejected"];
        if(!validStatus.includes(status)){
            return res.json({message:"Invalid status "});
        }
        const check = await connectionRequest.findOne({
            fromUserId : reqUserId,
            toUserId: user._id,
            status: "interested"
            
        })
        if(!check){
            return res.json({message:"No connection request found from this user"});
        }
        // else{
        //     res.send("Work completed")
        // }
        // const newReq = new connectionRequest({
        //     reqUserId,
        //     status: "accepted"
        // })
        // newReq.save();
        check.status = status;
        const data = await check.save();
        return res.json({
      message: `Connection request ${status} successfully`,
      data,
    });
    }
    catch(err){
        res.json({message:"Error in receiving connection request "+err.message});
    }
})

module.exports = {requestRouter};