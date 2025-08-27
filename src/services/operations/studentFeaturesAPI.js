//payemnt handle krrha h

import toast from "react-hot-toast";
import { studentEndpoints } from "../api";
import { apiConnector } from "../apiconnector";
import rzpLogo from "../../assets/Logo/rzp_logo.png"
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartslice";
//import { sendPaymentSuccessEmail, verifyPayment } from "../../../server/controllers/Payment";

//1-->load script
//2-->create options for opening modal

const {COURSE_PAYMENT_API,COURSE_VERIFY_API,SEND_PAYMENT_SUCCESS_EMAIL_API}=studentEndpoints;

function loadScript(src){
    return new Promise((resolve)=>{
        const script=document.createElement("script");
        script.src=src;

        script.onload=()=>{
            resolve(true);
        }
        script.onerror=()=>{
            resolve(false);
        }
        document.body.appendChild(script);
    })
}



export async function BuyCourse(token,courses,userdetails,navigate,dispatch){

    const toastId=toast.loading("Loading...")
    try {
        //load script
        const res=await loadScript("https://checkout.razorpay.com/v1/checkout.js")
        if(!res){
            toast.error("Razorpay SDK failed to load")
            return
        }
        //initiate the order in backend
        const orderResponse=await apiConnector("POST",COURSE_PAYMENT_API,
            {courses},
        {
            Authorization: `Bearer ${token}`,
        })
        //console.log("Order response",orderResponse)
        if(!orderResponse.data.success){
            throw new Error(orderResponse.data.message);
        }
        console.log("PAYMENT RESPONSE FROM BACKEND............", orderResponse.data)
       // console.log("Order response-->",orderResponse)
        //create options 
        console.log("key--->",process.env.REACT_APP_RAZORPAY_KEY)
        const options={
            key:process.env.REACT_APP_RAZORPAY_KEY|| process.env.REACT_APP_RAZORPAY_KEY,
            currency:orderResponse.data.paymentresponse.currency,
            amount:`${orderResponse.data.paymentresponse.amount}`,
            order_id:orderResponse.data.paymentresponse.id,
            name:"TechShala",
            description:"Thankyou for Purchasing the course!!",
            image:"https://res.cloudinary.com/dazj8oisj/image/upload/v1738360793/abhi_logo_1_yhursc.png" ,
            prefill:{
                name:`${userdetails.firstname} ${userdetails.lastname}`,
                email:userdetails.email,
            },
            handler:function(response){
                //send successful payment email
                sendPaymentSuccessEmail(response,orderResponse.data.paymentresponse.amount,token);

                //verify payment
                verifyPayment({...response,courses},token,navigate,dispatch)
            }
        }

        const paymentObject=new window.Razorpay(options);
        paymentObject.open();
        paymentObject.on("Payment failed",function(response){
            toast.error("oops! Payment failed")
            console.log(response.error)
        })
    } 
    catch (error) {
        console.log("PAYMENT API ERROR.....",error);
        toast.error("Payment failed")
    }
    toast.dismiss(toastId)
}

async function sendPaymentSuccessEmail(response,amount,token){
    try {
        await apiConnector("POST",SEND_PAYMENT_SUCCESS_EMAIL_API,{
            orderId:response.razorpay_order_id,
            paymentId:response.razorpay_payment_id,
            amount:amount,
        },{
            Authorization: `Bearer ${token}`,
        })
    } 
    catch (error) {
        console.log("PAYMENT SUCCESS EMAIL API ERROR......",error)
    }
} 


async function verifyPayment(bodyData,token, navigate,dispatch){
    const toastId=toast.loading("Verifying Payment...")
    dispatch(setPaymentLoading(true));
    try {
        const response=await apiConnector("POST",COURSE_VERIFY_API,bodyData,{
            Authorization: `Bearer ${token}`,
        })
        console.log("VERIFY PAYMENT RESPONSE FROM BACKEND............", response)

        if(!response.data.success){
            throw new Error(response.data.message)
        }
        toast.success("Payment successfull , you are added to the course")
        navigate("/dashboard/enrolled-courses")
        dispatch(resetCart());
    } 
    catch (error) {
        console.log("PAYMENT VERIFY API ERROR......",error)
        toast.error("Could not verify payment")
    }
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));
}
