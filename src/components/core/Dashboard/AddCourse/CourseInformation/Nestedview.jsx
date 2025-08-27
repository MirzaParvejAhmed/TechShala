import React, { useState } from "react";
import { AiFillCaretDown } from "react-icons/ai";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { RxDropdownMenu } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import SubsectionalModal from "./SubsectionalModal";
import Confirmationmodal from "../../../../common/Confirmationmodal";
import { deleteSection, deleteSubSection } from "../../../../../services/operations/courseDetailsAPI";
import { setCourse } from "../../../../../slices/courseSlice";
import { FaPlus } from "react-icons/fa";

const Nestedview = ({ handleChangeEditSectionName }) => {
  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [addSubsection, setAddsubsection] = useState(null); //flag
  const [viewSubsection, setViewsubsection] = useState(null); //flag
  const [editSubsection, setEditsubsection] = useState(null); //flag

   // to keep track of confirmation modal
  const [confirmationModal, setConfirmationModal] = useState(null);

  const handleDeleteSubSection = async (subSectionId, sectionId) => {
    const result=await deleteSubSection({
      subSectionId,sectionId,token
    })
    if(result){
      // update the structure of course
      const updatedCourseContent = course.coursecontent.map((section) =>
        section._id === sectionId ? result : section
      )
      const updatedCourse = { ...course, coursecontent: updatedCourseContent }
      dispatch(setCourse(updatedCourse))
    }
    setConfirmationModal(null);
  };
  const handleDeleteSection = async(sectionId) => {
    const result=await deleteSection({
      sectionid:sectionId,
      courseid:course._id,
      token,
    })
    if(result){
      dispatch(setCourse(result))
    }
    setConfirmationModal(null);
  };

  return (
    <div>
      <div  className="rounded-lg bg-richblack-700 p-6 px-8"
        id="nestedViewContainer">
        {course?.coursecontent?.map((section) => (
           // Section Dropdown
          <details key={section._id} open>
            {/* Section Dropdown Content */}
            <summary className="flex cursor-pointer items-center justify-between border-b-2 border-b-richblack-600 py-2">
              <div className="flex items-center gap-x-3">
                <RxDropdownMenu className="text-2xl text-richblack-50"  />
                <p className="font-semibold text-richblack-50">
                  {section.sectionname}
                </p>
              </div>

              {/* edit icons  */}
              <div className="flex items-center gap-x-3">
                <button
                  onClick={()=>handleChangeEditSectionName(
                    section._id,
                    section.sectionname
                  )}
                >
                  <MdEdit  className="text-xl text-richblack-300"/>
                </button>
                {/* delete icon */}
                <button
                  onClick={() => {
                    setConfirmationModal({
                      text1: "Delete this section",
                      text2: "All the lectures in this section will be deleted",
                      btn1Text: "Delete",
                      btn2Text: "Cancel",
                      btn1Handler: () => handleDeleteSection(section._id),
                      btn2Handler: () => setConfirmationModal(null),
                    });
                  }}
                >
                  <RiDeleteBin6Line className="text-xl text-richblack-300"  />
                </button>
                <span className="font-medium text-richblack-300">|</span>
                {/* down arrow  for dropdown list*/}
                <AiFillCaretDown className={`text-xl text-richblack-300`} />
              </div>
            </summary>
            {/* subsections display/render krvane h */}
            <div className="px-6 pb-4">
              {section.subsections.map((data) => (
                <div
                  key={data?._id}
                  onClick={() => setViewsubsection(data)}
                  className="flex cursor-pointer items-center justify-between gap-x-3 border-b-2 border-b-richblack-600 py-2"
                >
                  <div  
                  className="flex items-center gap-x-3 py-2 ">
                    <RxDropdownMenu className="text-2xl text-richblack-50" />
                    <p className="font-semibold text-richblack-50">
                      {data.title}
                    </p>
                  </div>

                  <div onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-x-3">
                    <button
                      onClick={() =>
                        setEditsubsection({ ...data, sectionId: section._id })
                      }
                    >
                      <MdEdit className="text-xl text-richblack-300" />
                    </button>
                    <button
                      onClick={() => {
                        setConfirmationModal({
                          text1: "Delete this Subsection",
                          text2: "selected lecture will be deleted",
                          btn1Text: "Delete",
                          btn2Text: "Cancel",
                          btn1Handler: () =>
                            handleDeleteSubSection(data._id, section._id),
                          btn2Handler: () => setConfirmationModal(null),
                        });
                      }}
                    >
                        <RiDeleteBin6Line className="text-xl text-richblack-300" />
                    </button>
                  </div>

                </div>
              ))}
               {/* Add New Lecture to Section */}
              <button onClick={()=>setAddsubsection(section._id)} className="mt-3 flex items-center gap-x-1 text-yellow-50">
              <FaPlus className="text-lg" />
                <p>Add lectures</p>
              </button>
            </div>
          </details>

        ))}
        </div>
            {/* Modal Display */}
        <div>
          {addSubsection ?(<SubsectionalModal modalData={addSubsection} setModalData={setAddsubsection} add={true}/>)
          :viewSubsection ?(<SubsectionalModal modalData={viewSubsection} setModalData={setViewsubsection} view={true} />)
          :editSubsection ?(<SubsectionalModal modalData={editSubsection} setModalData={setEditsubsection} edit={true}/>)
          :(<div> </div>)
          }

          {
            confirmationModal&&(<Confirmationmodal modalData={confirmationModal}/>)
          }
        </div>
      </div>
  );
};

export default Nestedview;
