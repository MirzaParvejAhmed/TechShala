const mongoose=require("mongoose")

require("dotenv").config();

exports.dbconnect=()=>{
    mongoose.connect(process.env.DATABASE_URL,{
        // useNewUrlParser:true,
        // useUnifiedTopology:true, 
    }).then(()=>console.log("Database connected successfully.."))
    .catch((error)=>{
        console.log("Database connection Failed..");
        console.error(error.message );
        process.exit(1);
    });
}