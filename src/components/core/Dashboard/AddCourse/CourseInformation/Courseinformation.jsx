import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  addCourseDetails,
  editCourseDetails,
  fetchCourseCategories,
} from "../../../../../services/operations/courseDetailsAPI";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import Requirementfield from "./Requirementfield";
import { setCourse, setStep } from "../../../../../slices/courseSlice";
import Iconbutton from "../../../../common/Iconbutton";
import toast from "react-hot-toast";
import { COURSE_STATUS } from "../../../../../utils/constants";
import { MdNavigateNext } from "react-icons/md";
import ChipInput from "./Chipinput";
import Upload from "../Upload";

const Courseinformation = () => {
    
  const { token } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();
  const { course, editCourse } = useSelector((state) => state.course);
  const [courseCategories, setCourseCategories] = useState([]);


  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true);
      const categories = await fetchCourseCategories();
      //console.log("categories--->",categories)
      //console.log(typeof(categories));
      if (categories.length > 0) {
        setCourseCategories(categories);
      }
      setLoading(false);
    };
   
    //console.log("courseCategories....", courseCategories);
    // if form is in edit mode
    if (editCourse) {
      setValue("courseTitle", course.coursename);
      setValue("courseShortDesc", course.coursedescription);
      setValue("coursePrice", course.price);
      setValue("courseTags", course.tag);
      setValue("courseBenefits", course.whatyouwilllearn);
      setValue("courseCategory", course.category);
      setValue("courseRequirements", course.instructions);
      setValue("courseImage", course.thumbnail);
    }
    getCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isFormUpdated = () => {
    const currentValues = getValues();
    //console.log("changes after editing form values:", currentValues)
    if (
      currentValues.courseTitle !== course.coursename ||
      currentValues.courseShortDesc !== course.coursedescription ||
      currentValues.coursePrice !== course.price ||
      currentValues.courseTags.toString() !== course.tag.toString() ||
      currentValues.courseBenefits !== course.whatyouwilllearn ||
      currentValues.courseCategory._id !== course.category._id ||
      currentValues.courseImage !== course.thumbnail ||
      currentValues.courseRequirements.toString() !==
        course.instructions.toString()
    ) return true;
    else return false;
  };
  //  handle next button click

  const onSubmit = async (data) => {

       //console.log("data in course creation---->",data)
       //console.log("i9mage h ye",data.courseImage)
    if (editCourse) {
      if (isFormUpdated()) {
        const currentValues = getValues();
        const formData = new FormData();
        formData.append("courseId", course._id);
        if (currentValues.courseTitle !== course.coursename) {
          formData.append("coursename", data.courseTitle);
        }
        if (currentValues.courseShortDesc !== course.coursedescription) {
          formData.append("coursedescription", data.courseShortDesc);
        }
        if (currentValues.coursePrice !== course.price) {
          formData.append("price", data.coursePrice);
        }
        if (currentValues.courseTags.toString() !== course.tag.toString()) {
          formData.append("tag", JSON.stringify(data.courseTags));
        }
        if (currentValues.courseBenefits !== course.whatyouwilllearn) {
          formData.append("whatyouwilllearn", data.courseBenefits);
        }
        if (currentValues.courseCategory._id !== course.category._id) {
          formData.append("category", data.courseCategory);
        }
        if (
          currentValues.courseRequirements.toString() !==
          course.instructions.toString()
        ) {
          formData.append(
            "instructions",
            JSON.stringify(data.courseRequirements)
          );
        }
        if (currentValues.courseImage !== course.thumbnail) {
          formData.append("thumbnailImage", data.courseImage);
        }
           //console.log("Edit Form data: ", formData)
        setLoading(true);
        const result = await editCourseDetails(formData, token);
        setLoading(false);
        if (result) {
            dispatch(setStep(2))
            dispatch(setCourse(result))
        }
      } else {
        toast.error("No changes made to the form");
      }
      return;
    }

    //create a new course
    const formData = new FormData();
    formData.append("coursename", data.courseTitle)
    formData.append("coursedescription", data.courseShortDesc)
    formData.append("price", data.coursePrice)
    formData.append("tag", JSON.stringify(data.courseTags))
    formData.append("whatyouwilllearn", data.courseBenefits)
    formData.append("category", data.courseCategory)
    formData.append("status", COURSE_STATUS.DRAFT)
    formData.append("instructions", JSON.stringify(data.courseRequirements))
    formData.append("thumbnailImage", data.courseImage)
    setLoading(true);
    //console.log("Formdata in course creation-->.",formData);
    const result = await addCourseDetails(formData, token);
    //console.log("result in frontend--->",result)
    if (result) {
      dispatch(setStep(2))
      dispatch(setCourse(result));
    }
    setLoading(false);
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6"
    >
      <div className="flex flex-col space-y-2">
        <label  className="text-sm text-richblack-5" htmlFor="courseTitle">
          Course Title<sup className="text-pink-200">*</sup>
        </label>
        <input
          id="courseTitle"
          placeholder="Enter title of the course.."
          {...register("courseTitle", { required: true })}
          className="form-style w-full"
        />
        {errors.courseTitle && <span className="ml-2 text-xs tracking-wide text-pink-200">Course title is required</span>}
      </div>

      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseShortDesc">
          Course Short Description<sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="courseShortDesc"
          placeholder="Enter description of the course.."
          {...register("courseShortDesc", { required: true })}
          className="form-style resize-x-none min-h-[130px] w-full"
        />
        {errors.courseShortDesc && <span className="ml-2 text-xs tracking-wide text-pink-200">Course description is required</span>}
      </div>

      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="coursePrice">
          Course Price<sup className="text-pink-200">*</sup>
        </label>
       <div className="relative">
       <input
          id="coursePrice"
          placeholder="Enter price of the course.."
          {...register("coursePrice", { required: true, valueAsNumber: true , pattern: {
            value: /^(0|[1-9]\d*)(\.\d+)?$/,
          },})}
          className="form-style w-full !pl-12"
        />
        <HiOutlineCurrencyRupee  className="absolute left-3 top-1/2 inline-block -translate-y-1/2 text-2xl text-richblack-400" />
       </div>
        {errors.coursePrice && <span className="ml-2 text-xs tracking-wide text-pink-200"> Course price is required</span>}
      </div>

        {/* Course Category */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseCategory">
          Course Category<sup className="text-pink-200">*</sup>
        </label>
        <select
          id="courseCategory"
         className="form-style w-full"
          defaultValue=""
          {...register("courseCategory", { required: true })}
        >
            
          <option value="" disabled>
            Choose a category
          </option>
          {!loading &&
            courseCategories.map((category, index) => (
              <option key={index} value={category?._id}>
                {category?.name}
              </option>
            ))}
        </select>
        {errors.courseCategory && <span className="ml-2 text-xs tracking-wide text-pink-200">Course Category is required..</span>}
      </div>

      {/* craete a custom component for handling tags input */}
      {/* Course Tags */}
      <ChipInput
        label="Tags"
        name="courseTags"
        placeholder="Enter Tags and press Enter"
        register={register}
        errors={errors}
        setValue={setValue}
        getValues={getValues}
      />
      {/* craete a custom component for uploading thumbnaila and showing it */}
      <Upload
        name="courseImage"
        label="Course Thumbnail"
        register={register}
        setValue={setValue}
        errors={errors}
        editData={editCourse ? course?.thumbnail : null}
      />
      {/* Benefits of the course */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseBenefits">
          Benefits of the course<sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="courseBenefits"
          placeholder="Enter benefits of the course"
          className="form-style resize-x-none min-h-[130px] w-full"
          {...register("courseBenefits", { required: true })}
        />
        {errors.courseBenefits && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">Benefits of thr course are required</span>
        )}
      </div>

      <Requirementfield
        name="courseRequirements"
        label="Requirements/Instructions"
        register={register}
        errors={errors}
        setValue={setValue}
        getValues={getValues}
      />
        {/* Next Button */}
      <div className="flex justify-end gap-x-2">
        {editCourse && (
          <button
           onClick={() => dispatch(setStep(2))}
            disabled={loading}
            className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
          >
            Continue without saving
          </button>
        )}

        <Iconbutton  disabled={loading}
        text={!editCourse ? "Next" : "Save changes"}
         >
            <MdNavigateNext/>
         </Iconbutton>
      </div>
    </form>
  );
};

export default Courseinformation;
