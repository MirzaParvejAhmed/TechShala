const Profile=require("../models/Profile")
const User=require("../models/User")
const CourseProgress = require("../models/CourseProgress")
const Course=require("../models/Course")
const mongoose = require("mongoose")
const {uploadimagetocloudinary}=require("../utils/imageuploader")
require("dotenv").config()

const { convertSecondsToDuration } = require("../utils/sectoduration")

//how can we schedule deeltion task,cron job

//updateprofile handler because dummy profile already passed h while signup

exports.updateprofile=async(req,res)=>{
    try {
        //get data as well as userid
        const{
            firstname,
            lastname,
            dateofbirth,
            about,
            contactnumber,
            gender
        }=req.body;

        const userid=req.user.id;
        //find profile and update
        const userdetails=await User.findById(userid)
        const profileid=userdetails.additionaldetails;
        const profiledetails=await Profile.findById(profileid);
        const user = await User.findByIdAndUpdate(userid, {
            firstname:firstname,
            lastname:lastname,
          })
          await user.save()

        //update profile
        profiledetails.gender=gender;
        profiledetails.dateofbirth=dateofbirth;
        profiledetails.about=about;
        profiledetails.contactnumber=contactnumber;
        await profiledetails.save();

        const updatedUserDetails = await User.findById(userid)
        .populate("additionaldetails")
        .exec()
        //return res
        return res.status(200).json({
            success:true,
            message:"Profile updated successfully",
            updatedUserDetails,
        })
    } 
    catch (error) {
        return res.status(500).json({
            success:false,
            message:"Error while updating profile",
            error:error.message,
        })
    }
}

//delete account

// exports.deleteaccount=async(req,res)=>{
//     try {
//         //fetch id 
//         const id=req.user.id;
        
//         //validateid
//         const userexist=await User.findById(id);
//         if(!userexist){
//             return res.status(400).json({
//                 success:false,
//                 message:"User not found"
//             })
//         }
        
//         //first delete profile(additonaldetails) of that user then delete account
//         const profileid=userexist.additionaldetails;
//         //console.log("profileid--->",profileid)
//         await Profile.findByIdAndDelete({_id:profileid});
//         //console.log("userexist courses",userexist.courses)
//         //delte user
//         for (const courseId of userexist.courses) {
//             await Course.findByIdAndUpdate(
//               courseId,
//               { $pull: { studentsenrolled: id } },
//               { new: true }
//             )
//         }
//         console.log("yaha tk 2")
//         await User.findByIdAndDelete({_id:id});
//         console.log("yaha tk 3")
//         await CourseProgress.deleteMany({ userid: id })
//         //retrun response
//        return  res.status(200).json({
//             success:true,
//             message:"Account/User deleted successfully"
//         })
        
//         //we also want tod delete from enrolled courses
        
//     } 
//     catch (error) {
//          res.status(500).json({
//             success:false,
//             message:"Error while deleting account",
//         })
//     }
// };
exports.deleteaccount = async (req, res) => {
  try {
    const id = req.user.id
    console.log(id)
    const user = await User.findById({ _id: id })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }
    // Delete Assosiated Profile with the User
    await Profile.findByIdAndDelete({
      _id: new mongoose.Types.ObjectId(user.additionaldetails),
    })
    for (const courseId of user.courses) {
      await Course.findByIdAndUpdate(
        courseId,
        { $pull: { studentsenrolled: id } },
        { new: true }
      )
    }
    // Now Delete User
    await User.findByIdAndDelete({ _id: id })
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    })
    await CourseProgress.deleteMany({ userid: id })
  } 
  catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ success: false, message: "User Cannot be deleted successfully" })
  }
}

//fetch all details of the user
exports.getuserdetails=async(req,res)=>{
    try {
        const id=req.user.id;
        const user=await User.findById({_id:id}).populate('additionaldetails').exec();
        return res.status(200).json({
            success:true,
            message:"User details fetched successfully",
            All_user:user
        })
    } 
    catch (error) {
        return res.status(500).json({
            success:false,
            message:"Error while fetching user",
            error:error.message,
        })
    }
}

exports.updateDisplayPicture = async (req, res) => {
    try {
      const displayPicture = req.files.displayPicture
      const userId = req.user.id
      const image = await uploadimagetocloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      )
      console.log(image)
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      )
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }

  exports.getEnrolledCourses = async (req, res) => {
    try {
      const userId = req.user.id
      //console.log("userid--->",userId)
      let userDetails = await User.findOne({
        _id: userId,
      })
        .populate({
          path: "courses",
          populate: {
            path: "coursecontent",
            populate: {
              path: "subsections",
            },
          },
        })
        .exec()
      userDetails = userDetails.toObject()
      //console.log("userDetails--->",userDetails)
      var SubsectionLength = 0
      for (var i = 0; i < userDetails.courses.length; i++) {
        let totalDurationInSeconds = 0
        SubsectionLength = 0
        for (var j = 0; j < userDetails.courses[i].coursecontent.length; j++) {
          totalDurationInSeconds += userDetails.courses[i].coursecontent[
            j
          ].subsections.reduce((acc, curr) => acc + parseInt(curr.timeduration), 0)
          userDetails.courses[i].totalduration = convertSecondsToDuration(
            totalDurationInSeconds
          )
          SubsectionLength +=
            userDetails.courses[i].coursecontent[j].subsections.length
        }
        let courseProgressCount = await CourseProgress.findOne({
          courseid: userDetails.courses[i]._id,
          userid: userId,
        })
        courseProgressCount = courseProgressCount?.completedvideos.length
        if (SubsectionLength === 0) {
          userDetails.courses[i].progressPercentage = 100
        } else {
          // To make it up to 2 decimal point
          const multiplier = Math.pow(10, 2)
          userDetails.courses[i].progressPercentage =
            Math.round(
              (courseProgressCount / SubsectionLength) * 100 * multiplier
            ) / multiplier
        }
      }
  
      if (!userDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find user with id: ${userDetails}`,
        })
      }
      return res.status(200).json({
        success: true,
        data: userDetails.courses,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }
  
  exports.instructorDashboard = async (req, res) => {
    try {
      //const instructor=req.user.id  
      // console.log('intructor--->',instructor)
      const courseDetails = await Course.find({ instructor: req.user.id })
      //console.log("coursedetaiuls----->",courseDetails)
      const courseData = courseDetails.map((course) => {
        const totalStudentsEnrolled = course.studentsenrolled?.length
        const totalAmountGenerated = totalStudentsEnrolled * course.price
  
        // Create a new object with the additional fields
        const courseDataWithStats = {
          _id: course._id,
          coursename: course.coursename,
          coursedescription: course.coursedescription,
          // Include other course properties as needed
          totalStudentsEnrolled,
          totalAmountGenerated,
        }
  
        return courseDataWithStats
      })
      res.status(200).json(
        { courses: courseData }
      )
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Error in  instructor dashboard!! " })
    }
  }