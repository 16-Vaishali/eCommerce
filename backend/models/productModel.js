const mongoose = require("mongoose");
const productSchema = mongoose.Schema({
    name:{type:String,required:true,trim:true},
    description:{type:String,required:true},
    price:{type:Number,required:true,maxLength:[6]},
    ratings:{type:Number,default:0},
  images:[{
    public_id:{type:String,required:true},
    url:{type:String,required:true},
}],
  category:{type:String,required:true},
  stock:{type:Number,required:true, default:1},
  numOfReviews:{type:Number,default:0},
  reviews:[
    {
      user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
      },
        name:{type:String,required:true},
        rating:{type:Number,required:true},
        comment:{type:String}
    }
  ],
  user:{
    type:mongoose.Schema.ObjectId,
    ref:"User",
    required:true
  }
})

module.exports = mongoose.model("Product",productSchema);