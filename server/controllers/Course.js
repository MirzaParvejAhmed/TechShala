const Course=require("../models/Course");
const Categories=require("../models/Tags")
const User = require("../models/User");
const Section=require("../models/Section");
const SubSection = require("../models/Subsection")
const CourseProgress = require("../models/CourseProgress")
const { convertSecondsToDuration } = require("../utils/sectoduration")
require("dotenv").config();
const {uploadimagetocloudinary}=require("../utils/imageuploader") //for uploading the thumnails of course

//create createcourse handler function
exports.createcourse=async (req,res)=>{
    try {
        //fetch data 
    
        let {coursename,coursedescription,whatyouwilllearn,price,tag: _tag,category,
            status,
            instructions: _instructions}=req.body;

            console.log("data is fetched")
        
        //get thumbnail
        const thumbnail=req.files.thumbnailImage;
       // console.log("Thumbnail--->",thumbnail)
        // Convert the tag and instructions from stringified Array to Array
        let tag, instructions;
        try {
            tag = JSON.parse(_tag);
        } catch (error) {
            console.error("Error parsing tag:", error.message);
            tag = []; // Fallback or throw error
        }
        
        try {
            instructions = JSON.parse(_instructions);
        } catch (error) {
            console.error("Error parsing instructions:", error.message);
            instructions = []; // Fallback or throw error
        }
        
        console.log("Parsed tag:", tag);
        console.log("Parsed instructions:", instructions); 
        //do validation
        if(!thumbnail||!coursedescription||!coursename||!whatyouwilllearn||!price||!tag.length||!category ||
            !instructions.length){
            return res.status(400).json({
                success:false,
                message:"Please fill all the fields"
            })
        }
        if (!status || status === undefined) {
            status = "Draft"
          }

        //check for instructor and also there is field for instructor in its model
        const userid=req.user.id;
        const instructordetails=await User.findById(userid,{
            accounttype:"Instructor"
        });
        console.log("Instructor details---->",instructordetails);

        if(!instructordetails){
            return res.status(400).json({
                success:false,
                message:"Instructor details are not found",
            })
        }

        //check given tag is valid or not
        const tagdetails=await Categories.findById(category);

        if(!tagdetails){
            return res.status(400).json({
                success:false,
                message:"Category details are not found",
            })
        }

        //upload image to clouydinary
        const thumbnailImage=await uploadimagetocloudinary(thumbnail,process.env.FOLDER_NAME)

        //create an entry for new course in db
        const newcourse= await Course.create({
            coursename,
            coursedescription,
            instructor:instructordetails._id,//here instructor is a id that's why we r fetching instructordetails
            whatyouwilllearn:whatyouwilllearn,
            price,
            tag,
            category:tagdetails._id,
            thumbnail:thumbnailImage.secure_url,
            status:status,
            instructions:instructions,

        })

        //update courselist of instrucvtor too or add it to the instructor user schema
        await User.findByIdAndUpdate({_id:instructordetails._id},
            {
                $push:{courses:newcourse._id}//instructor schema me courses array me course ki id store krli 
            },{new:true},
        );

        //update the tag schema
        const categoryDetails2 = await Categories.findByIdAndUpdate(
            { _id: category },
            {
              $push: {
                courses: newcourse._id,
              },
            },
            { new: true }
          )
        //return response
        return res.status(200).json({
            success:true,
            message:"Course created successfully",
            course:newcourse,
        });


    } 
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error while creating course",
        });
    }
}

//getallcourses handler function
exports.getAllcourses=async(req,res)=>{
    try {
        const allcourses=await Course.find({status: "Published"},
            {coursename:true,price:true,thumbnail:true,
            instructor:true,ratingandreviews:true,studentsenrolled:true
            }).populate("instructor").exec();
        
        return res.status(200).json({
            success:true,
            message:"All courses fetched successfully",
            Allcourses:allcourses,
        })
    } 
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error while fetching all courses",
        });
    }
}

//fetch course entire details handler
exports.getentiredetails=async(req,res)=>{
    try {
        //fetch course id
        const {courseid}=req.body;
        //find course detailos
        const courseDetails=await Course.findOne({_id:courseid}).populate
        (
            {
                path:"instructor",
                populate:{
                    path:"additionaldetails",
                }
            },
            
        ).populate("category")
        .populate("ratingandreviews")
        .populate({
            path:"coursecontent",
            populate:{
                path:"subsections",
                select: "-videourl",
            }
        })
        .exec();
        //validtion
        if(!courseDetails){
            return res.status(404).json({
                success:false,
                message:`course details with id ${courseid} not found`
            })
        }
        let totalDurationInSeconds = 0
       courseDetails.coursecontent.forEach((content) => {
      content.subsections.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeduration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

     const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
        //return course details
        return res.status(200).json({
            success:true,
            message:`Course details with id ${courseid} fetched successfully`,
            coursedetails:courseDetails,
            Total_Duration:totalDuration,
        })
    } 
    catch (error) {
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Error in fetching all the course details"
        })
    }
}


// Edit Course Details
exports.editCourse = async (req, res) => {
    try {
      const { courseId } = req.body
      const updates = req.body
      const course = await Course.findById(courseId)
  
      if (!course) {
        return res.status(404).json({ error: "Course not found" })
      }
  
      // If Thumbnail Image is found, update it
      if (req.files) {
        console.log("thumbnail update")
        const thumbnail = req.files.thumbnailImage
        const thumbnailImage = await uploadimagetocloudinary(
          thumbnail,
          process.env.FOLDER_NAME
        )
        course.thumbnail = thumbnailImage.secure_url
      }
  
      // Update only the fields that are present in the request body
      for (const key in updates) {
        if (updates.hasOwnProperty(key)) {
          if (key === "tag" || key === "instructions") {
            course[key] = JSON.parse(updates[key])
          } else {
            course[key] = updates[key]
          }
        }
      }
  
      await course.save()
  
      const updatedCourse = await Course.findOne({
        _id: courseId,
      })
        .populate({
          path: "instructor",
          populate: {
            path: "additionaldetails",
          },
        })
        .populate("category")
        .populate("ratingandreviews")
        .populate({
          path: "coursecontent",
          populate: {
            path: "subsections",
          },
        })
        .exec()
  
      res.json({
        success: true,
        message: "Course updated successfully",
        data: updatedCourse,
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
  }


  exports.getFullCourseDetails = async (req, res) => {
    try {
      const { courseId } = req.body
      const userId = req.user.id
      const courseDetails = await Course.findOne({
        _id: courseId,
      })
        .populate({
          path: "instructor",
          populate: {
            path: "additionaldetails",
          },
        })
        .populate("category")
        .populate("ratingandreviews")
        .populate({
          path: "coursecontent",
          populate: {
            path: "subsections",
          },
        })
        .exec()
  
      let courseProgressCount = await CourseProgress.findOne({
        courseid: courseId,
        userid: userId,
      })
  
      console.log("courseProgressCount : ", courseProgressCount)
  
      if (!courseDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find course with id: ${courseId}`,
        })
      }
  
   
  
      let totalDurationInSeconds = 0
      courseDetails.coursecontent.forEach((content) => {
        content.subsections.forEach((subSection) => {
          const timeDurationInSeconds = parseInt(subSection.timeduration)
          totalDurationInSeconds += timeDurationInSeconds
        })
      })
  
      const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
  
      return res.status(200).json({
        success: true,
        data: {
          courseDetails,
          totalDuration,
          completedvideos: courseProgressCount?.completedvideos
            ? courseProgressCount?.completedvideos
            : [],
        },
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }
 
// Get a list of Course for a given Instructor
exports.getInstructorCourses = async (req, res) => {
    try {
      // Get the instructor ID from the authenticated user or request body
      const instructorId = req.user.id
  
      // Find all courses belonging to the instructor
      const instructorCourses = await Course.find({
        instructor: instructorId,
      }).sort({ createdAt: -1 })
  
      // Return the instructor's courses
      res.status(200).json({
        success: true,
        data: instructorCourses,
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        success: false,
        message: "Failed to retrieve instructor courses",
        error: error.message,
      })
    }
  }


// Delete the Course
exports.deleteCourse = async (req, res) => {
    try {
      const { courseId } = req.body
  
      // Find the course
      const course = await Course.findById(courseId)
      if (!course) {
        return res.status(404).json({ message: "Course not found" })
      }
  
      // Unenroll students from the course
      const studentsEnrolled = course.studentsenrolled
      for (const studentId of studentsEnrolled) {
        await User.findByIdAndUpdate(studentId, {
          $pull: { courses: courseId },
        })
      }
  
      // Delete sections and sub-sections
      const courseSections = course.coursecontent
      for (const sectionId of courseSections) {
        // Delete sub-sections of the section
        const section = await Section.findById(sectionId)
        if (section) {
          const subSections = section.subsections
          for (const subSectionId of subSections) {
            await SubSection.findByIdAndDelete(subSectionId)
          }
        }
  
        // Delete the section
        await Section.findByIdAndDelete(sectionId)
      }
  
      // Delete the course
      await Course.findByIdAndDelete(courseId)
  
      return res.status(200).json({
        success: true,
        message: "Course deleted successfully",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "Error while deleting course",
        error: error.message,
      })
    }
  }





