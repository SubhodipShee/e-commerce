import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import SummaryApi from '../common'
import VerticalCardProduct from '../components/VerticalCardProduct'
import VerticalCard from '../components/VerticalCard'


const SearchProduct = () => {
    const query = useLocation()
    const [data,setData] = useState([])
    const [loading,setLoading] = useState(false)


    const fetchProduct = async()=>{
        setLoading(true)
        const response = await fetch(SummaryApi.searchProduct.url+query.search)
        const dataResponse = await response.json()
        setLoading(false)
        setData(dataResponse.data)

    }
    useEffect(()=>{
        // wait until the user stops typing, then search once (not on every key press)
        const timer = setTimeout(()=>{
            fetchProduct()
        },400)

        return ()=> clearTimeout(timer)
    },[query])

  return (
    <div className='container mx-auto p-4'>
        {
            loading &&(
                <p className='text-lg text-center'>Loading ...</p>
            )
        }
        <p className='text-lg font-semibold my-3'>Search Results : {data.length}</p>
        {
            data.length === 0 && !loading && (
                <p className='bg-white text-lg text-center p-8 rounded-xl border border-slate-100 text-slate-500'>No products found. Try a different search.</p>
            )
        }

        {
            data.length !==0 && !loading &&(
                <VerticalCard loading={loading} data={data}/>
            )
        }
        
    </div>
  )
}

export default SearchProduct
