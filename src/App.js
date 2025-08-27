// import logo from './logo.svg';
import './App.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

//pages
import Home from "./pages/Home";
import Login from './pages/Login';
import Signup from './pages/Signup';
import Updatepassword from './pages/Updatepassword';
import Verifyemail from './pages/Verifyemail';
import { ACCOUNT_TYPE } from "./utils/constants"
import ViewCourse from './pages/Viewlectures';
//components
import Forgotpassword from './pages/Forgotpassword';
import Navbar from './components/common/Navbar';
import { useEffect } from 'react';
import OpenRoute from './components/core/Auth/OpenRoute';
import About from './pages/About';
import Myprofile from './components/core/Dashboard/Myprofile';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/core/Auth/PrivateRoute';
import Error from "./pages/Error"
import Contact from './pages/Contact';
import Enrolledcourses from './components/core/Dashboard/Enrolledcourses';
import Cart from './components/core/Dashboard/Cart';
import Settings from './components/core/Dashboard/Settings';
import AddCourse from './components/core/Dashboard/AddCourse';
import Mycourses from './components/core/Dashboard/Mycourses';
import Editcourse from './components/core/Dashboard/Editcourse';
import Catalog from './pages/Catalog';
import CourseDetails from './pages/CourseDetails';

import VideoDetails from './components/core/ViewCourse/VideoDetails';
import Instructor from './components/core/Dashboard/Instructordashboard/Instructor';
import { getUserDetails } from './services/operations/profileAPI';


function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {user} = useSelector((state) => state.profile);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const token = JSON.parse(localStorage.getItem("token"))
      dispatch(getUserDetails(token, navigate))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex min-h-screen w-screen flex-col bg-richblack-900 font-inter">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="catalog/:catalogName" element={<Catalog />} />
        <Route path="courses/:courseId" element={<CourseDetails />} />

        {/* Open Route - for Only Non Logged in User */}
        <Route
          path="signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />

        <Route
          path="login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />
        <Route
          path="forgot-password"
          element={
            <OpenRoute>
              <Forgotpassword />
            </OpenRoute>
          }
        />
        <Route
          path="update-password/:id"
          element={
            <OpenRoute>
              <Updatepassword />
            </OpenRoute>
          }
        />

        <Route
          path="verify-email"
          element={
            <OpenRoute>
              <Verifyemail />
            </OpenRoute>
          }
        />

        {/* Private Route - for Only Logged in User */}

        <Route
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          {/* Route for all users */}
          <Route path="dashboard/my-profile" element={<Myprofile />} />
          <Route path="dashboard/Settings" element={<Settings />} />

          <Route path="dashboard/enrolled-courses" element={<Enrolledcourses />} />
          <Route path="dashboard/cart" element={<Cart />} />




          {/* Route only for Instructors */}
          {
            user?.accounttype === ACCOUNT_TYPE.INSTRUCTOR && (
              <>
                <Route path="/dashboard/instructor" element={<Instructor />} />
                <Route path="dashboard/my-courses" element={<Mycourses />} />
                <Route path="dashboard/add-course" element={<AddCourse />} />,
                <Route path="dashboard/edit-course/:courseId" element={<Editcourse />} />
              </>
            )
          }
          {/* Route only for Students */}
          {
            user?.accounttype === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route path="dashboard/enrolled-courses" element={<Enrolledcourses />} />
                <Route path="dashboard/cart" element={<Cart />} />
                <Route path="dashboard/settings" element={<Settings />} />
              </>
            )
          }
        </Route>
        {/* For the watching course lectures */}
        <Route element={
          <PrivateRoute>
            <ViewCourse />
          </PrivateRoute>
        }>
         
          {
            user?.accounttype === ACCOUNT_TYPE.STUDENT && (
              <>
                 <Route path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                  element={<VideoDetails />}
                />
              </>
            )
          }
        </Route>

          {/* 404 Page */}
        <Route path="*" element={<Error />} />

      </Routes>
    </div>
  );
}

export default App;
