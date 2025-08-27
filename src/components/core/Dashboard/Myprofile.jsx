import React from "react";
import { RiEditBoxLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Iconbutton from "../../common/Iconbutton";
import { formattedDate } from "../../../utils/dateformatter";

const Myprofile = () => {
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();

  return (
    <div>
      <h1 className="mb-14 text-3xl font-medium text-richblack-5">
        My Profile
      </h1>

      {/* section1 */}
      <div className="flex items-center justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
        <div className="flex items-center gap-x-4">
          <img
            src={user?.image}
            alt={`profile-${user?.firstname}`}
            className="aspect-square w-[78px] rounded-full object-cover"
          />
          <div className="space-y-1">
            <p className="text-lg font-semibold text-richblack-5">
              {user?.firstname + " " + user?.lastname}
            </p>
            <p className="text-sm text-richblack-300">{user?.email}</p>
          </div>
        </div>
        <Iconbutton
          text="Edit"
          onClick={() => {
            navigate("/dashboard/settings");
          }}
        >    <RiEditBoxLine />
          </Iconbutton>
      </div>

      {/* section2 */}
      <div className="my-10 flex flex-col gap-y-10 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
        <div className="flex w-full items-center justify-between">
          <p className="text-lg font-semibold text-richblack-5">About</p>
          <Iconbutton
            text="Edit"
            onClick={() => {
              navigate("/dashboard/settings");
            }}
          >    <RiEditBoxLine />
          </Iconbutton>
        </div>
        <p
          className={`${
            user?.additionaldetails?.about
              ? "text-richblack-5"
              : "text-richblack-400"
          } text-sm font-medium`}
        >
          {user?.additionaldetails?.about ?? "Write Something About Yourself"}
        </p>
      </div>

      {/* section3 */}
      <div className="my-10 flex flex-col gap-y-10 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
        <div className="flex w-full items-center justify-between">
          <p className="text-lg font-semibold text-richblack-5">Personal Details</p>
 
          <Iconbutton
            text="Edit"
            onClick={() => {
              navigate("/dashboard/settings");
            }}
           >
            <RiEditBoxLine />
           </Iconbutton>
        </div>
        <div className="flex max-w-[500px] justify-between">
          <div className="flex flex-col gap-y-5">
            <div>
            <p className="mb-2 text-sm text-richblack-600">First Name</p>
            <p className="text-sm font-medium text-richblack-5">{user?.firstname}</p>
            </div>
           <div>
            <p className="mb-2 text-sm text-richblack-600">Email</p>
            <p className="text-sm font-medium text-richblack-5">{user?.email}</p>
           </div>
           <div>
            <p className="mb-2 text-sm text-richblack-600">Gender</p>
            <p className="text-sm font-medium text-richblack-5">
                {user?.additionaldetails?.gender ?? "Add gender"}
            </p>
          </div>
          </div>
          <div className="flex flex-col gap-y-5">
           <div>
           <p className="mb-2 text-sm text-richblack-600">Last Name</p>
           <p className="text-sm font-medium text-richblack-5">{user?.lastname}</p>
           </div>
          <div>
            <p className="mb-2 text-sm text-richblack-600">Phone Number</p>
            <p className="text-sm font-medium text-richblack-5">
              {user?.additionaldetails?.contactnumber ?? "Add Contact Number"}
            </p>
          </div>
          <div>
            <p className="mb-2 text-sm text-richblack-600">Date of Birth</p>
            <p className="text-sm font-medium text-richblack-5">
                {formattedDate(user?.additionaldetails?.dateofbirth) ?? "Add Date of Birth"}
            </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Myprofile;
