import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { apiConnector } from "../../services/apiconnector";
import { ratingsEndpoints } from "../../services/api";
import ReactStars from "react-rating-stars-component";
import { FaStar } from "react-icons/fa";
import "../../App.css";

const ReviewSlider = () => {
  const [reviews, setreviews] = useState([]);
  const truncatewords = 15;

  useEffect(() => {
    const fetchallreviews = async () => {
      const response = await apiConnector(
        "GET",
        ratingsEndpoints.REVIEWS_DETAILS_API
      );
      //console.log("response",response)
      const { data } = response;
      if (data?.success) {
        setreviews(data?.data);
      }
      //console.log("response",reviews)
    };
    fetchallreviews();
  }, []);

  return (
    <div className="text-richblack-5">
      <div className="my-[50px] h-[184px] max-w-maxContentTab lg:max-w-maxContent">
        <Swiper
          effect="coverflow"
          slidesPerView={3}
          spaceBetween={25}
          loop={true}
          freeMode={true}
          autoplay={{
            delay: 2500, // Set autoplay delay to 2.5 seconds
            disableOnInteraction: false, // Allows autoplay to continue after user interaction
          }}
          //pagination={{ clickable: true }} // Make sure pagination is clickable
          modules={[FreeMode, Pagination, Autoplay]} // Include all modules
          className="w-[60rem] h-full border-richblack-900"
        >
          {reviews?.map((review, index) => (
            <SwiperSlide key={index}>
              <div className="place-items-center flex flex-col gap-3 bg-richblack-800 p-3 text-[14px] text-richblack-25">
                <div className="flex items-center gap-4">
                  <img
                    src={
                      review?.user?.image
                        ? review?.user?.image
                        : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstname}${review?.user?.lastname}`
                    }
                    alt="Profile"
                    className="h-9 w-9 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <h1 className="font-semibold text-richblack-5">
                      {review?.user?.firstname} {review?.user?.lastname}
                    </h1>
                    <h2 className="text-[12px] font-medium text-richblack-500">
                      {review?.course?.coursename}
                    </h2>
                  </div>
                </div>
                <p className="font-medium text-richblack-25">
                  {review?.review.split(" ").length > truncatewords
                    ? `${review?.review
                        .split(" ")
                        .slice(0, truncatewords)
                        .join(" ")} ...`
                    : `${review?.review}`}
                </p>
                <div className="flex items-center gap-2 ">
                  <h3 className="font-semibold text-yellow-100">
                    {review?.rating.toFixed(1)}
                  </h3>
                  <ReactStars
                    count={5}
                    value={review.rating}
                    edit={false}
                    activeColor="#ffd700"
                    emptyIcon={<FaStar />}
                    fullIcon={<FaStar />}
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ReviewSlider;
