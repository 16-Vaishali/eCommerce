const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail =require("../utils/sendEmail");
const crypto = require("crypto")
const cloudinary = require('cloudinary')
//!Register
exports.registerUser = catchAsyncError(async(req,res,next)=>{
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
        folder:"avatars",
        width:150,
        crop:"scale"
    })
    const {name,email,password} =  req.body;
    const user = await User.create({name,email,password,
    avatar:{
        public_id:myCloud.public_id,
        url:myCloud.secure_url
    }})
    sendToken(user,201,res)
})

//!Login
exports.loginUser = catchAsyncError(async(req,res,next)=>{
    const {email,password} = req.body;
    //?check user enetered both email and password
    if(!email||!password)return next(new ErrorHandler("please enter email & password",400))
    const user = await User.findOne({email}).select("+password");
if(!user)return next(new ErrorHandler("Invalid credentials",401));
const isPassMatched = user.comparePassword(password);
if(!isPassMatched)return next(new ErrorHandler("Invalid credentials",401));
sendToken(user,200,res)
})

//!Logout
exports.logoutUser = catchAsyncError(async(req,res,next)=>{
    res.cookie("token","null",{
        expires: new Date(Date.now()),
        httpOnly:true
    })
    res.status(200).json({success:true,message:"Logout done!"})
})

//!Forgot password
exports.forgotPassword = catchAsyncError(async(req,res,next)=>{
    const user = await User.findOne({email:req.body.email});
    if(!user){
        return next(new ErrorHandler("User not found",404));
    }
    //Get resetPwd Token
  const restToken =  user.getResetPasswordToken();
  await user.save({validateBeforeSave:false})
  const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${restToken}`
  const message = `Your password reset token is : \n\n ${resetPasswordUrl} \n\n If you have not requested this email then please ignore it!`
  try {
    await sendEmail({
email:user.email,
subject: `Zebrow Password Recovery`,
message
    })
    res.status(200).json({success:true,message:`Email sent to ${user.email}`})
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({validateBeforeSave:false})
return next(new ErrorHandler(error.message,500))
  }
})

//!reset password
exports.resetPassword = catchAsyncError(async(req,res,next)=>{
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex")
const user = await User.findOne({resetPasswordToken,resetPasswordExpire: {$gt: Date.now()}})
if(!user){
    return next(new ErrorHandler("Invalid reset password token",400));
}
if(req.body.password!==req.body.confirmPassword){
    return next(new ErrorHandler("Password Mismatch",400));
}
user.password = req.body.password;
user.resetPasswordToken = undefined;
user.resetPasswordExpire = undefined;
await user.save();
sendToken(user,200,res)
})
//! Get user details
exports.getUserDetails = catchAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success:true,user
    })
})
//! Update user password
exports.updateUserPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password"); 
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Old password is incorrect", 400));
    } 
    if (req.body.newPassword !== req.body.confirmPassword) {
      return next(new ErrorHandler("password does not match", 400));
    }
     user.password = req.body.newPassword;
    await user.save();
    sendToken(user, 200, res);
  });
  

//! Update user profile
exports.updateProfile = catchAsyncError(async (req, res, next) => {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
    };
    if (req.body.avatar !== "") {
      const user = await User.findById(req.user.id);
      const imageId = user.avatar.public_id;
      await cloudinary.v2.uploader.destroy(imageId);
      const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
      });
       newUserData.avatar = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }
     const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).json({
      success: true,
    });
  });
//! Get all users (admin)
exports.getAllusers = catchAsyncError(async(req,res,next)=>{
    const users = await User.find();
    res.status(200).json({success:true,users})
})
//! Get single users (admin)
exports.getUser = catchAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler("User does not exist"))
    }
    res.status(200).json({success:true,user})
})
//! Update user role - Admin
exports.updateUserRole = catchAsyncError(async(req,res,next)=>{
    const newuserData = {
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }
    const user = await User.findByIdAndUpdate(req.params.id,newuserData,{new:true,runValidators:true,
    useFindAndModify:false})
    res.status(200).json({
        success:true,user
    })
})

//! Delete User - Admin
exports.deleteUser= catchAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.params.id);
    if(!user) return next(new ErrorHandler("User does not Exist"));
    const imageId = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(imageId);
    await user.deleteOne()
    res.status(200).json({
        success:true,user
    })
})
