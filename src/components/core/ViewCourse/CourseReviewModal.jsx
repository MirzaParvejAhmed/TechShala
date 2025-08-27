import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux'
import { RxCross2 } from "react-icons/rx"
import ReactStars from "react-rating-stars-component";
import Iconbutton from '../../common/Iconbutton';
import { createRating } from '../../../services/operations/courseDetailsAPI';
import { FaStar } from 'react-icons/fa';

const CourseReviewModal = ({setreviewModal}) => {
   const {user}=useSelector((state)=>state.profile);
   const {token}=useSelector((state)=>state.auth)
   const {courseEntireData}=useSelector((state)=>state.viewCourse)

   const {register,handleSubmit,setValue,formState:{errors},}=useForm()

   useEffect(()=>{
    setValue('courseExperience',"")
    setValue("courseRating",0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
   },[])


   const ratingChanges=(newRating)=>{
    setValue("courseRating",newRating)
   }

   const onSubmit=async(data)=>{
    await createRating({
        courseid:courseEntireData._id,
        rating:data.courseRating,
        review:data?.courseExperience
    }
    ,token)
    setreviewModal(false)
   }

  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
        <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
            {/* modal header */}
            <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
                <p className="text-xl font-semibold text-richblack-5">Add Review</p>
                <button onClick={()=>setreviewModal(false)}>
                  <RxCross2 className="text-2xl text-richblack-5" />
                </button>
            </div>

            {/* modal body */}
            <div className="p-6">
                <div className="flex items-center justify-center gap-x-4">
                    <img
                    src={user?.image}
                    alt={user?.firstname + "profile"}
                    className="aspect-square w-[50px] rounded-full object-cover"
                    />
                    <div>
                        <p className="font-semibold text-richblack-5">{user?.firstname} {user?.lastname}</p>
                        <p className="text-sm text-richblack-5">Your reviews matters a lot!!</p>
                    </div>

                </div>
                <form
                onSubmit={handleSubmit(onSubmit)}
                className='mt-6 flex flex-col items-center'
                >
                   <ReactStars
                   count={5}
                   onChange={ratingChanges}
                   size={24}
                   activeColor="#ffd700"
                    emptyIcon={<FaStar/>}
                    fullIcon={<FaStar/>}
                   />

                   <div className="flex w-11/12 flex-col space-y-2">
                    <label 
                      className="text-sm text-richblack-5"
                    htmlFor='courseExperience'
                    >
                        Add your Experience<sup className="text-pink-200">*</sup>
                    </label>
                    <textarea
                    id="courseExperience"
                    name="courseExperience"
                    rows={4}
                    cols={30}
                    placeholder='Add your experience here...'
                    {...register("courseExperience",{required:true})}
                    className="form-style resize-x-none min-h-[130px] w-full"
                     onKeyDown={(e) => {
                       e.stopPropagation(); // Prevent event from bubbling up
                     }}
                    />
                    {
                        errors.courseExperience && (<span className="ml-2 text-xs tracking-wide text-pink-200">
                            Please add your experience...
                        </span>)
                    }
                   </div>
                   {/* cancel and save button */}
                   <div className="mt-6 flex w-11/12 justify-end gap-x-2">
                    <button
                    onClick={()=>setreviewModal(false)}
                    className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
                    >
                        Cancel
                    </button>
                    <Iconbutton
                    text="Save"
                    />
                   </div>

                </form>
            </div>
        </div>
    </div>
  )
}

export default CourseReviewModal
