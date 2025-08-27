import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Iconbutton from "../../common/Iconbutton";
import { BsChevronDown } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";

const VideoDetailsSidebar = ({ setreviewModal }) => {
  const [activeSectionStatus, setactiveSectionStatus] = useState("");
  const [videobarActive, setvideobarActive] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { sectionId, subSectionId } = useParams();
  const {
    courseSectionData,
    courseEntireData,
    completedLectures,
    totalNoOfLectures,
  } = useSelector((state) => state.viewCourse);

  //konsi video highlight krni h
  useEffect(() => {
    const setActiveFlags = () => {
      if (!courseSectionData?.length) {
        return;
      }
      const currentsectionindex = courseSectionData.findIndex(
        (data) => data._id === sectionId
      );

      const currentsubsectionindex = courseSectionData?.[
        currentsectionindex
      ]?.subsections.findIndex((data) => data._id === subSectionId);
      //current lecture id nikallli i.e activesubsectionid
      const activesubsectionid =
        courseSectionData[currentsectionindex]?.subsections?.[
          currentsubsectionindex
        ]?._id;

      setactiveSectionStatus(courseSectionData?.[currentsectionindex]?._id);
      setvideobarActive(activesubsectionid);
    };
    setActiveFlags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseSectionData, courseEntireData, location.pathname]);

  return (
    <>
      <div className="flex h-[calc(100vh-3.5rem)] w-[320px] max-w-[350px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800">
        {/* for buttons and headings */}
        <div className="mx-5 flex flex-col items-start justify-between gap-2 gap-y-4 border-b border-richblack-600 py-5 text-lg font-bold text-richblack-25">
          {/* for buttons */}
          <div className="flex w-full items-center justify-between ">
            <div
              onClick={() => {
                navigate(`/dashboard/enrolled-courses`);
              }}
              className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-richblack-100 p-1 text-richblack-700 hover:scale-90"
              title="back"
            >
              <IoIosArrowBack size={30} />
            </div>

            <Iconbutton
              text="Add Review"
              customClasses="ml-auto"
              onClick={() => setreviewModal(true)}
            />
          </div>
          {/* for headings nd titles */}
          <div className="flex flex-col">
            <p>{courseEntireData?.coursename}</p>
            <p className="text-sm font-semibold text-richblack-500">
              {completedLectures?.length} / {totalNoOfLectures}
            </p>
          </div>
        </div>

        {/* for sectiuons and subsections */}
        <div className="h-[calc(100vh - 5rem)] overflow-y-auto">
          {courseSectionData?.map((section, index) => (
            <div
              className="mt-2 cursor-pointer text-sm text-richblack-5"
              onClick={() => setactiveSectionStatus(section?._id)}
              key={index}
            >
              {/* sections sectionname + icon*/}
              <div className="flex flex-row justify-between bg-richblack-600 px-5 py-4">
                <div className="w-[70%] font-semibold">
                  {section?.sectionname}
                </div>
                {/* add arrow icon    */}
                <div className="flex items-center gap-3">
                  {/* <span className="text-[12px] font-medium">
                    Lession {course?.subSection.length}
                  </span> */}
                  <span
                    className={`${
                      activeSectionStatus === section?.sectionname
                        ? "rotate-0"
                        : "rotate-180"
                    } transition-all duration-500`}
                  >
                    <BsChevronDown />
                  </span>
                </div>
              </div>

              {/* subsections */}
              <div>
                {/*means we r on current section */}
                {activeSectionStatus === section?._id && (
                  <div className="transition-[height] duration-500 ease-in-out">
                    {section?.subsections?.map((subsection, index) => (
                      <div
                        key={index}
                        className={`flex gap-3  px-5 py-2 ${
                          videobarActive === subsection?._id
                            ? "bg-yellow-200 font-semibold text-richblack-900"
                            : "hover:bg-richblack-900"
                        }`}
                        onClick={() => {
                          navigate(
                            `/view-course/${courseEntireData?._id}/section/${section?._id}/sub-section/${subsection._id}`
                          );
                          setvideobarActive(subsection?._id);
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={completedLectures.includes(subsection?._id)}
                          onChange={() => {}}
                        />
                        <span>{subsection?.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default VideoDetailsSidebar;
