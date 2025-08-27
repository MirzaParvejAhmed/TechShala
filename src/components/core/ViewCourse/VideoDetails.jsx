import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { markLectureAsComplete } from '../../../services/operations/courseDetailsAPI'
import { updateCompletedLectures } from '../../../slices/viewCourseSlice'
import { Player,BigPlayButton } from 'video-react';
//import '~video-react/dist/video-react.css';
import "video-react/dist/video-react.css";
import Iconbutton from '../../common/Iconbutton'

const VideoDetails = () => {

    const {courseId,sectionId,subSectionId}=useParams()
    const navigate=useNavigate()
    const dispatch=useDispatch()
    const location=useLocation()
    const playerRef=useRef()
    const {token}=useSelector((state)=>state.auth)
    const {courseSectionData,courseEntireData,completedLectures}=useSelector((state)=>state.viewCourse)

    const [videodata,setvideodata]=useState([])
    const [videoended,setvideoended]=useState(false)
    const [loading,setloading]=useState(false);
    const [previewSource, setPreviewSource] = useState("")


    useEffect(() => {
        const setbydefaultvideodetails = async () => {
            if (!courseSectionData || courseSectionData.length === 0) {
                return; // Exit early if courseSectionData is empty
            }
            if (!courseId || !sectionId || !subSectionId) {
                navigate("/dashboard/enrolled-courses");
                return;
            }
    
            // Find section by ID
            const sectiondata = courseSectionData.find((course) => course._id === sectionId);
            if (!sectiondata) {
                console.error("Section not found!");
                return;
            }
    
            // Find video by ID
            const exactvideodata = sectiondata.subsections?.find((data) => data._id === subSectionId);
            if (!exactvideodata) {
                console.error("Video not found!");
                return;
            }
    
            setvideodata(exactvideodata);
            setvideoended(false);
            setPreviewSource(courseEntireData?.thumbnail);
        };
    
        setbydefaultvideodetails();
    }, [courseSectionData, courseEntireData, location.pathname]);
    

    const isFirstVideo=()=>{
        //taaaki prev button na dikhaye is first video ko
        //sbse pehle section me sbse pehle subsection wali video first hogi
        const currentsectionindex=courseSectionData.findIndex((data)=>data._id===sectionId)
        const currentsubsectionindex=courseSectionData[currentsectionindex].subsections.findIndex((data)=>data._id===subSectionId)
        if(currentsectionindex===0&&currentsubsectionindex===0){
            return true
        }
        else {
            return false
        }
        

    }
    const isLastVideo=()=>{
        //taaaki next button na dikhaye is last video ko
        //boolena function h ye
        const currentsectionindex=courseSectionData.findIndex((data)=>data._id===sectionId)
        const numberofsubsections=courseSectionData[currentsectionindex].subsections.length;
        const currentsubsectionindex=courseSectionData[currentsectionindex].subsections.findIndex((data)=>data._id===subSectionId)
        if((currentsectionindex===courseSectionData.length-1)&&(currentsubsectionindex=== numberofsubsections-1)){
            return true
        }
        else {
            return false
        }

    }

    const gotonextVideo=()=>{

        const currentsectionindex=courseSectionData.findIndex((data)=>data._id===sectionId)

        const numberofsubsections=courseSectionData[currentsectionindex].subsections.length;

        const currentsubsectionindex=courseSectionData[currentsectionindex].subsections.findIndex((data)=>data._id===subSectionId)

        if(currentsubsectionindex!==numberofsubsections-1){
            //same section ki next video me jaao
            const nextsubsectionid=courseSectionData[currentsectionindex].subsections[currentsubsectionindex+1]._id
            //iss video pr jaao
            navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextsubsectionid}`)
        }
        else{
            //diffrent section ki fierst viodeo
            const nextsectionid=courseSectionData[currentsectionindex+1]._id;
            const nextsubsectionid=courseSectionData[currentsectionindex+1].subsections[0]._id;
             //iss video pr jaao
            navigate(`/view-course/${courseId}/section/${nextsectionid}/sub-section/${nextsubsectionid}`)
        }
    }

    const gotoPrevVideo=()=>{
        const currentsectionindex=courseSectionData.findIndex((data)=>data._id===sectionId)

        //const numberofsubsections=courseSectionData[currentsectionindex].subsections.length;

        const currentsubsectionindex=courseSectionData[currentsectionindex].subsections.findIndex((data)=>data._id===subSectionId)

        if(currentsubsectionindex!==0){
            //same section ki previous video me jaao
            const prevsubsectionid=courseSectionData[currentsectionindex].subsections[currentsubsectionindex-1]._id;
             //iss video pr jaao
            navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${prevsubsectionid}`)
        }
        else{
            //diffrent section ki last video
            const prevsectionid=courseSectionData[currentsectionindex-1]._id;

            const prevsubsectionlength=courseSectionData[currentsectionindex-1].subsections.length

            const prevsubsectionid=courseSectionData[currentsectionindex-1].subsections[prevsubsectionlength-1]._id;
            //iss video pr jaao
            navigate(`/view-course/${courseId}/section/${prevsectionid}/sub-section/${prevsubsectionid}`)
        }


    }
    const handleLectureCompletion=async()=>{
        //lecture complete ho gaya
        setloading(true)
        const res=await markLectureAsComplete({courseid:courseId,subsectionid:subSectionId},token);
        //update state
        if(res){
            dispatch(updateCompletedLectures(subSectionId));
        }
        setloading(false)
    }



    const rewatchVideo=()=>{
         //rewatch video
         if(playerRef?.current){
            playerRef?.current?.seek(0);
            setvideoended(false);
        }
    }

  return (
    <div className="flex flex-col gap-5 text-white">
      {
        !videodata?(
            <img
             src={previewSource}
             alt="Preview"
            className="h-full w-full rounded-md object-cover"
        />
        )
        :(
            <Player
                ref={playerRef}
                aspectRatio='16:9'
                playsInline
                onEnded={()=>setvideoended(true)}
                src={videodata?.videourl}
            >
                 <BigPlayButton position="center" />
              {
                videoended && (
                    <div
                    style={{
                        backgroundImage:
                          "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1)",
                      }}
                      className="full absolute inset-0 z-[100] grid h-full place-content-center font-inter"
                    >
                        {
                            !completedLectures.includes(subSectionId)&&(
                                <Iconbutton
                                 disabled={loading}
                                 onClick={()=>handleLectureCompletion()}
                                 text={!loading?"Mark as completed":"Loading.."}
                                 customClasses="text-xl max-w-max px-4 mx-auto"
                                />
                            )
                        }
                        <Iconbutton
                          disabled={loading}
                          onClick={()=>rewatchVideo()}
                          text="Rewatch"
                          customClasses="text-xl max-w-max px-4 mx-auto mt-2"
                        />
                        <div className="mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl">
                            {
                                !isFirstVideo() && (
                                    <button
                                    disabled={loading}
                                    onClick={()=>gotoPrevVideo()}
                                    className='blackButton'
                                    >
                                        Prev
                                    </button>
                                )
                            }
                            {
                                !isLastVideo()&&(
                                    <button
                                    disabled={loading}
                                    onClick={()=>gotonextVideo()}
                                    className='blackButton'
                                    >
                                        Next
                                    </button>
                                )
                            }
                        </div>
                    </div>
                )
              }  
            </Player>
        )
      }
      <h1 className="mt-4 text-3xl font-semibold">
        {videodata?.title}
      </h1>
      <p className="pt-2 pb-6">
        {videodata?.description}
      </p>
    </div>
  )
}

export default VideoDetails
