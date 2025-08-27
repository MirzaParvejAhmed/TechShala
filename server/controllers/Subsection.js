const Section=require("../models/Section")
const SubSection=require("../models/Subsection");
const { uploadimagetocloudinary } = require("../utils/imageuploader");
require("dotenv").config();

//subsection=== videos

//create subsection handler
exports.createsubsection=async(req,res)=>{
    try {
        //fetch data from req.body
        const {sectionid,title,description,timeduration}=req.body;
        //extract file/video
        //console.log("req.files--->",req.files);
        const video = req.files ? req.files.video : null;

        //console.log("video---->",video);

        //validation
        if(!sectionid || !title || !description||!video){
            return res.status(400).json({
                success:false,
                message:"Please fill all fields",
            })
        }
        //upload video to cloudinary then store videourl
        const uploadresult=await uploadimagetocloudinary(video,process.env.FOLDER_NAME)
        //create a subsection
        const createdsubsection=await SubSection.create({
            title:title, timeduration: `${uploadresult.duration}`,description:description,videourl:uploadresult.secure_url,
        });

        //push subsection id into section
        const updatedsection=await Section.findByIdAndUpdate({_id:sectionid},{$push:{subsections:createdsubsection._id}},{new:true}).populate("subsections").exec()
        //return respsonse
        return res.status(200).json({
            success:true,
            message:"Subsection created successfully",
            subsection:updatedsection
        })
    } 
    catch (error) {
        return res.status(500).json({
            success:false,
            message:"Error while creating subsection",
            error:error.message,
        })
    }
}

//updatesubsection handler
exports.updateSubSection = async (req, res) => {
    try {
      const { sectionid, subsectionid, title, description } = req.body
      const subSection = await SubSection.findById(subsectionid)
  
      if (!subSection) {
        return res.status(404).json({
          success: false,
          message: "SubSection not found",
        })
      }
  
      if (title !== undefined) {
        subSection.title = title
      }
  
      if (description !== undefined) {
        subSection.description = description
      }
      if (req.files && req.files.video !== undefined) {
        const video = req.files.video
        const uploadDetails = await uploadimagetocloudinary(
          video,
          process.env.FOLDER_NAME
        )
        subSection.videourl = uploadDetails.secure_url
        subSection.timeduration = `${uploadDetails.duration}`
      }
  
      await subSection.save()
  
      // find updated section and return it
      const updatedSection = await Section.findById(sectionid).populate(
        "subsections"
      )
  
      //console.log("updated section", updatedSection)
  
      return res.json({
        success: true,
        message: "Section updated successfully",
        data: updatedSection,
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the section",
      })
    }
  }


//delete subsection handler
exports.deleteSubSection = async (req, res) => {
    try {
      const { subSectionId, sectionId } = req.body
      await Section.findByIdAndUpdate(
        { _id: sectionId },
        {
          $pull: {
            subsections: subSectionId,
          },
        }
      )
      const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })
  
      if (!subSection) {
        return res
          .status(404)
          .json({ success: false, message: "SubSection not found" })
      }
  
      // find updated section and return it
      const updatedSection = await Section.findById(sectionId).populate(
        "subsections"
      )
  
      return res.json({
        success: true,
        message: "SubSection deleted successfully",
        data: updatedSection,
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "An error occurred while deleting the SubSection",
      })
    }
  }