import React, { useEffect, useState } from 'react'
import { getInstructorData } from '../../../../services/operations/profileAPI'
import { useSelector } from 'react-redux'
import { fetchInstructorCourses } from '../../../../services/operations/courseDetailsAPI'
import Instructorchart from './Instructorchart'
import { Link } from 'react-router-dom'

const Instructor = () => {

    const [loading,setloading]=useState(false)
    const [instructordata,setinstructordata]=useState(null)
    const [courses,setcourses]=useState([])
    const {token}=useSelector((state)=>state.auth)
    const {user}=useSelector((state)=>state.profile)

    useEffect(()=>{
        const getCourseDataWithStats=async()=>{
            setloading(true)
            const intructorApidata=await getInstructorData(token);

            const result =await fetchInstructorCourses(token);

            console.log("intructor data---->",intructorApidata)
            if(intructorApidata.length){
                setinstructordata(intructorApidata)
            }
            if(result){
                setcourses(result)
            }

            setloading(false)
        }
        getCourseDataWithStats()
    },[])

    const totalamount=instructordata?.reduce((acc,curr)=>acc+curr.totalAmountGenerated,0);
    const totalstudents=instructordata?.reduce((acc,curr)=>acc+curr.totalStudentsEnrolled,0);



  return (
    <div>
      <div className="space-y-2">
       <h1 className="text-2xl font-bold text-richblack-5">
         Hi!! {user?.firstname} 👋
       </h1>
       <p className="font-medium text-richblack-200">
        Let's start something new..
        </p>
      </div>
      {
        loading?(<div className="spinner"></div>)
        :courses.length>0?(
            <div>
                <div className="my-4 flex h-[450px] space-x-4">
                {totalamount > 0 || totalstudents > 0 ? (
              <Instructorchart className="h-[30px] w-[30px]" courses={instructordata} />)
                :(
                    <div className="flex-1 rounded-md bg-richblack-800 p-6">
                      <p className="text-lg font-bold text-richblack-5">Visualize</p>
                      <p className="mt-4 text-xl font-medium text-richblack-50">
                        Not Enough Data To Visualize
                      </p>
                    </div>
                )}   
                <div  className="flex min-w-[250px] flex-col rounded-md bg-richblack-800 p-6">
                    <p className="text-lg font-bold text-richblack-5">Statistics</p>
                    <div  className="mt-4 space-y-4">
                        <div>
                        <p className="text-lg text-richblack-200"> Total Courses</p>
                        <p className="text-3xl font-semibold text-richblack-50">{courses.length}</p>
                     </div> 
                    <div>
                        <p className="text-lg text-richblack-200">Total Students</p>
                        <p className="text-3xl font-semibold text-richblack-50">{totalstudents}</p>
                    </div>  
                    <div>
                    <p className="text-lg text-richblack-200">Total Income</p>
                        <p className="text-3xl font-semibold text-richblack-50">Rs.{totalamount}</p>
                    </div>    
                  </div>  
            </div>
            </div>
            <div className="rounded-md bg-richblack-800 p-6">
                {/* render three courses */}
                <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-richblack-5">Your Courses</p>
                    <Link to="/dashboard/my-courses">
                    <p className="text-xs font-semibold text-yellow-50">View All</p>
                    </Link>
                </div>
                <div className="my-4 flex items-start space-x-6">
                    {
                        courses.slice(0,3).map((course) => (
                            <div key={course._id} className="w-1/3">
                                <img src={course?.thumbnail}
                                  alt={course?.coursename}
                                  className="h-[201px] w-full rounded-md object-cover"
                                />
                                <div className="mt-3 w-full">
                                    <p className="text-sm font-medium text-richblack-50">
                                        {course?.coursename}
                                    </p>

                                    <div className="mt-1 flex items-center space-x-2">
                                        <p className="text-xs font-medium text-richblack-300">
                                            {course.studentsenrolled.length} students
                                        </p>
                                        <p className="text-xs font-medium text-richblack-300"> | </p>
                                        <p className="text-xs font-medium text-richblack-300"> Rs.{course.price}</p>
                                    </div>   
                                </div>
                            </div>   
                        ))
                    }
                </div>      
            </div>       
            </div>    
        )
        :(<div className="mt-20 rounded-md bg-richblack-800 p-6 py-20">
            <p className="text-center text-2xl font-bold text-richblack-5">
                You have not Created any courses yet!!
                <Link to="/dashboard/add-course">
                  <p className="mt-1 text-center text-lg font-semibold text-yellow-50">Create a course</p>
                </Link>
            </p>
        </div>)
      }
    </div>
  )
}

export default Instructor
