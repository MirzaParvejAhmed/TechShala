const express = require("express")
const router = express.Router()

const {auth,isInstructor}=require("../middlewares/authentication")

const {updateprofile,deleteaccount,getuserdetails,getEnrolledCourses,updateDisplayPicture,instructorDashboard}
=require("../controllers/Profile")

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************
//Delete User Account
router.delete('/deleteProfile',auth,deleteaccount)
router.put('/updateProfile',auth,updateprofile)
router.get('/getUserDetails',auth,getuserdetails)

//Get Enrolled Courses
router.get("/getEnrolledCourses", auth, getEnrolledCourses)
router.put("/updateDisplayPicture", auth, updateDisplayPicture)
router.get("/instructorDashboard", auth, isInstructor, instructorDashboard)

module.exports = router