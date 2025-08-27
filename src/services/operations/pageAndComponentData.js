import React from 'react'
import toast from 'react-hot-toast'
import { apiConnector } from '../apiconnector'
import { catalogData } from '../api'

//get categories page details api call krega bs ye fucntion
const getCatelogPageData = async(categoryId) => {
    const toastId=toast.loading("Loading...")
    let result=[];
    try {
        const response=await apiConnector("POST",catalogData.CATALOGPAGEDATA_API,
            {categoryid:categoryId});

        if(!response?.data?.success){
            throw new Error("could not fetch category page details");
        }
        result=response?.data
        //console.log("result---->",result)
        
    } 
    catch (error) {
        console.log("Catalog page data api error....",error)
        toast.error(error.message)
        result=error.response?.data
    }
    toast.dismiss(toastId)
    return result
}


export default getCatelogPageData
