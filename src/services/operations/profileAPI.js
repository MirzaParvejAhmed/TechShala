import { toast } from "react-hot-toast"
import { setLoading, setUser } from "../../slices/profileslice"
import { apiConnector } from "../apiconnector"
import { profileEndpoints } from "../api"
import { logout } from "./authAPI"

const {
  GET_USER_DETAILS_API,
  GET_USER_ENROLLED_COURSES_API,
  GET_INSTRUCTOR_DATA_API,
} = profileEndpoints

export function getUserDetails(token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("GET", GET_USER_DETAILS_API, null, {
        Authorization: `Bearer ${token}`,
      })
      console.log("GET_USER_DETAILS API RESPONSE............ggfg", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      const userImage = response.data.All_user.image
        ? response.data.All_user.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.All_user.firstname}${response.data.All_user.lastname}`
      dispatch(setUser({ ...response.data.All_user, image: userImage }))
    } catch (error) {
      dispatch(logout(navigate))
      console.log("GET_USER_DETAILS API ERROR..hhhh..........", error)
      toast.error("Could Not Get User Details")
    }
    toast.dismiss(toastId)
    dispatch(setLoading(false))
  }
}

export async function getUserEnrolledCourses(token) {
  const toastId = toast.loading("Loading...")
  let result = []
  try {
    const response = await apiConnector(
      "GET",
      GET_USER_ENROLLED_COURSES_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    )
 

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    result = response.data.data
    console.log("result from backend--->",result)
  } catch (error) {
    console.log("GET_USER_ENROLLED_COURSES_API API ERROR............", error)
    toast.error("Could Not Get Enrolled Courses")
    // toast.dismiss(toastId)
  }
  toast.dismiss(toastId)
  return result
}

export async function getInstructorData(token) {
  const toastId = toast.loading("Loading...")
  let result = []
  try {
    const response = await apiConnector("GET", GET_INSTRUCTOR_DATA_API, null, {
      Authorization: `Bearer ${token}`,
    })
    console.log("GET_INSTRUCTOR_DATA_API API RESPONSE............", response)
    result = response?.data?.courses
    console.log("result from backend-->",result)
  } catch (error) {
    console.log("GET_INSTRUCTOR_DATA_API API ERROR............", error)
    toast.error("Could Not Get Instructor Data")
  }
  toast.dismiss(toastId)
  return result
}