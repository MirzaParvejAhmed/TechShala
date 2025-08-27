import React, { useState } from "react";
import { sidebarLinks } from "../../../data/dashboard-links";
import { logout } from "../../../services/operations/authAPI";
import { useDispatch, useSelector } from "react-redux";
import Sidebarlinks from "./Sidebarlinks";
import { useNavigate } from "react-router-dom";
import { VscSignOut } from "react-icons/vsc";
import Confirmationmodal from "../../common/Confirmationmodal";

const Sidebar = () => {
  const { user, loading: profileloading } = useSelector(
    (state) => state.profile
  );
  const { loading: authloading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //modal ko visivle krna h y nhi uski state manage kro
  const [confirmationModal, setConfirmationModal] = useState(null);

  if (profileloading || authloading) {
    return (
      <div className="grid h-[calc(100vh-3.5rem)] min-w-[220px] items-center border-r-[1px] border-r-richblack-700 bg-richblack-800">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      <div className="flex h-[calc(100vh-3.5rem)] min-w-[220px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800 py-10">
          <div className="flex flex-col">
            {sidebarLinks.map((link) => {
              if (link.type && user?.accounttype !== link.type) {
                return null;
              }
              return (
                <Sidebarlinks key={link.id} link={link} iconname={link.icon} />
              );
            })}
          </div>
          <div className="mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-700"></div>

          <div className="flex flex-col">
            <Sidebarlinks
              link={{ name: "Settings", path: "/dashboard/settings" }}
              iconname="VscSettingsGear"
            />
            <button
              onClick={() =>
                setConfirmationModal({
                  text1: "Are you Sure?",
                  text2: "You will be logged out from your Account",
                  btn1Text: "Logout",
                  btn2Text: "Cancel",
                  btn1Handler: () => dispatch(logout(navigate)),
                  btn2Handler: () => setConfirmationModal(null),
                })
              }
              className="px-8 py-2 text-sm font-medium text-richblack-300"
            >
              <div className="flex items-center gap-x-2">
                <VscSignOut className="text-lg" />
                <span>Logout</span>
              </div>
            </button>
          </div>
        </div>
        {confirmationModal && (
          <Confirmationmodal modalData={confirmationModal} />
        )}
    </>
  );
};

export default Sidebar;
