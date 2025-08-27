const { instance } = require("../config/razorpay");
const User = require("../models/User");
const Course = require("../models/Course");
const crypto = require("crypto")
const mailsender = require("../utils/mailSender");
const mongoose = require("mongoose");
const { courseEnrollmentemail } = require("../mail/template/courseenrollementemail")
const { paymentSuccessEmail } = require("../mail/template/paymentsuccessfull")
const CourseProgress = require("../models/CourseProgress")
require("dotenv").config();

//capture thr payment and initiate the order
exports.capturePayment = async (req, res) => {
    //for multiple courses
    const { courses } = req.body
    const userId = req.user.id
    //console.log("courses--->",{courses});
    //console.log("userid--->",userId)
    if (courses.length === 0) {
        return res.json({ success: false, message: "Please Provide Course ID" })
    }

    let total_amount = 0

    for (const course_id of courses) {
        let course
        try {
            // Find the course by its ID
            course = await Course.findById(course_id)
            //console.log("course---->",course)
            // If the course is not found, return an error
            if (!course) {
                return res
                    .status(200)
                    .json({ success: false, message: "Could not find the Course" })
            }

            // Check if the user is already enrolled in the course
            const uid = new mongoose.Types.ObjectId(userId)
            
            if (course.studentsenrolled.includes(uid)) {
                return res.status(200).json({
                    success: false,
                    message: "Student is already Enrolled"
                })
            }

            // Add the price of the course to the total amount
            total_amount += course.price
            //console.log("total amount--->",total_amount);
        }
        catch (error) {
            console.log(error)
            return res.status(500).json({ success: false, message: error.message })
        }
    }
    //create order 
    // const amount = Course.price;
    // const currency = "INR";
    // const receipt = `${courseid}_${userid}`;
    // const options = {
    //     amount: amount * 100,
    //     currency,
    //     receipt: receipt,//receipt:Math.random(Date.now()).toString();
    //     notes: {
    //         courseid: courseid,
    //         userid: userid,
    //     }
    const options = {
        amount: total_amount * 100,
        currency: "INR",
        receipt: Math.random(Date.now()).toString(),
    }


    try {
        
        //initiate the payment using razorpay
        const paymentresponse = await instance.orders.create(options)
        console.log("payment details--->", paymentresponse)
        // return response
        res.status(200).json({
            success: true,
            message: "Payment is captured successfully",
            paymentresponse
            // courseName: course.coursename,
            // courseDescription: course.coursedescription,
            // thumbnail: course.thumbnail,
            // orderId: paymentresponse.id,
            // currency: paymentresponse.currency,
            // amount: paymentresponse.amount,
        })
    }
    catch (error) {
        console.log(error);
         res.status(500).json({
            success: false,
            message: "couldnot initiate the order!!"
        })
    }
}

//verify signature of Razorpay and server
//---------------------this is for single course-------------------------------------
// exports.verifysignature = async (req, res) => {
//     const webhookSecret = "1234567"//server secret h or apna secret h
//     const razorpaySignature = req.headers["x-razorpay-signature"];//razorpay ne x-razorpay-signature is key me signature pass kiya higa
//     //razorpaySignature is in encreypted form 
//     //first encrypt the webhooksecret then compare it with razorpaySignature
//     //step A
//     const shasum = crypto.createHmac("sha256", webhookSecret);
//     //Step B:convert hmac object into string
//     shasum.update(JSON.stringify(req.body));
//     //step C
//     const expectedSignature = shasum.digest("hex");

//     if (razorpaySignature === expectedSignature) {
//         console.log("Payment is Authorized");

//         //bnow courseid and userid will be fetched from notes
//         const { courseid, userid } = req.body.payload.payment.entity.notes;
//         try {
//             //do action
//             //find the course and enroll student in it
//             const enrolledcourse = await Course.findOneAndUpdate({ _id: courseid },
//                 { $push: { studentsenrolled: userid } }, { new: true },
//             );
//             if (!enrolledcourse) {
//                 return res.status(404).json({
//                     success: false,
//                     message: "Course not found!!"
//                 })
//             }
//             console.log("student Enrolled in course", enrolledcourse);

//             //find the user and update the course list of it
//             const enrolledstudent = await User.findOneAndUpdate({ _id: userid },
//                 { $push: { courses: courseid } }, { new: true },
//             );
//             console.log("courses array is updated", enrolledstudent);
//             //sent mail for successfull enrollment
//             const emailresponse = await mailsender(enrolledstudent.email, "Congratulations from Techsala",
//                 "Congratulations,You are enrolled into Course successfully",);
//             console.log("Email response---->", emailresponse);
//             return res.status(200).json({
//                 success: true,
//                 message: "Signature verified and Course added!!"
//             })
//         }
//         catch (error) {
//             console.log(error);
//             return res.status(500).json({
//                 success: false,
//                 message: "Error while verifying signature!!"
//             })
//         }

//     }
//     else {
//         return res.status(400).json({
//             success: false,
//             message: "Signature verification failed!!"
//         })
//     }

// }




// verify the payment
exports.verifyPayment = async (req, res) => {
    const razorpay_order_id = req.body?.razorpay_order_id
    const razorpay_payment_id = req.body?.razorpay_payment_id
    const razorpay_signature = req.body?.razorpay_signature
    const courses = req.body?.courses

    const userId = req.user.id

    if (
        !razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature ||
        !courses ||
        !userId
    ) {
        return res.status(200).json({ success: false, message: "Payment Failed.Something is missing" })
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest("hex")

    if (expectedSignature === razorpay_signature) {
        //enroll krvao student ko
       try {
        await enrollStudents(courses, userId, res)
        return res.status(200).json({ success: true, message: "Payment Verified" })
       } 
       catch (error) {
        return res.status(400).json({ success: false, message: error.message });
       }
    }

    return res.status(200).json({ success: false, message: "Payment Failed" })
}



exports.sendPaymentSuccessEmail = async (req, res) => {
    const { orderId, paymentId, amount } = req.body

    const userId = req.user.id

    if (!orderId || !paymentId || !amount || !userId) {
        return res
            .status(400)
            .json({ success: false, message: "Please provide all the details" })
    }

    try {
        const enrolledStudent = await User.findById(userId)

        console.log("enrolled student---->",enrolledStudent)

        await mailsender(
            enrolledStudent.email,
            `Payment Received`,
            paymentSuccessEmail(
                `${enrolledStudent.firstname} ${enrolledStudent.lastname}`,
                amount / 100,
                orderId,
                paymentId
            )
        )
    }
    catch (error) {
        console.log("error in sending mail", error)
        return res
            .status(400)
            .json({ success: false, message: "Could not send email" })
    }
}

// enroll the student in the courses
const enrollStudents = async (courses, userid, res) => {
    if (!courses || !userid) {
        return res
            .status(400)
            .json({ success: false, message: "Please Provide Course ID and User ID" })
    }

    for (const courseid of courses) {
        try {
            // Find the course and enroll the student in it
            const enrolledCourse = await Course.findOneAndUpdate(
                { _id: courseid },
                { $push: { studentsenrolled: userid } },
                { new: true }
            )

            if (!enrolledCourse) {
                return res
                    .status(500)
                    .json({ success: false, error: "Course not found" })
            }
            console.log("Updated course: ", enrolledCourse)

            const courseProgress = await CourseProgress.create({
                courseid: courseid,
                userid: userid,
                completedvideos: [],
            })
            //Find the student and add the course to their list of enrolled courses
            const enrolledStudent = await User.findByIdAndUpdate(
                userid,
                {
                    $push: {
                        courses: courseid,
                        courseprogress: courseProgress._id,
                    },
                },
                { new: true }
            )

            console.log("Enrolled student: ", enrolledStudent)
            // Send an email notification to the enrolled student
            const emailResponse = await mailsender(
                enrolledStudent.email,
                `Successfully Enrolled into ${enrolledCourse.coursename}`,
                courseEnrollmentemail(
                    enrolledCourse.coursename,
                    `${enrolledStudent.firstname} ${enrolledStudent.lastname}`
                )
            )

            console.log("Email sent successfully: ", emailResponse.response)
        } catch (error) {
            console.log(error)
            return res.status(400).json({ success: false, error: error.message })
        }
    }
}

