import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { apiConnector } from "../../services/apiconnector";
import { contactusEndpoint } from "../../services/api";
import Countrycode from "../../data/countrycode.json";
const Contactusform = () => {
  const [loading, setloading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm();

  const submitcontactform = async (data) => {
    console.log("submit form data--->", data);
    try {
      setloading(true);
      const response = await apiConnector(
        "POST",
        contactusEndpoint.CONTACT_US_API,
        data
      );
      // const response={status:"ok"};
      console.log("response--->", response);
      setloading(false);
    } catch (error) {
      console.log("Error:", error.message);
      setloading(false);
    }
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        email: "",
        firstname: "",
        lastname: "",
        message: "",
        phoneNo: "",
      });
    }
  }, [reset, isSubmitSuccessful]);

  return (
    <form
      onSubmit={handleSubmit(submitcontactform)}
      className="flex flex-col gap-7"
    >
      <div className="flex flex-col gap-5 lg:flex-row">
        {/* firstname */}
        <div className="flex flex-col gap-2 lg:w-[48%]">
          <label htmlFor="firstname" className="lable-style">First Name</label>
          <input
            type="text"
            name="firstname"
            id="firstname"
            className="form-style"
            placeholder="Enter your firstname.."
            {...register("firstname", { required: true })}
          />
          {
            errors.firstname &&( 
            <span className="-mt-1 text-[12px] text-yellow-100">
            Please enter your firstname
            </span>)
          }
        </div>

        {/* lastname */}
        <div className="flex flex-col gap-2 lg:w-[48%]">
          <label htmlFor="lastname" className="lable-style">Last Name</label>
          <input
            type="text"
            name="lastname"
            className="form-style"
            id="lastname"
            placeholder="Enter your lastname.."
            {...register("lastname")}
          />
          {errors.lastname && <span>Please enter your lastname</span>}
        </div>
      </div>
      {/* email */}
      <div className="flex flex-col gap-2">
        <label htmlFor="email"  className="lable-style">Email Address</label>
        <input
          type="email"
          name="email"
          id="email"
          className="form-style"
          placeholder="Enter your email address.."
          {...register("email", { required: true })}
        />
        {errors.email && (
            <span className="-mt-1 text-[12px] text-yellow-100">
                Please enter a valid email address
            </span>
        )}
      </div>

      {/* phone no */}
      <div className="flex flex-col gap-2">
        <label htmlFor="phonenumber" className="lable-style">
            Phone Number
        </label>
        <div className="flex gap-5">
          {/* dropdown */}
          <div className="flex w-[81px] flex-col gap-2">
            <select
              name="dropdown"
              id="dropdown"
              className="form-style"
              {...register("countrycode", { required: true })}
            >
              {Countrycode.map((element, index) => {
                return (
                  <option key={index} value={element.code}>
                    {element.code}   - {element.country}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="flex w-[calc(100%-90px)] flex-col gap-2">
            <input
              type="tel"
              name="phonenumber"
              id="phonenumber"
              placeholder="98765 43218"
              className="form-style"
              {...register(
                "phoneNo",
                {
                  required: {
                    value: true,
                    message: "Please enter your phone number",
                  },
                  maxLength: { value: 10, message: "Invalid phone number" },
                  minLength: { value: 10, message: "Invalid phone number" },
                },
                { valueAsNumber: true },
              )}
            ></input>
          </div>
        </div>
        {errors.phoneNo && <span className="-mt-1 text-[12px] text-yellow-100">{errors.phoneNo.message}</span>}
      </div>

      {/* message box */}
      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="lable-style">Message</label>
        <textarea
          name="message"
          id="message"
          cols="30"
          rows="10"
          className="form-style"
          placeholder="Enter your message here"
          {...register("message", { required: true })}
        />
        {errors.message && <span className="-mt-1 text-[12px] text-yellow-100">Please enter a message</span>}
      </div>

      {/* button */}
      <button
        disabled={loading}
        type="submit"
        className={`rounded-md bg-yellow-50 px-6 py-3 text-center text-[13px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] 
         ${
           !loading &&
           "transition-all duration-200 hover:scale-95 hover:shadow-none"
         }  disabled:bg-richblack-500 sm:text-[16px] `}
      >
        Send Message
      </button>
    </form>
  );
};

export default Contactusform;
