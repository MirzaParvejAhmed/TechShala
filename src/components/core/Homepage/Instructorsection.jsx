import React from 'react'
import instructor from "../../../assets/images/Instructor.png"
import HighlightText from './HighlightText'
import CTAButton from "./Button"
import { FaArrowRight } from 'react-icons/fa6'
const Instructorsection = () => {
  return (
    <div >
      <div className='flex lg:flex-row flex-col gap-20 items-center'>

        <div className='w-[50%]'> 
        <img src={instructor} alt="Intructor" className='shadow-[-20px_-20px_0_rgba(255,255,255,1),4px_10px_15px_#9966ff] '/>
        </div>
        
        <div className='lg:w-[50%] flex gap-10 flex-col'>
            <h1 className='lg:w-[100%] text-4xl font-semibold'>Become an <HighlightText text={"Instructor"}/>
            </h1>
            <p className='font-medium text-[16px] text-justify w-[90%] text-richblack-300'>
            Instructors from around the world teach millions of students on TechShala. 
            We provide the tools and skills to teach what you love.
            </p>

            <div className='w-fit'>
            <CTAButton active={true} linkto={"/signup"}>
            <div className='flex  gap-3 items-center '>
                Start teaching today
                <FaArrowRight></FaArrowRight>
            </div>
            </CTAButton>
            </div>
        </div>

      </div>
    </div>
  )
}

export default Instructorsection
