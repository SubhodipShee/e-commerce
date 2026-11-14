import React, { useContext, useEffect, useState } from 'react'
import SummaryApi from '../common'
import Context from '../context'
import displayINRCurrency from '../helpers/displayCurrency'
import { MdDelete } from "react-icons/md";
import optimizeImage from '../helpers/optimizeImage'
import loadRazorpayScript from '../helpers/loadRazorpayScript'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'


const Cart = () => {
    const [data,setData] = useState([])
    const [loading,setLoading] = useState(false)
    const context = useContext(Context)
    const loadingCart = new Array(context.cartProductCount).fill(null)
    const user = useSelector(state => state?.user?.user)
    const navigate = useNavigate()

    const fetchData = async() =>{
       
        const response = await fetch(SummaryApi.addToCartProductView.url,{
            method : SummaryApi.addToCartProductView.method,
            credentials : 'include',
            headers : {
                "content-type" : 'application/json'
            },
        })
        

        const responseData = await response.json()

        if(responseData.success){
            setData(responseData.data)
        }
    }

    const handleLoading = async() =>{
        setLoading(true)
        await fetchData()
        setLoading(false)
    }

    useEffect(()=>{
        handleLoading()
    },[])

    const increaseQty = async(id,qty) =>{
        const response = await fetch(SummaryApi.updateCartProduct.url,{
            method : SummaryApi.updateCartProduct.method,
            credentials : 'include',
            headers : {
                "content-type" : 'application/json'
            },
            body : JSON.stringify(
                {   
                    _id : id,
                    quantity : qty + 1
                }
            )
        })
        const responseData = await response.json()

        if(responseData.success){
            fetchData()
        }
    }
    const decraseQty = async(id,qty)=>{
        if(qty >= 2){
            const response = await fetch(SummaryApi.updateCartProduct.url,{
                method : SummaryApi.updateCartProduct.method,
                credentials : 'include',
                headers : {
                "content-type" : 'application/json'
                },
                body : JSON.stringify(
                {   
                    _id : id,
                    quantity : qty - 1
                }
                )
            })
            const responseData = await response.json()

            if(responseData.success){
                fetchData()
                context.fetchUserAddToCart()
            }
       
        }
    }

    const deleteCartProduct = async(id)=>{
        const response = await fetch(SummaryApi.deleteCartProduct.url,{
            method : SummaryApi.deleteCartProduct.method,
            credentials : 'include',
            headers : {
                "content-type" : 'application/json'
            },
            body : JSON.stringify(
                {   
                    _id : id,
                }
            )
        })
        const responseData = await response.json()

        if(responseData.success){
            fetchData()
            context.fetchUserAddToCart()
        }
    }

    const verifyPayment = async(paymentResponse)=>{
        const response = await fetch(SummaryApi.verifyPayment.url,{
            method : SummaryApi.verifyPayment.method,
            credentials : 'include',
            headers : {
                "content-type" : 'application/json'
            },
            body : JSON.stringify(paymentResponse)
        })
        const responseData = await response.json()

        if(responseData.success){
            toast.success(responseData.message)
            context.fetchUserAddToCart()
            navigate("/order")
        }

        if(responseData.error){
            toast.error(responseData.message)
        }
    }

    const handlePayment = async()=>{
        const isScriptLoaded = await loadRazorpayScript()

        if(!isScriptLoaded){
            toast.error("Payment service failed to load, please try again")
            return
        }

        // create order on backend (amount is calculated there from the cart)
        const response = await fetch(SummaryApi.createOrder.url,{
            method : SummaryApi.createOrder.method,
            credentials : 'include',
            headers : {
                "content-type" : 'application/json'
            }
        })
        const responseData = await response.json()

        if(responseData.error){
            toast.error(responseData.message)
            return
        }

        const razorpay = new window.Razorpay({
            key : responseData.data.key,
            amount : responseData.data.amount,
            currency : responseData.data.currency,
            order_id : responseData.data.razorpayOrderId,
            name : "ElectroPlaza",
            description : "Order Payment",
            prefill : {
                name : user?.name,
                email : user?.email
            },
            theme : {
                color : "#9333ea"
            },
            handler : verifyPayment     // called by Razorpay after successful payment
        })

        razorpay.open()
    }

    const totalQty = data.reduce((previousValue,currentValue)=> previousValue + currentValue.quantity,0)
    const totalPrice = data.reduce((preve,curr)=> preve + (curr.quantity * curr?.productId?.sellingPrice) ,0)


  return (
    <div className='container mx-auto'>
      <div className='text-center text-lg my-3'>
      {
        data.length === 0 && !loading && (
            <p className='bg-white py-8 rounded-xl border border-slate-100 text-slate-500'>Your cart is empty</p>
        )
      }
      </div>

      <div className='flex flex-col lg:flex-row gap-10 lg:justify-between p-4'>
         {/***view product */}
        <div className='w-full max-w-3xl'>
            {
                loading?(
                    loadingCart?.map((el,index)=> {
                        return(
                            <div key={el+"Add To Cart Loading"+index} className='w-full bg-slate-200 h-32 my-3 animate-pulse rounded-xl'>
                            </div>
                        )
                    })
                    ) : (
                        data.map((product,index)=>{
                            return(
                                <div key={product?._id+"Add To Cart Loading"} className='w-full bg-white h-32 my-3 border border-slate-100 shadow-sm rounded-xl overflow-hidden grid grid-cols-[128px,1fr]'>
                                    <div className='w-32 h-32 bg-slate-50 p-2'>
                                        <img src={optimizeImage(product?.productId?.productImage[0],250)} alt={product?.productId?.productName} className='w-full h-full object-scale-down mix-blend-multiply'/>
                                    </div>
                                    <div className='px-4 py-2 relative'>
                                         {/**delete product */}
                                        <div className='absolute right-1 top-1 text-red-500 rounded-full p-2 hover:bg-red-500 hover:text-white cursor-pointer transition' onClick={()=>deleteCartProduct(product?._id)}>
                                            <MdDelete/>
                                        </div>
                                        <h2 className='text-base lg:text-lg font-semibold text-ellipsis line-clamp-1 pr-8'>{product?.productId?.productName}</h2>
                                        <p className='capitalize text-sm text-slate-500'>{product?.productId.category}</p>
                                        <div className='flex items-center justify-between'>
                                            <p className='text-slate-500 font-medium'>{displayINRCurrency(product?.productId?.sellingPrice)}</p>
                                            <p className='text-slate-900 font-bold text-lg'>{displayINRCurrency(product?.productId?.sellingPrice  * product?.quantity)}</p>
                                        </div>
                                        <div className='flex items-center gap-3 mt-1'>
                                            <button className='border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white w-7 h-7 flex justify-center items-center rounded-full transition active:scale-90' onClick={()=>decraseQty(product?._id,product?.quantity)}>-</button>
                                            <span className='font-semibold w-4 text-center'>{product?.quantity}</span>
                                            <button className='border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white w-7 h-7 flex justify-center items-center rounded-full transition active:scale-90' onClick={()=>increaseQty(product?._id,product?.quantity)}>+</button>
                                        </div> 
                                    </div> 
                                </div> 
                            )   
                        })
                )
            }
        </div>


         {/***summary  */}
         <div className='mt-5 lg:mt-0 w-full max-w-sm'>
         {/***delivery address */}
         {
            !loading && data.length > 0 && (
                <div className='bg-white p-4 mb-4 rounded-xl border border-slate-100 shadow-sm'>
                    <div className='flex items-center justify-between'>
                        <h3 className='font-semibold'>Deliver to</h3>
                        <Link to={"/profile"} className='text-sm text-purple-600 hover:underline'>{ user?.address?.pincode ? "Change" : "Add address" }</Link>
                    </div>
                    {
                        user?.address?.pincode ? (
                            <div className='text-sm text-slate-600 mt-1'>
                                <p className='font-medium text-slate-800'>{user.address.fullName}, {user.address.phone}</p>
                                <p>{user.address.addressLine}</p>
                                <p>{user.address.city}, {user.address.state} - {user.address.pincode}</p>
                            </div>
                        ) : (
                            <p className='text-sm text-red-600 mt-1'>Please add a delivery address before payment</p>
                        )
                    }
                </div>
            )
         }
         {
            loading ?(
                <div className='h-40 bg-slate-200 animate-pulse rounded-xl'>
                </div>
            ):(
                <div className='bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden lg:sticky lg:top-24'>
                    <h2 className='text-white bg-purple-600 px-4 py-2 font-semibold'>Order Summary</h2>
                    <div className='flex items-center justify-between px-4 pt-3 gap-2 font-medium text-slate-600'>
                        <p>Quantity</p>
                        <p>{totalQty}</p>
                    </div>
                    <div className='flex items-center justify-between px-4 py-2 gap-2 font-bold text-lg text-slate-900'>
                        <p>Total Price</p>
                        <p>{displayINRCurrency(totalPrice)}</p>
                    </div>
                    <div className='p-4 pt-1'>
                        <button className='bg-purple-600 hover:bg-purple-700 active:scale-95 transition rounded-full p-3 text-white font-semibold w-full shadow-lg shadow-purple-600/30' onClick={handlePayment}>Proceed to Pay</button>
                    </div>
                </div>
            )
         }
         </div>
       
      </div>
    </div>
  )
}

export default Cart
