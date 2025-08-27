const User=require("../models/User")
const OTP = require("../models/Otpmodel");
const Profile = require("../models/Profile");
const otpgenerator = require("otp-generator");
const mailsender=require("../utils/mailSender")
const jwt=require("jsonwebtoken");
const bcrypt=require("bcryptjs");
const {passwordUpdated}=require("../mail/template/passwordupdate")
require("dotenv").config();

//sendotp
exports.sendotp = async (req, res) => {
    try {
        //fetch email from req.bdoy
        const { email } = req.body;
        //check if user already exist or not
        const useralreadyexist =await  User.findOne({ email });
        if (useralreadyexist) {
            return res.status(401).json({
                success: false,
                message: "User already registered,please login.."
            })
        }
        //generate otp
        var otp = otpgenerator.generate(6, {
            //here 6 is the length of the otp
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        console.log("otp------>", otp);

        //check for otp if it is unique or not

        const  result = await OTP.findOne({ otp: otp });
        while (result) {
            otp = otpgenerator.generate(6, {
              upperCaseAlphabets: false,
            })
        }
        //now the unique otp is generated , now create its object so that to savew it in db
        const otppayload = { email, otp };

        //create an entry in db
        const otpbody = await OTP.create(otppayload);

        console.log("otp body---->", otpbody);

        res.status(200).json({
            success: true,
            message: "OTP sent successfully!!",
            otp:otp,
        })

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error while sending otp"
        })
    }
}

//signup
exports.signup = async (req, res) => {
    try {
        //fetch data from req.body
        const {
            firstname,
            lastname,
            email,
            password,
            confirmpassword,
            accounttype,
            additionaldetails,
            contactnumber,
            otp
        } = req.body;
        //validate kro
        if (!firstname || !lastname || !email || !password || !confirmpassword || !otp) {
            return res.status(403).json({
                success: false,
                message: "All fields are mandatory"
            })
        }
        //2 password match krlo
        if (password != confirmpassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords are mismatched,please try again.."
            });
        }
        //check if user alaraedyu exsit or noit
        const userexist = await User.findOne({ email });
        if (userexist){
            return res.status(400).json({
                success: false,
                message: "User is already registered,please login"
            })
        }
           
        //find most recent otp
        const recentotp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        console.log("recent otp----->",recentotp);

        //validate recent otp
        if (recentotp.length == 0) {
            return res.status(400).json({
                success: false,
                message: "otp is not valid"
            });
        } 
        else if (otp !== recentotp[0].otp) {
            //invalid otp
            return res.status(400).json({
                success: false,
                message: "otp is not valid"
            });
        }
        //hash password 
        let hashpassword;
        hashpassword = await bcrypt.hash(password, 10);

         // Create the user
        let approved = ""
        approved === "Instructor" ? (approved = false) : (approved = true)

        //craete profile fro additonal details
        const profiledetails = await Profile.create({
            gender: null,
            dateofbirth: null,
            about: null,
            contactnumber: null,
        })

        ////create entry in db
        console.log(firstname,lastname);

        const user = await User.create({
            firstname,
            lastname,
            email,
            password:hashpassword,
            accounttype:accounttype,
            approved:approved,
            additionaldetails:profiledetails._id,
            contactnumber,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstname}${lastname}`,
            //this api create a profile pic based on lastname and firstname
        })
        console.log("userdetails---->",user)

        //return response
        return res.status(200).json({
            success: true,
            message: "User is registered successfully",
            user:user.populate("additionaldetails")
        })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "User is not registered!! Please signup first",
        });
    }
}

//login

exports.login=async(req,res)=>{
    try {
        //fetch data from req.body
        const {email,password}=req.body;
        //validate data
        if(!email || !password){
            return res.status(403).json({
                success: false,
                message: "Please enter all fields"
            })
        }
        //check useer exist or not
        let userexist=await User.findOne({email}).populate("additionaldetails");
        if(!userexist){
            return res.status(401).json({
                success: false,
                message: "User is not exist!!"
            })
        }
        //first match password nd after that generate jwt token
        const payload={
            email:userexist.email,
            id:userexist._id,
            role:userexist.accounttype,
        }
        if(await bcrypt.compare(password,userexist.password)){

            const token=jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:Date.now()+3*24*60*60*1000});

            userexist=userexist.toObject();
            userexist.token=token;
            userexist.password=undefined;

            //create cookie and send respond
            const options={
                httpOnly:true,
                expires:new Date(Date.now()+3*24*60*60*1000),
            }
            res.cookie("token",token,options).status(200).json({
                success: true,
                message: "User is logged in successfully",
                token:token,
                user:userexist,
    
            })

        }
        else{
            return res.status(401).json({
                success: false,
                message: "Invalid password!!"
            })
        }
        

    } 
    catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Login Failure!! Try again"
        })
    }
}

//changepassword
    //fetch data from req.bosy
    //get oldpwd,newpwd,confirmnewpwd
    //validations 
    //update pwd in DB
    //send mail-password updated successfully
    //return response
    // Controller for Changing Password
exports.changePassword = async (req, res) => {
    try {
      // Get user data from req.user
      const userDetails = await User.findById(req.user.id)
  
      // Get old password, new password, and confirm new password from req.body
      const { oldPassword, newPassword } = req.body
  
      // Validate old password
      const isPasswordMatch = await bcrypt.compare(
        oldPassword,
        userDetails.password
      )
      if (!isPasswordMatch) {
        // If old password does not match, return a 401 (Unauthorized) error
        return res
          .status(401)
          .json({ success: false, message: "The password is incorrect" })
      }
  
      // Update password
      const encryptedPassword = await bcrypt.hash(newPassword, 10)
      const updatedUserDetails = await User.findByIdAndUpdate(
        req.user.id,
        { password: encryptedPassword },
        { new: true }
      )
  
      // Send notification email
      try {
        const emailResponse = await mailsender(
          updatedUserDetails.email,
          "Password for your account has been updated",
          passwordUpdated(
            updatedUserDetails.email,
            `Password updated successfully for ${updatedUserDetails.firstname} ${updatedUserDetails.lastname}`
          )
        )
        console.log("Email sent successfully:", emailResponse.response)
      } 
      catch (error) {
        // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
        console.error("Error occurred while sending email:", error)
        return res.status(500).json({
          success: false,
          message: "Error occurred while sending email",
          error: error.message,
        })
      }
  
      // Return success response
      return res
        .status(200)
        .json({ success: true, message: "Password updated successfully" })
    } 
    catch (error) {
      // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
      console.error("Error occurred while updating password:", error)
      return res.status(500).json({
        success: false,
        message: "Error occurred while updating password",
        error: error.message,
      })
    }
}

