
// const jwt = require("jsonwebtoken");
// const user = require("../models/user");

// const adminAuth = async(req, res, next) => {
//     try{
//         const {token} = req.cookies;
//          if(!token){
//         throw new Error("Invalid token");
//         }
//         const decoded = jwt.verify(token, "abcd");
//         const {_id} = decoded;
//         const user = await User.findById(_id);
//         if(!user){
//             throw new Error("User not found");
//         }
//         req.user = user;
//         next();
//     }catch(err){
//         res.send("Error" + err.message);
//     }
    
// }

// module.exports = {adminAuth};


const jwt = require("jsonwebtoken");
const User = require("../models/user");

const adminAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.status(401).send("Please login first");

    const decoded = jwt.verify(token, "abcd");
    const user = await User.findById(decoded._id);
    if (!user) throw new Error("User not found");

    req.user = user;
    next();
  } catch (err) {
    res.status(401).send("Error: " + err.message);
  }
};

module.exports = { adminAuth };
