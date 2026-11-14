import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { toast } from 'react-toastify'
import SummaryApi from '../common'
import ORDER_STATUS from '../common/orderStatus'
import displayINRCurrency from '../helpers/displayCurrency'

const AllOrders = () => {
  const [allOrder,setAllOrder] = useState([])

  const fetchAllOrder = async()=>{
    const response = await fetch(SummaryApi.allOrder.url,{
      method : SummaryApi.allOrder.method,
      credentials : 'include'
    })
    const dataResponse = await response.json()

    if(dataResponse.success){
      setAllOrder(dataResponse.data)
    }

    if(dataResponse.error){
      toast.error(dataResponse.message)
    }
  }

  const handleChangeStatus = async(id,orderStatus)=>{
    const response = await fetch(SummaryApi.updateOrderStatus.url,{
      method : SummaryApi.updateOrderStatus.method,
      credentials : 'include',
      headers : {
        "content-type" : "application/json"
      },
      body : JSON.stringify({
        _id : id,
        orderStatus : orderStatus
      })
    })
    const responseData = await response.json()

    if(responseData.success){
      toast.success(responseData.message)
      fetchAllOrder()
    }

    if(responseData.error){
      toast.error(responseData.message)
    }
  }

  useEffect(()=>{
    fetchAllOrder()
  },[])

  return (
    <div className='bg-white pb-4'>
      <table className='w-full userTable'>
        <thead>
          <tr className='bg-green-700 text-white'>
            <th>Sr.</th>
            <th>Customer</th>
            <th>Products</th>
            <th>Total</th>
            <th>Order Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {
            allOrder.map((order,index)=>{
              return(
                <tr key={order._id}>
                  <td>{index+1}</td>
                  <td>
                    <p>{order?.userId?.name}</p>
                    <p className='text-sm text-slate-500'>{order?.userId?.email}</p>
                  </td>
                  <td className='text-left px-2'>
                    {
                      order.productDetails.map((product,i)=>{
                        return(
                          <p className='text-sm text-ellipsis line-clamp-1' key={product.productId+i}>{product.productName} x {product.quantity}</p>
                        )
                      })
                    }
                  </td>
                  <td>{displayINRCurrency(order.totalAmount)}</td>
                  <td>{moment(order.createdAt).format('LL')}</td>
                  <td>
                    <select className='border px-2 py-1' value={order.orderStatus} onChange={(e)=>handleChangeStatus(order._id,e.target.value)}>
                      {
                        Object.values(ORDER_STATUS).map(el =>{
                          return(
                            <option value={el} key={el}>{el}</option>
                          )
                        })
                      }
                    </select>
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </table>

      {
        allOrder.length === 0 && (
          <p className='text-center p-4'>No Order Found</p>
        )
      }
    </div>
  )
}

export default AllOrders
