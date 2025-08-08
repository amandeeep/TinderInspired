const adminAuth = (req, res, next) => {
    const token = "xyz";
    const isAdmin = "d"; // This should be replaced with actual logic to check if the user is an admin
    if(token == isAdmin){
        console.log("Admin access granted");
        next();
    }
    else{
        res.status(401).send("Unauthorized access");
    }

}

const userAuth = (req,res,next) => {
    const userToken = "abdc";
    const tokenAuth = "abc";
    if(userToken == tokenAuth){
        console.log("user access granted");
        next();
    }
    else{
        res.status(202).send("Unauthorized user ")
    }
}

module.exports = {adminAuth, userAuth};