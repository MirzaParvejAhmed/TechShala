const express=require("express");
const app=express();

require("dotenv").config();

const PORT=process.env.PORT||4000
app.use(express.json());

const cookieparser=require("cookie-parser");
app.use(cookieparser());

require("./config/database").dbconnect();
require("./config/cloudinary").cloudinaryConnect();

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
})

app.get('/',(req,res)=>{
    return res.json({
        success:true,
        message:`App is running succesfully on port ${PORT}`
    })
})

const cors=require("cors")
//importing routes
const userroutes=require("./routes/user")
const profileroutes=require("./routes/profile")
const paymentroutes=require("./routes/payment")
const courseroutes=require("./routes/Course")
const contactUsRoute=require("./routes/contact")
const fileupload=require("express-fileupload");

app.use(
    cors({
        origin:"http://localhost:3000",
        credentials:true
    })
)

app.use(
    fileupload({
        useTempFiles:true,
        tempFileDir:"/tmp/",
    })
)


app.use('/api/v1/auth',userroutes);
app.use('/api/v1/profile',profileroutes);
app.use('/api/v1/payment',paymentroutes);
app.use('/api/v1/course',courseroutes);
app.use("/api/v1", contactUsRoute);










