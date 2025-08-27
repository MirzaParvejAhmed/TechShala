import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
//import { FaRegStar, FaStar } from "react-icons/fa"
import RatingStars from "../../common/RatingStars";
import GetAvgRating from "../../../utils/avgRating";

const CourseCard = ({course,Height}) => {
  const [avgReviewcnt,setavgReviewcnt]=useState(0);

  useEffect(()=>{
    const count= GetAvgRating(course.ratingandreviews);
    setavgReviewcnt(count);
  },[course])

  return (
    <div>
      <Link to={`/courses/${course._id}`}>
        <div>
          <div className="rounded-lg">
            <img src={course?.thumbnail}  alt={course.coursename} 
            className={`${Height} w-full rounded-xl object-cover`}/>
          </div>
          <div className="flex flex-col gap-2 px-1 py-3">
            <p className="text-xl text-richblack-5">{course?.coursename}</p>
            <p className="text-sm text-richblack-25" >Instructor: {course?.instructor?.firstname} {course?.instructor?.lastname}</p>
            <div className="flex items-center gap-2" >
              <span className="text-yellow-5">{avgReviewcnt||0}</span>
              <RatingStars Review_Count={avgReviewcnt} />
              <span className="text-richblack-400" >{course?.ratingandreviews?.length} Ratings</span>
            </div>
            <p className="text-xl text-richblack-5">Rs.{course?.price}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CourseCard;
