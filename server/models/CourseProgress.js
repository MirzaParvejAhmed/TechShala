const mongoose=require("mongoose");
const courseProgress= new mongoose.Schema({
    courseid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    completedvideos:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"SubSection",
    }]
});
module.exports=mongoose.model("CourseProgress",courseProgress);