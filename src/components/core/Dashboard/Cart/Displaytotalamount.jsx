import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Iconbutton from '../../../common/Iconbutton';
import { useNavigate } from 'react-router-dom';
import { BuyCourse } from '../../../../services/operations/studentFeaturesAPI';

const Displaytotalamount = () => {
    const {total}=useSelector((state)=>state.cart);
    const {cart}=useSelector((state)=>state.cart)
    const { token } = useSelector((state) => state.auth)
    const { user } = useSelector((state) => state.profile)
    const navigate = useNavigate()
    const dispatch = useDispatch()
  
    const handlebuycourse=()=>{
        const courses=cart.map((course)=>course._id);
        BuyCourse(token,courses,user,navigate,dispatch)
    }

  return (
    <div className="min-w-[280px] rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="mb-1 text-sm font-medium text-richblack-300">Total:</p>
      <p className="mb-6 text-3xl font-medium text-yellow-100"> ₹ {total}</p>
      <Iconbutton 
      text="Buy Now"
      onClick={handlebuycourse}
      customClasses="w-full justify-center"/>
    </div>
  )
}

export default Displaytotalamount
