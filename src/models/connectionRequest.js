const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    status:{
        type:String,
        enum:{
            values: ["accepted","rejected","interested","ignored"],
            message: '{VALUE} is incorrect status'
        }
    }
},
{timestamps: true}
);

connectionRequestSchema.index({fromUserId: 1, toUserId:1});

connectionRequestSchema.pre("save", function(next){
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send connection request to yourself");
    }
    next();
})

module.exports = new mongoose.model("connectionRequest", connectionRequestSchema);
