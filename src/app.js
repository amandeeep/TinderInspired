const express = require("express");

const app = express();

app.use("/bello", (req, res) => {
    res.send("Hello from the server!");
})

app.use("/editor", (req,res) => {
    res.send("Amandeep singh is the editor in chief of this organization");
})

app.listen(3000, () => {
    console.log("Server is successfully listening on port 3000...");
});           