const mongoose=require("mongoose");
const courseschema= new mongoose.Schema({
    coursename:{
        type:String,
        required:true,
    },
    coursedescription:{
        type:String,
        required:true,
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    whatyouwilllearn:{
        type:String,
    },
    coursecontent:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Section",
    }],
    ratingandreviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Rating&Reviews",
    }],
    price:{
        type:Number,
    },
    thumbnail:{
        type:String,
    },
    tag: {
        type: [String],
        required: true,
     },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
    },
    studentsenrolled:[{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",

    }],
    instructions:{
        type:[String],    
    },
    status:{
        type:String,
        enum:["Draft","Published"]
    },
    createdAt: { type: Date, default: Date.now() },


});
module.exports=mongoose.model("Course",courseschema);