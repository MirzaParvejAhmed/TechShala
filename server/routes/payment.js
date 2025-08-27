// Import the required modules
const express = require("express")
const router = express.Router()


const {capturePayment,sendPaymentSuccessEmail,verifyPayment}=require("../controllers/Payment")
const {auth,isStudent}=require("../middlewares/authentication")



router.post('/capturePayment', auth, isStudent, capturePayment)
router.post('/verifyPayment', auth, isStudent, verifyPayment)
router.post('/sendPaymentSuccessEmail',auth,isStudent,sendPaymentSuccessEmail)
// // router.post("/verifySignature", verifySignature)

module.exports = router