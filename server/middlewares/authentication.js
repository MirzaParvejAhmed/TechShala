const User = require("../models/User");
const jwt=require("jsonwebtoken");
require("dotenv").config();

//auth
 exports.auth = async (req, res, next) => {
    try {
        //extract token
        const token=req.body.token||req.cookies.token||req.header("Authorization").replace("Bearer ", "");
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token is missing"
            });
        }

        //verify token
        try {
            const decoded= await jwt.verify(token,process.env.JWT_SECRET);
            // Storing the decoded JWT payload in the request object for further use
            req.user=decoded;
            console.log("DECoded data from token------>",decoded);
        } 
        catch (err) {
            //verification issue
            return res.status(401).json({
                success:false,
                message:"Invalid token"
            })
        }
        next();
    } 
    catch (error) {
        return res.status(401).json({
            success:false,
            message:"Something went wrong while validating token"
        })
    }
}

//isStudent

exports.isStudent=async(req,res,next)=>{
    try {
        if(req.user.role !== "Student"){
            return res.status(401).json({
                success:false,
                message:"This is protected route for Students"
            })
        }
        next();
    } 
    catch (error) {
        return res.status(500).json({
            success:false,
            message:"User role cannot be determined"
        })
    }
}

//is Instructor

exports.isInstructor=async(req,res,next)=>{
    try {
        if(req.user.role !== "Instructor"){
            return res.status(401).json({
                success:false,
                message:"This is protected route for Instructor"
            })
        }
        next();
    } 
    catch (error) {
        return res.status(500).json({
            success:false,
            message:"User role cannot be determined"
        })
    }
}


//isAdmin

exports.isAdmin=async(req,res,next)=>{
    try {
        if(req.user.role !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is protected route for Admin"
            })
        }
        next();
    } 
    catch (error) {
        return res.status(500).json({
            success:false,
            message:"User role cannot be determined"
        })
    }
}