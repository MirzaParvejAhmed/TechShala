const mongoose = require("mongoose")
const Section = require("../models/Section")
const SubSection = require("../models/Subsection")
const CourseProgress = require("../models/CourseProgress")
const Course = require("../models/Course")

exports.updateCourseProgress = async (req, res) => {
  const { courseid, subsectionid } = req.body
  const userid = req.user.id

  try {
    // Check if the subsection is valid
    const subsection = await SubSection.findById(subsectionid)
    if (!subsection) {
      return res.status(404).json({ error: "Invalid subsection" })
    }

    // Find the course progress document for the user and course
    let courseProgress = await CourseProgress.findOne({
      courseid: courseid,
      userid: userid,
    })

    if (!courseProgress) {
      // If course progress doesn't exist, create a new one
      return res.status(404).json({
        success: false,
        message: "Course progress does not Exist",
      })
    } 
    else {
      // If course progress exists, check if the subsection is already completed
      if (courseProgress.completedvideos.includes(subsectionid)) {
        return res.status(400).json({ error: "Subsection already completed" })
      }

      // Push the subsection into the completedVideos array
      courseProgress.completedvideos.push(subsectionid)
    }

    // Save the updated course progress
    await courseProgress.save()

    return res.status(200).json({ message: "Course progress updated" })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Internal server error" })
  }
}