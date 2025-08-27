
//--------------------------------//view lectures wala page h--------------------------------------


import React, { useEffect, useState } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import VideoDetailsSidebar from '../components/core/ViewCourse/VideoDetailsSidebar'
import CourseReviewModal from '../components/core/ViewCourse/CourseReviewModal'
import { useDispatch, useSelector } from 'react-redux'
import { getFullDetailsOfCourse } from '../services/operations/courseDetailsAPI'
import { setCompletedLectures, setCourseSectionData, setEntireCourseData, setTotalNoOfLectures } from '../slices/viewCourseSlice'

const ViewCourse = () => {
    const [reviewModal,setreviewModal]=useState(false)

    const {courseId}=useParams();
    const {token}=useSelector((state)=>state.auth)
    const dispatch=useDispatch();

    useEffect(()=>{
        const setCourseSpecificDetails=async()=>{
            const courseData=await getFullDetailsOfCourse(courseId,token);
            //console.log("courseData---->",courseData);
            dispatch(setCourseSectionData(courseData?.courseDetails.coursecontent));
            dispatch(setEntireCourseData(courseData?.courseDetails));
            dispatch(setCompletedLectures(courseData?.completedvideos))
            let lectures=0;
            courseData?.courseDetails?.coursecontent?.forEach((section)=>{
                lectures+=section.subsections.length
            })
            dispatch(setTotalNoOfLectures(lectures));
        }
        setCourseSpecificDetails();
          // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])


  return (
    <>
      <div className="relative flex min-h-[calc(100vh-3.5rem)]">
         <VideoDetailsSidebar setreviewModal={setreviewModal}/>
         <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
          <div className="mx-6">
            <Outlet />
          </div>
        </div>
      </div>
      {
        reviewModal && <CourseReviewModal setreviewModal={setreviewModal}/>
      }
    </>
  )
}

export default ViewCourse 
