import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import SummaryApi from '../common'
import ORDER_STATUS from '../common/orderStatus'
import displayINRCurrency from '../helpers/displayCurrency'

const AdminDashboard = () => {
  const [data,setData] = useState(null)

  const fetchDashboard = async()=>{
    const response = await fetch(SummaryApi.dashboard.url,{
      method : SummaryApi.dashboard.method,
      credentials : 'include'
    })
    const dataResponse = await response.json()

    if(dataResponse.success){
      setData(dataResponse.data)
    }

    if(dataResponse.error){
      toast.error(dataResponse.message)
    }
  }

  useEffect(()=>{
    fetchDashboard()
  },[])

  if(!data){
    return <p className='text-lg text-center p-4'>Loading ...</p>
  }

  const summaryCard = [
    { label : "Total Revenue", value : displayINRCurrency(data.totalRevenue) },
    { label : "Paid Orders", value : data.totalOrder },
    { label : "Users", value : data.totalUser },
    { label : "Products", value : data.totalProduct },
    { label : "Out of Stock", value : data.outOfStockProduct }
  ]

  return (
    <div className='p-2'>
      <h2 className='font-bold text-lg mb-3'>Dashboard</h2>

      <div className='grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4'>
        {
          summaryCard.map(card =>{
            return(
              <div className='bg-white p-4 rounded customShadow' key={card.label}>
                <p className='text-slate-500'>{card.label}</p>
                <p className='text-2xl font-semibold'>{card.value}</p>
              </div>
            )
          })
        }
      </div>

      <h3 className='font-semibold text-lg mt-6 mb-3'>Orders by Status</h3>

      <div className='grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4'>
        {
          Object.values(ORDER_STATUS).map(status =>{
            return(
              <div className='bg-white p-4 rounded customShadow' key={status}>
                <p className='text-slate-500 capitalize'>{status.toLowerCase()}</p>
                <p className='text-2xl font-semibold'>{data.orderStatusCount[status] || 0}</p>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default AdminDashboard
