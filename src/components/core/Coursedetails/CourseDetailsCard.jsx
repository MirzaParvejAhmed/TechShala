import copy from 'copy-to-clipboard'
import React from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { BsFillCaretRightFill } from "react-icons/bs"
import { FaShareSquare } from "react-icons/fa"
import { ACCOUNT_TYPE } from '../../../utils/constants'
import { addToCart } from '../../../slices/cartslice'

const CourseDetailsCard = ({course,setConfirmationModal,handleBuyCourse}) => {
    const {user}=useSelector((state)=>state.profile)
    const {token}=useSelector((state)=>state.auth)
    const dispatch=useDispatch()
    const navigate=useNavigate()

    const {
        thumbnail:ThumbnailImage,
        price:CurrentPrice,
        _id: courseId,
    }=course

    const handleAddtocart=()=>{
        if(user&&user.accounttype===ACCOUNT_TYPE.INSTRUCTOR){
            toast.error("You are Instructor,you can't Buy the Course  ")
            return;
        }
        if(token){
            dispatch(addToCart(course));
            return;
        }
        setConfirmationModal({
            text1: "You are not Logged in!!",
            text2: "Please Login to Add to cart",
            btn1Text: "Login",
            btn2Text: "Cancel",
            btn1Handler: () => navigate("/login"),
            btn2Handler: () => setConfirmationModal(null),
        });
    }

    const handleShare=()=>{
        copy(window.location.href);
        toast.success("Link Copied to Clipboard!!")
    }

  return (
    <>
    <div className={`flex flex-col gap-4 rounded-md bg-richblack-700 p-4 text-richblack-5`}>
         {/* Course Image */}
      <img src={ThumbnailImage}
       alt={course?.coursename}
       className="max-h-[300px] min-h-[180px] w-[400px] overflow-hidden rounded-2xl object-cover md:max-w-full"/>

        <div className="px-4">
       <div className="space-x-3 pb-4 text-3xl font-semibold">
        Rs. {CurrentPrice}
       </div>
       <div className="flex flex-col gap-4">
        <button className="yellowButton"
        onClick={
            user&&course?.studentsenrolled.includes(user?._id)?
            ()=>navigate("/dashboard/enrolled-courses"):()=>handleBuyCourse()
        }
        >
            {
                user&&course?.studentsenrolled.includes(user?._id)?"Go to Course":"Buy Now"
            }
        </button>

        {
            (!user ||!course?.studentsenrolled?.includes(user?._id))&&(
                <button onClick={()=>handleAddtocart()} className="blackButton">
                    Add to Cart
                </button>
            )
        }
       </div>
       <div>
        <p className="pb-3 pt-6 text-center text-sm text-richblack-25">
            30-Days Money-Back Guarantee!! 
        </p>
        </div>
        <div className={``}>
        <p className={`my-2 text-xl font-semibold `}>
            This Course Includes:
        </p>
        <div className="flex flex-col gap-3 text-sm text-caribbeangreen-100">
            {
                course?.instructions?.map((item,index)=>{
                    return (
                        <p className={`flex gap-2`} key={index}>
                          <BsFillCaretRightFill />
                          <span>{item}</span>
                        </p>
                    )
                })
            }
        </div>
       </div>
       <div className="text-center">
        <button  className="mx-auto flex items-center gap-2 py-6 text-yellow-100 "
        onClick={()=>handleShare()}
        >
            <FaShareSquare size={15} /> Share
        </button>
       </div>
    </div>
    </div>
    </>
  )
}

export default CourseDetailsCard
