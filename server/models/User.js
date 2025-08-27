const mongoose=require("mongoose");
const userschema= new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
        trim:true,
    },
    lastname:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
    },
    accounttype:{
        type:String,
        enum:["Admin","Student","Instructor"],
        required:true,
    },
    active: {
        type: Boolean,
        default: true,
    },
    approved: {
        type: Boolean,
        default: true,
    },
    additionaldetails:{    //profile section hi h ye
        type:mongoose.Schema.Types.ObjectId,
        ref:"Profile",
        required:true,
    },
    courses:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
    }],
    image:{
        type:String,//url hoga
    },
    courseprogress:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"CourseProgress",
    },
    {timestamps: true }
    ],
    token:{
        type:String,
    },
    resetpasswordexpires:{
        type:Date,
    },


});
module.exports=mongoose.model("User",userschema);