import React, { useState } from 'react'
import { Chart ,registerables} from "chart.js";
import { Pie } from 'react-chartjs-2';
Chart.register(...registerables)

const Instructorchart = ({courses}) => {

    // State to keep track of the currently selected chart
    const [currChart,setcurrChart]=useState("students");

    //fucntion to generate random colors
    const getrandomColors=(numColors)=>{

        const colors=[]
        for(let i=0;i<numColors;i++ ){
            const color=`rgb(${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)})`
            colors.push(color);
        }
        return colors;
    }
    //create data for chart displaying student info
    const chartstudentData = {
        labels:courses.map((course)=>course.coursename),
        datasets:[
            {
                data:courses.map((course)=>course.totalStudentsEnrolled),
                backgroundColor:getrandomColors(courses.length),
                
                borderWidth: 0, // Adjust thickness as needed
                borderColor: "transparent",

            }
        ]
    }


    //create data for chart displaying income info

    const chartincomeData = {
        labels:courses.map((course)=>course.coursename),
        datasets:[
            {
                data:courses.map((course)=>course.totalAmountGenerated),
                backgroundColor:getrandomColors(courses.length),
                borderWidth: 0,
                borderColor: "transparent"

            }
        ]

    }

    //options
    const options={
        maintainAspectRatio: false,
    };

  return (
    <div className="flex flex-1 flex-col gap-y-1 rounded-md bg-richblack-800 p-6">
      <p className="text-lg font-bold text-richblack-5">Visualize</p>
      <div className="space-x-4 font-semibold">
        {/* Button to switch to the "students" chart */}
        <button
          onClick={()=>setcurrChart("students")}
          className={`rounded-sm p-1 px-3 transition-all duration-200 ${
            currChart === "students"
              ? "bg-richblack-700 text-yellow-50"
              : "text-yellow-400"
          }`}
        >
            Student
        </button>
        <button onClick={()=>setcurrChart("income")}
        className={`rounded-sm p-1 px-3 transition-all duration-200 ${
            currChart === "income"
              ? "bg-richblack-700 text-yellow-50"
              : "text-yellow-400"
          }`}
        >
            Income
        </button>
      </div>
      <div className="w-full h-[600px]">
  <Pie
    data={currChart === "students" ? chartstudentData : chartincomeData}
    options={options}
  />
</div>
    </div>
  )
}

export default Instructorchart
