const Section=require("../models/Section")
const Course=require("../models/Course")
const SubSection=require("../models/Subsection")

//create section handler
exports.createsection=async(req,res)=>{
    try {
        //fetch data
        const{sectionname,courseid}=req.body
        //validate data
        if(!sectionname || !courseid){
            return res.status(400).json({
                success:false,
                message:"Please fill all fields"}
            )
        }
        //crewate section
        const newsection=await Section.create({
            sectionname,
        })
        //update course schema with section object id
        const updatedcoursedetails=await Course.findByIdAndUpdate(courseid,{$push:{coursecontent:newsection._id}}
            ,{new:true}).populate({
                path: "coursecontent",
                populate: {
                  path: "subsections",
                },
              })
              .exec();
        //return response
        return res.status(200).json({
            success:true,
            message:"Section created successfully",
            New_Section: updatedcoursedetails,
        })
    } 
    catch (error) {
        return res.status(500).json({
            success:false,
            message:"Error while creating section",
            error:error.message,
        })
    }
}

//update scetion handler
exports.updatesection=async(req,res)=>{
    try {
        //data input 
        const{sectionname,sectionid,courseid}=req.body;

        //data valiodation
        if(!sectionname || !sectionid){
            return res.status(400).json({
                success:false,
                message:"Please fill all fields"}
            )
        }
        //update data
        const updatedsection=await Section.findByIdAndUpdate(sectionid,{sectionname:sectionname},{new:true});
        const updatedcourse = await Course.findById(courseid)
        .populate({
        path: "coursecontent",
        populate: {
          path: "subsections",
        },
      })
      .exec()
        //return response]
        return res.status(200).json({
            success:true,
            message:"Section updated successfully",
            updated_Section: updatedsection,
            data: updatedcourse,
        })
    } 
    catch (error) {
        return res.status(500).json({
            success:false,
            message:"Error while updating section",
            error:error.message,
        })
    }
}


//delete section handler
exports.deletesection=async(req,res)=>{
    try {
        const { sectionid, courseid } = req.body
        await Course.findByIdAndUpdate(courseid, {
          $pull: {
            coursecontent: sectionid,
          },
        })
        const section = await Section.findById(sectionid)
        console.log(sectionid, courseid)
        if (!section) {
          return res.status(404).json({
            success: false,
            message: "Section not found",
          })
        }
        // Delete the associated subsections
        await SubSection.deleteMany({ _id: { $in: section.subsections } })
    
        await Section.findByIdAndDelete(sectionid)
    
        // find the updated course and return it
        const course = await Course.findById(courseid)
          .populate({
            path: "coursecontent",
            populate: {
              path: "subsections",
            },
          })
          .exec()
    
        res.status(200).json({
          success: true,
          message: "Section deleted",
          data: course,
        })
      } 
      catch (error) {
        console.error("Error deleting section:", error)
        res.status(500).json({
          success: false,
          message: "Internal server error",
          error: error.message,
        })
    }
}



