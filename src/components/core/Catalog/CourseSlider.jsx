import React, { useEffect, useState } from "react"
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Pagination,Autoplay } from 'swiper/modules';

// Install modules

//import 'swiper/swiper-bundle.min.css';

// Import Swiper styles
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"

// import "../../.."
// Import required modules
//import { FreeMode, Pagination } from "swiper"
import CourseCard from './Course_Card'

const CourseSlider = ({Courses}) => {
  //console.log("courses insdie copurseslider-->",Courses)
  return (
    <div>
      {
        Courses?.length?(
          <Swiper 
          effect="coverflow"
          slidesPerView={3}
          spaceBetween={25}
          loop={true}
          freeMode={true}
          autoplay={{
            delay: 2000, // Set autoplay delay to 2.5 seconds
            disableOnInteraction: false, // Allows autoplay to continue after user interaction
          }}
          //pagination={{ clickable: true }} // Make sure pagination is clickable
          modules={[FreeMode, Pagination, Autoplay]} // Include all modules
          // breakpoints={{
          //   780: {
          //     slidesPerView: 2, // Show 2 slides on larger screens
          //   },
          //   500:{
          //     slidesPerView: 1,
          //   },
          // }}
          className="max-h-[30rem]"
          >
            {
              Courses.map((course,index)=>(
                <SwiperSlide key={index}>
                  <CourseCard course={course} Height={"h-[250px]"}/>
                </SwiperSlide>
              ))
            }
          </Swiper>
        ):
          <div className="text-xl text-richblack-5"> No courses found </div>
        
      }
    </div>
  )
}

export default CourseSlider
