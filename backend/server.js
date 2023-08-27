const express = require("express");
const mongoose = require("mongoose");
const colors = require("colors");
const moragan = require("morgan");
const dotenv = require("dotenv");
// const connectDB = require("./config/db");

//dotenv conig
// dotenv.config();
const port = 8001;

//rest obejct
const app = express();

//middlewares
app.use(express.json());
app.use(moragan("dev"));

//routes
app.use("/api/v1/user", require("./routes/userRoutes"));
app.use("/api/v1/admin", require("./routes/adminRoutes"));
app.use("/api/v1/doctor", require("./routes/doctorRoutes"));

//port
//listen port
uri = "mongodb+srv://nayanagarwal134:NayaNaga911@cluster0.oxfczli.mongodb.net/"
mongoose.connect(uri)
.then(()=>{
    app.listen(port,() => {
        console.log(`connected to db & listening at http://localhost:${port}`)
      })
})
.catch((error)=>{
    console.log(error)
})