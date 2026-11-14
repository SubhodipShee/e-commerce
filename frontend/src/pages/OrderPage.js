import React, { useEffect, useState } from 'react'
import moment from 'moment'
import SummaryApi from '../common'
import displayINRCurrency from '../helpers/displayCurrency'
import optimizeImage from '../helpers/optimizeImage'

const OrderPage = () => {
  const [data,setData] = useState([])
  const [loading,setLoading] = useState(true)

  const fetchOrderList = async()=>{
    const response = await fetch(SummaryApi.orderList.url,{
      method : SummaryApi.orderList.method,
      credentials : 'include'
    })
    const responseData = await response.json()

    setData(responseData?.data || [])
    setLoading(false)
  }

  useEffect(()=>{
    fetchOrderList()
  },[])

  return (
    <div className='container mx-auto p-4'>
      <h2 className='sectionHeading'>My Orders</h2>

      {
        loading && (
          <p className='text-lg text-center'>Loading ...</p>
        )
      }

      {
        !loading && data.length === 0 && (
          <p className='bg-white text-lg text-center p-8 rounded-xl border border-slate-100 text-slate-500'>No Order Found</p>
        )
      }

      <div className='grid gap-4'>
        {
          data.map((order)=>{
            return(
              <div className='bg-white rounded-xl border border-slate-100 shadow-sm p-4' key={order._id}>
                <div className='flex flex-wrap justify-between gap-2 border-b pb-2'>
                  <p className='font-medium'>{moment(order.createdAt).format('LL')}</p>
                  <p>Status : <span className='font-semibold text-purple-600'>{order.orderStatus}</span></p>
                </div>

                {
                  order.shippingAddress?.pincode && (
                    <p className='text-sm text-slate-600 pt-2'>
                      Deliver to : {order.shippingAddress.fullName}, {order.shippingAddress.addressLine}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                    </p>
                  )
                }

                <div className='grid gap-3 py-3'>
                  {
                    order.productDetails.map((product,index)=>{
                      return(
                        <div className='grid grid-cols-[80px,1fr] gap-3' key={product.productId+index}>
                          <div className='w-20 h-20 bg-slate-50 rounded-lg p-1'>
                            <img src={optimizeImage(product.productImage,150)} alt={product.productName} className='w-full h-full object-scale-down mix-blend-multiply'/>
                          </div>
                          <div>
                            <p className='font-medium text-ellipsis line-clamp-1'>{product.productName}</p>
                            <p className='text-slate-500'>Quantity : {product.quantity}</p>
                            <p className='text-green-600 font-medium'>{displayINRCurrency(product.sellingPrice)}</p>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>

                <div className='flex justify-between border-t pt-2 font-semibold text-lg'>
                  <p>Total</p>
                  <p>{displayINRCurrency(order.totalAmount)}</p>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default OrderPage
