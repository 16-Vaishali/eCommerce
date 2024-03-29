const ErrorHandler = require("../utils/errorhandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";
  //Wrong mongodb error
  if(err.name ==="CastError"){
    const message = `resource not found, Invalid: ${err.path}`;
    err = new ErrorHandler(message,400);
  }
  //Mongoose duplicate key error
  if(err.code === 11000){
    const message = `Duplicate ${Object.keys(err.keyValue)} not allowed`
    err = new ErrorHandler(message,400);
  }
  //Wrong JWT error
  if(err.name === "JsonwebTokenError" ){
    const message = "JsonWebToken is Invalid try again"
    err = new ErrorHandler(message,400);
  }
  //JWT expire error
  if(err.name === "TokenExpiredError" ){
    const message = "JsonWebToken is expired try again"
    err = new ErrorHandler(message,400);
  }
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};