import React from 'react'
import HighlightText from './HighlightText'
import know_your_progress from '../../../assets/images/Know_your_progress.png'
import Compare_with_others from '../../../assets/images/Compare_with_others.png'
import PlanYourlessons from '../../../assets/images/Plan_your_lessons.png'
import CTAButton from "../Homepage/Button"
const LearninglangauageSection = () => {
  return (
    <div>
      <div className='flex flex-col gap-5 items-center my-10'>
        <div className='text-4xl font-semibold text-center '>
          Your Swiss Knife for
          <HighlightText text={"learning any language"}/>
        </div>

        <div className='text-center font-medium text-richblack-700  lg:w-[70%] mx-auto leading-6 text-base -mt-0'>
        Using spin making learning multiple languages easy. with 20+ languages realistic voice-over, progress tracking, custom schedule and more.
        </div>

        <div className='flex flex-row items-center justify-center mt-8 lg:mt-0'>
          <img src={know_your_progress} alt='know your progress' className='object-contain lg:-mr-32 ' />
          <img src={Compare_with_others} alt='Compare_with_others' className='object-contain lg:-mb-10 lg:-mt-0 -mt-12' />
          <img src={PlanYourlessons} alt='Plan_Your_lessons' className='object-contain lg:-ml-36 lg:-mt-5 -mt-16' />
        </div>

        <div className='w-fit mx-auto lg:mb-20 mb-8 -mt-5'>
         <CTAButton active={true} linkto={"/signup"}>
         <p>Learn more</p>
         </CTAButton>
        </div>

      </div>

    </div>
  )
}

export default LearninglangauageSection
