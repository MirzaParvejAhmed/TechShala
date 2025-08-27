const User = require("../models/User");
const jwt=require("jsonwebtoken");
const mailsender=require("../utils/mailSender");
const bcrypt=require("bcryptjs");
const crypto = require("crypto")

//resetpasstoken -> seding link on email
exports.resetPasswordToken = async (req, res) => {
    try {
        //get email from req.bdoy
        const email  = req.body.email;
        //validate email
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        //check userexits or not
        const user=await User.findOne({email:email});
        if(!user){
            return res.status(400).json({ message: "Your email is not registered" });
        }
        //if user exists then generate token 
        const token=crypto.randomBytes(20).toString("hex");

        //******here token is something a unique number whioch is used to find user************************

        //particular user ka khudka token aayega or vo fir expire hojayega isliye user nodel me token aaya h
        //update user by adding token and expiration time

        const updateddetails=await User.findOneAndUpdate({email:email},
            { 
                token:token,
                resetpasswordexpires:Date.now()+5*60*1000,
            },{new:true}
        )
        //{new:true}----> upadted doc. response me return hota hai

        //create url

        const url=`https://techshala.vercel.app/update-password/${token}`//frontend link hai

        //send mail containing url
        await mailsender(email,"Password reset link",`Password reset link:${url}`);

        //return response
        res.status(200).json({ 
            success:true,
            message: "Password reset link sent to your email successfully",
        });
    
    } 
    catch (error) {
        console.log(error)
        res.status(500).json({ 
            success:false,
            message: "Password reset link is not sent",
        });

    }
}

//resetpass  or saving upadtedpass in db----> here we enter new password

exports.resetpassword=async(req,res)=>{
    try {
        //fetch data
         //******here token is something a unique number whioch is used to find user************************
        const {password,confirmpassword,token}=req.body;
        //validate
        if(password!==confirmpassword){
            return res.status(400).json({ 
                success:false,
                message: "Password and confirm password do not match"
            });
        }

        //jo token aaya h uska use krna h, 
        //use->token ka use krke user ko find krna h and upadte krna h uska password
        //get user details from token 
        const userdetails=await User.findOne({token:token});

        //if no entry->> invalid  token
        if(!userdetails){
            return res.status(400).json({
                success:false,
                message:"Invalid token"
            })
        }

        //chgeck token expire time
        if(userdetails.resetpasswordexpires < Date.now()){
            return res.status(400).json({
                success:false,
                message:"token is expired"
            })
        }
        //hash poassword 
        let hashedpassword=await bcrypt.hash(password,10);
        //update password
        await User.findOneAndUpdate({token:token},{password:hashedpassword},{new:true});
        //return res
        res.status(200).json({
            success:true,
            message:"Password reset successfully"
        })
    } 
    catch (error) {
        return res.status(400).json({
            success:false,
            message:"Error while reseting password"
        })
    }
}

