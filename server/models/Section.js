const mongoose=require("mongoose");
const Sectionschema= new mongoose.Schema({
    sectionname:{
        type:String,
    },
    subsections:[{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"SubSection"
    }],
    
});
module.exports=mongoose.model("Section",Sectionschema);