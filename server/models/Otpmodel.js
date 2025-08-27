const mongoose=require("mongoose");
const mailSender = require("../utils/mailSender");
const emailtemplate=require("../mail/template/Emailverification")
const otpschema= new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:
    {
        type:Date,
        deafult:Date.now(),
        expires:5*60,
    },  
});
//create function-> to send mail
async function sendVerificationEmail(email,otp) {
    try {
        const mailResponse= await mailSender(email,"Verifcation email from TechShala",emailtemplate(otp));
        console.log("Email sent Successfully: ",mailResponse.response);
    } 
    catch (error) {
        console.log("Error occured while sending email:",error);
        throw error;
    }
}
    
    otpschema.pre("save",async function (next){
        console.log("New document saved to database");
        // Only send an email when a new document is created
        if(this.isNew){
            await sendVerificationEmail(this.email,this.otp);
        }
        
        next();
    })
module.exports=mongoose.model("OTP",otpschema);