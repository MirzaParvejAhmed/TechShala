import React, { useState } from 'react'
import { HomePageExplore } from '../../../data/homepage-explore'
import HighlightText from './HighlightText'
import Coursecard from './Coursecard'

const tabsname=[
    "Free",
    "New to coding",
    "Most popular",
    "Skills paths",
    "Career paths"
]

const Exploremore = () => {
    const [currenttab,setcurrenttab]=useState(tabsname[0])
    const [courses,setcourses]=useState(HomePageExplore[0].courses)
    const [currentcard,setcurrentcard]=useState(HomePageExplore[0].courses[0].heading)
    //logic for setting the current card 
    const setmycards=(value)=>{
        setcurrenttab(value);
        const result=HomePageExplore.filter((courses)=>courses.tag === value);
        setcourses(result[0].courses);
        setcurrentcard(result[0].courses[0].heading)
    }
  return (
    <div>
        <div>
            {/* Explore more section */}
            <div className='text-4xl font-semibold text-center my-10'> 
               Unlock the 
               <HighlightText text={"Power of Code"}/>
             <p className='text-center text-richblack-300 text-lg font-semibold mt-1'>
             Learn to build anything you imagine
            </p>
            </div>
        </div>

      {/* //creating tabs */}
      <div className='hidden lg:flex gap-5 -mt-5 mx-auto w-max bg-richblack-900 text-richblack-200 p-1 rounded-full font-medium drop-shadow-[0_1.5px_rgba(255,255,255,0.25)]'>
        {
            tabsname.map((element,index)=>{
                return (
                    <div className={`text-[16px] flex flex-row items-center gap-2
                    ${currenttab === element 
                    ? "bg-richblack-800 text-richblack-5 font-medium"
                    :"text-richblack-200"}  rounded-full transition-all duration-200 cursor-pointer
                    hover:bg-richblack-800 hover:text-richblack-5 px-7 py-[7px] `} 
                    key={index} onClick={()=>setmycards(element)}>
                        {element}
                    </div>   
                )
            })
        }
      </div>
      {/* //displaying cards */}
      <div className='hidden lg:block lg:h-[200px]'></div>
      {/* couses card ka grp */}
      <div className='lg:absolute gap-10 justify-center lg:gap-0 flex lg:justify-between flex-wrap w-full lg:bottom-[0] lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[50%] text-black lg:mb-0 mb-7 lg:px-0 px-3'>
        {
            courses.map((course,index)=>{
                return (
                    
                        <Coursecard
                        key={index}
                        cardData={course}
                        currentCard={currentcard}
                        setCurrentCard={setcurrentcard}/>

                )
            })
        }
      </div>
    </div>
  )
}

export default Exploremore
