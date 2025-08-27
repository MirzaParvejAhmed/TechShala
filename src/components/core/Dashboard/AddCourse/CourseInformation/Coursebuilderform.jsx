import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import Iconbutton from '../../../../common/Iconbutton'
import { useDispatch, useSelector } from 'react-redux'
import { setCourse, setEditCourse, setStep } from '../../../../../slices/courseSlice'
import toast from 'react-hot-toast'
import { createSection, updateSection } from '../../../../../services/operations/courseDetailsAPI'
import Nestedview from './Nestedview'
import { IoAddCircleOutline } from 'react-icons/io5'
import { MdNavigateNext } from 'react-icons/md'

const Coursebuilderform = () => {
  const {register,handleSubmit,setValue,formState:{errors}}=useForm()
  const [editSectionName,setEditSectionName]=useState(null); //flag h ye 

  const {course}=useSelector((state)=>state.course);
  const dispatch=useDispatch();
  const [loading,setloading]=useState(false);
  const {token}=useSelector((state)=>state.auth);

  const canceledit=()=>{
    setEditSectionName(null);
    setValue("sectionName","");
  }

  const goback=()=>{
    dispatch(setStep(1));
    dispatch(setEditCourse(true));
  }

  const gotonext=()=>{
    if(course.coursecontent.length ===0){
      toast.error("Please add at least one section");
      return 
    }
    if(course.coursecontent.some((section)=>section.subsections.length===0)){
      toast.error("Please add at least one subsection in each section");
      return 
    }
    //it means everything is good
    dispatch(setStep(3));
  }

  const onsubmit=async(data)=>{
    //console.log("onsubmit data--->",data)
    setloading(true);
    let result;
    if(editSectionName){
      //we r editing the section name
      result=await updateSection({
        sectionname:data.sectionName,
        sectionid:editSectionName,
        courseid:course._id,
      },token)
    }
    else {
      //we r craeting a new section
      result =await createSection({
        sectionname:data.sectionName,
        courseid:course._id,
      },token)
    }
    //update values
    //console.log("Result---->",result);
    if(result){
      dispatch(setCourse(result));
      setEditSectionName(null);
      setValue("sectionName","");

    }
    //loading false krdo
    setloading(false);
  }

  const handleChangeEditSectionName=(sectionId,sectionName)=>{
    if(editSectionName===sectionId){
      canceledit();
      return;
    }
    setEditSectionName(sectionId);
    setValue("sectionName",sectionName);
  }

  return (
    <div>
      <div className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
        <p className="text-2xl font-semibold text-richblack-5">Course Builder</p>
        <form onSubmit={handleSubmit(onsubmit)}  className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="sectionName">Section Name<sup className="text-pink-200">*</sup></label>
            <input
            id="sectionName"
            disabled={loading}
            placeholder='Add section name..'
            {...register("sectionName",{required:true})}
            className="form-style w-full"
            />
            {
              errors.sectionName && <span  className="ml-2 text-xs tracking-wide text-pink-200">section name is required..</span>
            }

          </div>
          <div className="flex items-end gap-x-4">
            <Iconbutton type="submit" text={editSectionName?"Edit Section Name":"Create Section"}  outline={true}>
             <IoAddCircleOutline size={20} className="text-yellow-50"/>
            </Iconbutton>
            {
              editSectionName&&(
                <button type="button" onClick={canceledit} className="text-sm text-richblack-300 underline">
                  Cancel Edit
                </button>
              )
            }
          </div>
        </form>

        {/* nested sections component */}
        {course.coursecontent.length>0 &&(
          <Nestedview handleChangeEditSectionName={handleChangeEditSectionName}/>
        )}

        <div className="flex justify-end gap-x-3">
          <button onClick={goback} className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`} >
            Back
          </button>
          <Iconbutton text="Next" onClick={gotonext}>
          <MdNavigateNext />
          </Iconbutton>
        </div>

      </div>
    </div>
  )
}

export default Coursebuilderform
