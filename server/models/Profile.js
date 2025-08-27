const mongoose=require("mongoose");

const profileschema= new mongoose.Schema({
    gender:{
        type:String,
    },
    dateofbirth:{
        type:String,
    },
    about:{
        type:String,
        trim:true,
    },
    contactnumber:{
        type:Number,
        trim:true,
    }
});
module.exports=mongoose.model("Profile",profileschema);