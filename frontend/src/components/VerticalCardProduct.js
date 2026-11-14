import React, { useContext, useEffect, useRef, useState } from 'react'
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct'
import displayINRCurrency from '../helpers/displayCurrency'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import addToCart from '../helpers/addToCart'
import Context from '../context'
import optimizeImage from '../helpers/optimizeImage'
import discountPercent from '../helpers/discountPercent'


const VerticalCardProduct = ({category,heading}) => {
    const [data,setData] = useState([])
    const [loading,setLoading] = useState(true)
    const loadingList = new Array(13).fill(null)

    const [scroll,setScroll] = useState(0)
    const scrollElement = useRef()

    const { fetchUserAddToCart } = useContext(Context)
    const handleAddToCart = async(e,id)=>{
      await addToCart(e,id)
      fetchUserAddToCart()
    }


    const fetchData = async() =>{
      setLoading(true)
      const categoryProduct = await fetchCategoryWiseProduct(category)
      setLoading(false)

      setData(categoryProduct?.data)
    }
    useEffect(()=>{
      fetchData()
    },[])
    const scrollRight = () =>{
      scrollElement.current.scrollLeft += 300
    }
    const scrollLeft = () =>{
      scrollElement.current.scrollLeft -= 300
    }
  return (
    <div className='container mx-auto px-4 my-6 relative'>

        <h2 className='sectionHeading'>{heading}</h2>

        <div className='flex items-center gap-4 md:gap-6 overflow-x-scroll scrollbar-none scroll-smooth py-2' ref={scrollElement}>
        <button  className='bg-white shadow-md rounded-full p-2 absolute left-0 z-10 text-lg hidden md:block hover:bg-purple-600 hover:text-white transition'onClick={scrollLeft}><FaAngleLeft/></button>
        <button  className='bg-white shadow-md rounded-full p-2 absolute right-0 z-10 text-lg hidden md:block hover:bg-purple-600 hover:text-white transition'onClick={scrollRight}><FaAngleRight/></button>

        {
          loading ?(
            loadingList.map((product,index)=>{
              return(
                  <div className='w-full min-w-[280px]  md:min-w-[320px] max-w-[280px] md:max-w-[320px]  bg-white rounded-sm shadow ' key={"loading"+index}>
                      <div className='bg-slate-200 h-48 p-4 min-w-[280px] md:min-w-[145px] flex justify-center items-center animate-pulse'>
                      </div>
                      <div className='p-4 grid gap-3'>
                          <h2 className='font-medium text-base md:text-lg text-ellipsis line-clamp-1 text-black p-1 py-2 animate-pulse rounded-full bg-slate-200'></h2>
                          <p className='capitalize text-slate-500 p-1 animate-pulse rounded-full bg-slate-200  py-2'></p>
                          <div className='flex gap-3'>
                              <p className='text-red-600 font-medium p-1 animate-pulse rounded-full bg-slate-200 w-full  py-2'></p>
                              <p className='text-slate-500 line-through p-1 animate-pulse rounded-full bg-slate-200 w-full  py-2'></p>
                          </div>
                          <button className='text-sm  text-white px-3  rounded-full bg-slate-200  py-2 animate-pulse'></button>
                      </div>
                  </div>
              )
          })
          ):(
            data.map((product,index)=>{
              return(
                <Link to={"product/"+product?._id} className='w-full min-w-[280px]  md:min-w-[300px] max-w-[280px] md:max-w-[300px] bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden relative group cardHover' key={product?._id}>
                    {
                      discountPercent(product?.price,product?.sellingPrice) > 0 && (
                        <span className='absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full'>-{discountPercent(product?.price,product?.sellingPrice)}%</span>
                      )
                    }
                    <div className='bg-slate-50 h-48 p-4 flex justify-center items-center'>
                        <img src={optimizeImage(product.productImage[0])} loading='lazy' alt={product?.productName} className='object-scale-down h-full mix-blend-multiply group-hover:scale-110 transition-transform duration-500'/>
                    </div>


                    <div className='p-4 grid gap-2'>
                        <h2 className='font-semibold text-base text-ellipsis line-clamp-1 text-slate-800'>{product?.productName}</h2>
                        <p className='capitalize text-sm text-slate-500'>{product?.category}</p>
                        <div className='flex items-baseline gap-2'>
                          <p className='text-lg text-slate-900 font-bold'>{ displayINRCurrency(product?.sellingPrice) }</p>
                          <p className='text-sm text-slate-400 line-through'>{ displayINRCurrency(product?.price)  }</p>
                        </div>
                        <button className='text-sm bg-purple-600 hover:bg-purple-700 active:scale-95 transition text-white px-3 py-2 rounded-full font-medium' onClick={(e)=>handleAddToCart(e, product?._id)}>Add to Cart</button>
                    </div>
                </Link>
              )
            })
          )
         
        }
        </div>
       
    </div>
  )
}

export default VerticalCardProduct
