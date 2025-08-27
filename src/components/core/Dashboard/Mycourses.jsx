import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { VscAdd } from "react-icons/vsc"
import { fetchInstructorCourses } from '../../../services/operations/courseDetailsAPI'
import Iconbutton from '../../common/Iconbutton'
import Coursestable from './Instructorcourses/Coursestable'

const Mycourses = () => {
    const {token}=useSelector((state)=>state.auth)
    const navigate=useNavigate();
    const [courses, setCourses] = useState([]);
    useEffect(()=>{
        const fetchCourses=async()=>{
            const result=await fetchInstructorCourses(token);
            if(result){
                setCourses(result);
            }
        }
        fetchCourses();
         // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
  return (
    <div >
      <div className="mb-14 flex items-center justify-between">
        <h1 className="text-3xl font-medium text-richblack-5">
          My Courses
        </h1>
        <Iconbutton 
            text="Add Course"
            onClick={()=>navigate("/dashboard/add-course")}
        >
             <VscAdd />
        </Iconbutton>
      </div>
      {courses&&<Coursestable courses={courses} setCourses={setCourses}/>}
    </div>
  )
}

export default Mycourses
