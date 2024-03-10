const express = require("express");
const cookieParser = require("cookie-parser")
const app = express();
const errMiddleware = require("./middleware/error")
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload')
const dotenv = require('dotenv')
dotenv.config({path:"backend/config/config.env"})

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended:true}))
app.use(fileUpload())
const product = require("./routes/productRouter");
const user = require("./routes/userRouter");
const order =require("./routes/orderRouter")
const payment =require("./routes/paymentRouter")

app.use("/api/v1",product)
app.use("/api/v1",user)
app.use("/api/v1",order)
app.use("/api/v1",payment)



//middleware for error
app.use(errMiddleware)
module.exports = app