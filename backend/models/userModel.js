const mongoose= require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const userSchema = mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true, validate:[validator.isEmail,"Invalid email"]},
    password:{type:String,required:true,minLength:8,select:false},
    avatar:{
        public_id:{type:String,required:true},
        url:{type:String,required:true},
    },
    role:{type:String,default:"User"},
    resetPasswordToken : String,
    resetPasswordExpire: Date
});
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next()
    }
    this.password = await bcrypt.hash(this.password,10)
})
//? JWT Token
userSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    })
}
//?Password comparison
userSchema.methods.comparePassword = async function(enteredPwd){
    return await bcrypt.compare(enteredPwd,this.password)
}

//?Password reset token
userSchema.methods.getResetPasswordToken = function(){
 const resetToken = crypto.randomBytes(20).toString("hex");
 //hashing and adding to user schema
 this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
 this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
 return resetToken;
}
module.exports = mongoose.model("User",userSchema);