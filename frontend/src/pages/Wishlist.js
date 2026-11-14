import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MdDelete } from "react-icons/md";
import SummaryApi from '../common'
import Context from '../context'
import displayINRCurrency from '../helpers/displayCurrency'
import optimizeImage from '../helpers/optimizeImage'
import addToCart from '../helpers/addToCart'

const Wishlist = () => {
    const [data,setData] = useState([])
    const [loading,setLoading] = useState(true)
    const { fetchUserAddToCart } = useContext(Context)

    const fetchData = async() =>{
        const response = await fetch(SummaryApi.viewWishlist.url,{
            method : SummaryApi.viewWishlist.method,
            credentials : 'include'
        })
        const responseData = await response.json()

        // skip items whose product no longer exists
        setData((responseData?.data || []).filter(el => el.productId))
        setLoading(false)
    }

    useEffect(()=>{
        fetchData()
    },[])

    const deleteWishlistProduct = async(id)=>{
        const response = await fetch(SummaryApi.deleteWishlist.url,{
            method : SummaryApi.deleteWishlist.method,
            credentials : 'include',
            headers : {
                "content-type" : 'application/json'
            },
            body : JSON.stringify(
                { _id : id }
            )
        })
        const responseData = await response.json()

        if(responseData.success){
            fetchData()
        }
    }

    const handleAddToCart = async(e,id)=>{
        await addToCart(e,id)
        fetchUserAddToCart()
    }

  return (
    <div className='container mx-auto p-4'>
        <h2 className='text-2xl font-semibold py-4'>My Wishlist</h2>

        {
            loading && (
                <p className='text-lg text-center'>Loading ...</p>
            )
        }

        {
            !loading && data.length === 0 && (
                <p className='bg-white text-lg text-center p-4'>Your wishlist is empty</p>
            )
        }

        <div className='grid gap-3 max-w-3xl'>
            {
                data.map(product =>{
                    return(
                        <div className='w-full bg-white h-32 border border-slate-300 rounded grid grid-cols-[128px,1fr]' key={product._id}>
                            <Link to={"/product/"+product.productId._id} className='w-32 h-32 bg-slate-200'>
                                <img src={optimizeImage(product.productId.productImage[0],250)} alt={product.productId.productName} className='w-full h-full object-scale-down mix-blend-multiply'/>
                            </Link>
                            <div className='px-4 py-2 relative'>
                                {/**remove from wishlist */}
                                <div className='absolute right-0 text-red-600 rounded-full p-2 hover:bg-red-600 hover:text-white cursor-pointer' onClick={()=>deleteWishlistProduct(product._id)}>
                                    <MdDelete/>
                                </div>
                                <Link to={"/product/"+product.productId._id}>
                                    <h2 className='text-lg lg:text-xl text-ellipsis line-clamp-1 pr-8'>{product.productId.productName}</h2>
                                </Link>
                                <p className='capitalize text-slate-500'>{product.productId.category}</p>
                                <div className='flex gap-3'>
                                    <p className='text-green-600 font-medium'>{displayINRCurrency(product.productId.sellingPrice)}</p>
                                    <p className='text-slate-500 line-through'>{displayINRCurrency(product.productId.price)}</p>
                                </div>
                                <button className='text-sm bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-full mt-1' onClick={(e)=>handleAddToCart(e,product.productId._id)}>Add to Cart</button>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    </div>
  )
}

export default Wishlist
