const ratingandreview=require("../models/Ratingandreviews")
const Course=require("../models/Course");

//create rating handler
exports.createrating=async(req,res)=>{
    try {
        //get user id
        const userid=req.user.id;
        //fetch data from userbody
        const {courseid,rating,review}=req.body;
        //check if user is enrolled or not
        const isenrolled=await Course.findOne({_id:courseid,studentsenrolled:{$elemMatch:{$eq:userid}},
        });
        if(!isenrolled){
            return res.status(404).json({message:"You are not enrolled in this course"});
        }
        //check already review or not
        const isreviewed=await ratingandreview.findOne({user:userid,course:courseid});
        if(isreviewed){
            return res.status(403).json({message:"You already reviewed this course"});
        }
        //create ratingab nd review
        const newratingandreview=await ratingandreview.create({
            rating,review,course:courseid,user:userid
        })
        //attach rating with course or update cpurse 
        const updatedcoursedetails=await Course.findByIdAndUpdate(courseid,{$push:{ratingandreviews:newratingandreview._id}},{new:true});
        //return response
        res.status(200).json({
            success:true,
            message:"Rating and review created successfully",
            "rating & review": newratingandreview
        });
    } 
    catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            message:"Error while creating rating and review"
        })
    }
}

//get avg. ratingb handler

exports.getavgRating=async(req,res)=>{
    try {
        //getcourse id
        const courseid=req.body.courseid;
        //calculate avg. rating
        const avgRating=await ratingandreview.aggregate([
            {
            $match:{course:new mongoose.Types.ObejctId(courseid)}
            },
            {
                //now group nthe entries
                $group:{
                    _id:null,
                    averageRating:{$avg:"$rating"},
                }
            }
    ])
    if(avgRating.length>0){
        return res.status(200).json({
            success:true,
            message:"Average rating found",
            "avg. rating":avgRating[0].averageRating,
        })
    }
    else{
        return res.status(404).json({
            success:true,
            message:"No rating found for this course",
            Average_Rating:0
        })
    }
       
    } 
    catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

////getall rating and reviews handler

exports.getallratings=async(req,res)=>{
    try {
        const allreviews=await ratingandreview.find({})
                                              .sort({rating:"desc"})
                                              .populate({
                                                path:"user",
                                                //user me jaakr specific fields chahiye
                                                select:"firstname lastname email image",
                                              })
                                              .populate({
                                                path:"course",
                                                select:"coursename"
                                              }).exec();
        return res.status(200).json({
            success:true,
            message:"All ratings and reviews are given below",
            data:allreviews,
        })

    } 
    catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            message: "Failed to retrieve the rating and review for the course",
            message:error.message
        })
    }
}