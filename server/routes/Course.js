// // Import the required modules
const express = require("express")
const router = express.Router()

// // Import the Controllers

// // Course Controllers Import
const{getAllcourses,getentiredetails,createcourse,getFullCourseDetails,
    editCourse,getInstructorCourses,deleteCourse}=require("../controllers/Course")

// // Tags Controllers Import

// // Categories Controllers Import
const{createcategory,categorypagedetails,getAllcategories}=require("../controllers/Tags")

// // Sections Controllers Import
const {createsection,updatesection,deletesection}=require("../controllers/Section")

// // Sub-Sections Controllers Import
const{createsubsection,updateSubSection,deleteSubSection}=require("../controllers/Subsection")

// // Rating Controllers Import
const {createrating,getallratings,getavgRating}=require("../controllers/Rating&review")

const {
  updateCourseProgress,
  getProgressPercentage,
} = require("../controllers/Courseprogress")


// // Importing Middlewares
const{auth,isAdmin,isInstructor,isStudent}=require("../middlewares/authentication")



// // ********************************************************************************************************
// //                                      Course routes
// // ********************************************************************************************************

// // Courses can Only be Created by Instructors
router.post('/createcourse', auth, isInstructor, createcourse)

// Edit Course routes
router.post("/editCourse", auth, isInstructor, editCourse)

// //Add a Section to a Course
router.post('/addsection', auth, isInstructor, createsection)
// // Update a Section
router.post('/updatesection', auth, isInstructor, updatesection)
// // Delete a Section
router.post('/deletesection', auth, isInstructor, deletesection)
// // Edit Sub Section
router.post('/updatesubSection', auth, isInstructor, updateSubSection)

// Delete Sub Section
router.post('/deletesubSection', auth, isInstructor, deleteSubSection)
// // Add a Sub Section to a Section
router.post('/addsubsection', auth, isInstructor,createsubsection)
// // Get all Courses Under a Specific Instructor
router.get("/getinstructorcourses", auth, isInstructor, getInstructorCourses)

// // Get all Registered Courses
router.get('/getAllCourses', getAllcourses)

router.post('/getFullCourseDetails', auth, getFullCourseDetails)
// // Get Details for a Specific Courses
// //router.post("/getCourseDetails", get)

// // Get Details for a Specific Courses
router.post('/getCourseDetails',getentiredetails)

// To Update Course Progress
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress)
// // // To get Course Progress
// router.post('/getProgressPercentage', auth, isStudent, getProgressPercentage)
// // Delete a Course

router.delete("/deleteCourse", deleteCourse)

// // ********************************************************************************************************
// //                                      Category routes (Only by Admin)
// // ********************************************************************************************************
// // Category can Only be Created by Admin
// // TODO: Put IsAdmin Middleware here
router.post('/createCategory', auth, isAdmin, createcategory)
router.get('/showAllCategories', getAllcategories)
router.post('/getCategoryPageDetails', categorypagedetails)

// // ********************************************************************************************************
// //                                      Rating and Review
// // ********************************************************************************************************
router.post('/createRating', auth, isStudent, createrating)
router.get('/getAverageRating', getavgRating)
router.get('/getReviews', getallratings)

module.exports = router