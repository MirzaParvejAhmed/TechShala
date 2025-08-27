import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BiInfoCircle } from "react-icons/bi";
import { HiOutlineGlobeAlt } from "react-icons/hi";
import { BuyCourse } from "../services/operations/studentFeaturesAPI";
import { useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";

import { fetchCourseDetails } from "../services/operations/courseDetailsAPI";
import GetAvgRating from "../utils/avgRating";
import Error from "./Error";
import Confirmationmodal from "../components/common/Confirmationmodal";
import RatingStars from "../components/common/RatingStars";
import { formatDate } from "../services/formateDate";
import CourseDetailsCard from "../components/core/Coursedetails/CourseDetailsCard";
import Footer from "../components/common/Footer";
import CourseAccordionBar from "../components/core/Coursedetails/CourseAccordionBar";

const CourseDetails = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  //const {course}=useSelector((state)=>state.course)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courseId } = useParams();

  const { loading } = useSelector((state) => state.profile);
  const { paymentLoading } = useSelector((state) => state.course);

  const [courseData, setcourseData] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(null);

  
  //console.log("courseid---->",courseId);
  useEffect(() => {
    const getcoursefulldetails = async () => {
      try {
        const result = await fetchCourseDetails(courseId);
        //console.log("result--->",result);
        setcourseData(result);
      } catch (error) {
        console.log("couldnot fetch course details");
      }
    };
    getcoursefulldetails();
  }, [courseId]);
  //console.log("coursedetails---->",courseData)

  const [avgreviewCnt, setavgreviewCnt] = useState(0);

  useEffect(() => {
    const count = GetAvgRating(courseData?.coursedetails?.ratingandreviews);
    setavgreviewCnt(count);
  }, [courseData]);

  const [totalnooflectures, setTotalnooflectures] = useState(0);

  useEffect(() => {
    let lectures = 0;
    courseData?.coursedetails?.coursecontent?.forEach((sec) => {
      lectures += sec.subsections.length || 0;
    });
    setTotalnooflectures(lectures);
  }, [courseData]);

  const [isactive, setisActive] = useState(Array(0));

  const handleActive = (id) => {
    //console.log("id inside handle active---->",id)
    //toggle krao-koi section open h to usko close krdo and vice verca
    setisActive(
      !isactive.includes(id)
        ? isactive.concat([id])
        : isactive.filter((e) => e !== id)
    );
  };
  // const handleActive = (id) => {
  //   // console.log("called", id)
  //   setIsActive(
  //     !isActive.includes(id)
  //       ? isActive.concat([id])
  //       : isActive.filter((e) => e != id)
  //   )
  // }

  const handleBuyCourse = () => {
    if (token) {
      BuyCourse(token, [courseId], user, navigate, dispatch);
      return;
    } else {
      setConfirmationModal({
        text1: "You are not Logged in!!",
        text2: "Please Login to Purchase the Course",
        btn1Text: "Login",
        btn2Text: "Cancel",
        btn1Handler: () => navigate("/login"),
        btn2Handler: () => setConfirmationModal(null),
      });
    }
    if (paymentLoading) {
      // console.log("payment loading")
      return (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
          <div className="spinner"></div>
        </div>
      );
    }
  };

  if (loading || !courseData) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!courseData.success) {
    return (
      <div>
        <Error />
      </div>
    );
  }

  const {
    _id,
    coursename,
    coursedescription,
    thumbnail,
    price,
    whatyouwilllearn,
    coursecontent,
    ratingandreviews,
    instructor,
    studentsenrolled,
    createdAt,
  } = courseData?.coursedetails;

  return (
    <>
      <div className={`relative w-full bg-richblack-800`}>
        <div className="mx-auto box-content px-4 lg:w-[1260px] 2xl:relative ">
          <div className="mx-auto grid min-h-[450px] max-w-maxContentTab justify-items-center py-8 lg:mx-0 lg:justify-items-start lg:py-0 xl:max-w-[810px]">
            <div className="relative block max-h-[30rem] lg:hidden">
              <div className="absolute bottom-0 left-0 h-full w-full shadow-[#161D29_0px_-64px_36px_-28px_inset]"></div>
              <img
                src={thumbnail}
                alt="course thumbnail"
                className="aspect-auto w-full"
              />
            </div>
            <div
              className={`z-30 my-5 flex flex-col justify-center gap-4 py-5 text-lg text-richblack-5`}
            >
              <div>
                <p className="text-4xl font-bold text-richblack-5 sm:text-[42px]">
                  {coursename}
                </p>
              </div>
              <p className={`text-richblack-200`}>{coursedescription}</p>
              <div className="text-md flex flex-wrap items-center gap-2">
                <span className="text-yellow-25">{avgreviewCnt}</span>
                <RatingStars Review_Count={avgreviewCnt} Star_Size={24} />
                <span>{`(${ratingandreviews.length} reviews)`}</span>
                <span>{`(${studentsenrolled.length} students enrolled)`}</span>
              </div>

              <div>
                <p>
                  Created By: {`${instructor.firstname} ${instructor.lastname}`}
                </p>
              </div>

              <div className="flex flex-wrap gap-5 text-lg">
                <p className="flex items-center gap-2">
                  {" "}
                  <BiInfoCircle /> Created At : {formatDate(createdAt)}
                </p>
                <p className="flex items-center gap-2">
                  {" "}
                  <HiOutlineGlobeAlt /> English
                </p>
              </div>
            </div>
            <div className="flex w-full flex-col gap-4 border-y border-y-richblack-500 py-4 lg:hidden">
              <p className="space-x-3 pb-4 text-3xl font-semibold text-richblack-5">
                Rs. {price}
              </p>
              <button
                className="yellowButton"
                onClick={() => handleBuyCourse()}
              >
                Buy Now
              </button>
              <button className="blackButton">Add to Cart</button>
            </div>
          </div>
          {/* course card */}
          <div className="right-[1rem] top-[60px] mx-auto hidden min-h-[600px] w-1/3 max-w-[410px] translate-y-24 md:translate-y-0 lg:absolute  lg:block">
            <CourseDetailsCard
              course={courseData?.coursedetails}
              setConfirmationModal={setConfirmationModal}
              handleBuyCourse={handleBuyCourse}
            />
          </div>
        </div>
      </div>
      <div className="mx-auto box-content px-4 text-start text-richblack-5 lg:w-[1260px]">
        <div className="mx-auto max-w-maxContentTab lg:mx-0 xl:max-w-[810px]">
          {/* What will you learn section */}
          <div className="my-8 border border-richblack-600 p-8">
          <p className="text-3xl font-semibold">What you'll Learn</p>
          <div className="mt-5">
            
            <ReactMarkdown>{whatyouwilllearn}</ReactMarkdown>
          </div>
          </div>
          
        </div>
        {/* Course Content Section */}
        <div className="max-w-[830px] ">
          <div className="flex flex-col gap-3">
            <p className="text-[28px] font-semibold">Course Content</p>

            <div className="flex flex-wrap justify-between gap-2">
              <div className="flex gap-2">
                <span>
                  {coursecontent.length} {`section(s)`}
                </span>

                <span>
                  {totalnooflectures} {`lecture(s)`}
                </span>

                <span>Total length : {courseData?.Total_Duration}</span>
              </div>
              <div>
                <button
                  className="text-yellow-25"
                  onClick={() => setisActive([])}
                >
                  Collapse all Sections
                </button>
              </div>
            </div>
          </div>
          {/* Course Details Accordion */}
          <div className="py-4">
            {coursecontent?.map((course, index) => (
               <CourseAccordionBar
                course={course}
                key={index}
                isactive={isactive}
                handleActive={handleActive}
              />
            ))}
          </div>
          {/* Author Details */}
          <div className="mb-12 py-4">
            <p className="text-[28px] font-semibold">Author</p>
            <div className="flex items-center gap-4 py-4">
              <img
                src={
                  instructor.image
                    ? instructor.image
                    : `https://api.dicebear.com/5.x/initials/svg?seed=${instructor.firstname}${instructor.lastname}`
                }
                alt="Author"
                className="h-14 w-14 rounded-full object-cover"
              />
              <p className="text-lg">{`${instructor.firstname} ${instructor.lastname}`}</p>
            </div>
            <p className="text-richblack-50">
              {instructor?.additionaldetails?.about}
            </p>
          </div>
        </div>
      </div>
      <Footer />
      {confirmationModal && <Confirmationmodal modalData={confirmationModal} />}
    </>
  );
};

export default CourseDetails;
