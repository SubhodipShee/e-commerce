import React,{useCallback, useContext, useEffect, useState} from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import SummaryApi from '../common'
import displayINRCurrency from '../helpers/displayCurrency';
import VerticalCardProduct from '../components/VerticalCardProduct';
import CategroyWiseProductDisplay from '../components/CategoryWiseProductDisplay';
import addToCart from '../helpers/addToCart';
import addToWishlist from '../helpers/addToWishlist';
import { FaRegHeart } from "react-icons/fa6";
import Context from '../context';
import optimizeImage from '../helpers/optimizeImage';
import discountPercent from '../helpers/discountPercent';
import RatingStars from '../components/RatingStars';
import ProductReview from '../components/ProductReview';

const ProductDetails = () => {
  const [data,setData] = useState({
    productName : "",
    brandName : "",
    category : "",
    productImage : [],
    description : "",
    price : "",
    sellingPrice : ""
  })
  const params = useParams()
  const [loading,setLoading] = useState(true)
  const productImageListLoading = new Array(4).fill(null)
  const [activeImage,setActiveImage] = useState("")

  const [zoomImageCoordinate,setZoomImageCoordinate] = useState({
    x : 0,
    y : 0
  })
  const [zoomImage,setZoomImage] = useState(false)
  const [reviewData,setReviewData] = useState({
    reviews : [],
    averageRating : 0,
    totalReview : 0
  })
  const { fetchUserAddToCart } = useContext(Context)

  const navigate = useNavigate()

  const fetchProductDetails = async()=>{
    const response = await fetch(SummaryApi.productDetails.url,{
      method : SummaryApi.productDetails.method,
      headers : {
        "content-type" : "application/json"
      },
      body : JSON.stringify({
        productId : params?.id
      })
    })
    const dataReponse = await response.json()

    setData(dataReponse?.data)
    setActiveImage(dataReponse?.data?.productImage[0])
    setLoading(false)

  }

  const fetchProductReview = async()=>{
    const response = await fetch(SummaryApi.productReview.url,{
      method : SummaryApi.productReview.method,
      headers : {
        "content-type" : "application/json"
      },
      body : JSON.stringify({
        productId : params?.id
      })
    })
    const dataResponse = await response.json()

    if(dataResponse.success){
      setReviewData(dataResponse.data)
    }
  }

  useEffect(()=>{
    fetchProductDetails()
    fetchProductReview()
  },[params])

  const handleMouseEnterProduct = (imageURL)=>{
    setActiveImage(imageURL)
  }
  const handleZoomImage = useCallback((e) =>{
    setZoomImage(true)
    const { left , top, width , height } = e.target.getBoundingClientRect()

    const x = (e.clientX - left) / width
    const y = (e.clientY - top) / height

    setZoomImageCoordinate({
      x,
      y
    })
    
  },[zoomImageCoordinate])

  const handleLeaveImageZoom = ()=>{
    setZoomImage(false)
  }

  const handleAddToCart = async(e,id) =>{
    await addToCart(e,id)
    fetchUserAddToCart()
  }

  const handleBuyProduct = async(e,id)=>{
    await addToCart(e,id)
    fetchUserAddToCart()
    navigate("/cart")

  }
  return (
    <div className='container mx-auto p-4'>
      <div className=' min-h-[200px] flex flex-col lg:flex-row gap-6 lg:gap-10'>
        {/***product image */}
        <div className='h-96 flex flex-col lg:flex-row-reverse gap-4'>

            <div className='h-[300px] w-[300px] lg:h-96 lg:w-96 bg-white rounded-2xl border border-slate-100 shadow-sm relative'>
                <img src={activeImage} alt={data?.productName} className='h-full w-full object-scale-down mix-blend-multiply p-4 cursor-zoom-in' onMouseMove={handleZoomImage} onMouseLeave={handleLeaveImageZoom}/>

              {/***product zoom */}
              {
                zoomImage && (
                  <div className='hidden lg:block absolute z-20 min-w-[500px] overflow-hidden min-h-[400px] bg-white rounded-2xl border border-slate-100 shadow-xl p-1 -right-[510px] top-0'>
                    <div
                      className='w-full h-full min-h-[400px] min-w-[500px] mix-blend-multiply scale-150'
                      style={{
                      background : `url(${activeImage})`,
                      backgroundRepeat : 'no-repeat',
                      backgroundPosition : `${zoomImageCoordinate.x * 100}% ${zoomImageCoordinate.y * 100}% `

                    }}
                  >

                  </div>
                </div>
                )
              }
              
            </div>

          <div className='h-full'>
              {
                loading ? (
                  <div className='flex gap-2 lg:flex-col overflow-scroll scrollbar-none h-full'>
                    {
                        productImageListLoading.map((el,index) =>{
                          return(
                            <div className='h-20 w-20 bg-slate-200 rounded animate-pulse' key={"loadingImage"+index}>
      
                            </div>
                          )
                        })
                    }
                  </div> 
                    
                ):(
                  <div className='flex gap-2 lg:flex-col overflow-scroll scrollbar-none h-full'>
                  {
                      data.productImage.map((imgURL,index) =>{
                        return(
                          <div className={`h-20 w-20 bg-white border rounded-lg p-1 transition ${activeImage === imgURL ? 'border-purple-500 ring-2 ring-purple-200' : 'border-slate-200 hover:border-purple-300'}`} key={imgURL}>
                            <img src={optimizeImage(imgURL,150)} alt={data?.productName} className='w-full h-full object-scale-down mix-blend-multiply cursor-pointer' onMouseEnter={()=>handleMouseEnterProduct(imgURL)} onClick={()=>handleMouseEnterProduct(imgURL)}/>
                          </div>
                        )
                      })
                  }
                </div> 
                )
              }
          </div>
        </div>

        {/***product deatils */}
        {
          loading ? (
            <div className='grid gap-1 w-full'>
                <p className='bg-slate-200 animate-pulse  h-6 lg:h-8 w-full rounded-full inline-block'></p>
                <h2 className='text-2xl lg:text-4xl font-medium h-6 lg:h-8  bg-slate-200 animate-pulse w-full'></h2>
                <p className='capitalize text-slate-400 bg-slate-200 min-w-[100px] animate-pulse h-6 lg:h-8  w-full'></p>

                <div className='text-purple-600 bg-slate-200 h-6 lg:h-8  animate-pulse flex items-center gap-1 w-full'>
    
                </div>

                <div className='flex items-center gap-2 text-2xl lg:text-3xl font-medium my-1 h-6 lg:h-8  animate-pulse w-full'>
                  <p className='text-purple-600 bg-slate-200 w-full'></p>
                  <p className='text-slate-400 line-through bg-slate-200 w-full'></p>
                </div>

                <div className='flex items-center gap-3 my-2 w-full'>
                  <button className='h-6 lg:h-8  bg-slate-200 rounded animate-pulse w-full'></button>
                  <button className='h-6 lg:h-8  bg-slate-200 rounded animate-pulse w-full'></button>
                </div>

                <div className='w-full'>
                  <p className='text-slate-600 font-medium my-1 h-6 lg:h-8   bg-slate-200 rounded animate-pulse w-full'></p>
                  <p className=' bg-slate-200 rounded animate-pulse h-10 lg:h-12  w-full'></p>
                </div>
              </div>
          ):
          (
            <div className='flex flex-col gap-2'>
                <p className='bg-purple-100 text-purple-700 text-sm font-medium px-3 py-0.5 rounded-full inline-block w-fit'>{data?.brandName}</p>
                <h2 className='text-2xl lg:text-3xl font-bold text-slate-800'>{data?.productName}</h2>
                <p className='capitalize text-slate-500'>{data?.category}</p>

                <div className='flex items-center gap-2'>
                    <RatingStars rating={reviewData.averageRating}/>
                    <p className='text-sm text-slate-500'>{reviewData.averageRating} ({reviewData.totalReview} reviews)</p>
                </div>

                <div className='flex flex-wrap items-baseline gap-x-3 my-1'>
                  <p className='text-3xl font-bold text-slate-900'>{displayINRCurrency(data.sellingPrice)}</p>
                  <p className='text-lg text-slate-400 line-through'>{displayINRCurrency(data.price)}</p>
                  {
                    discountPercent(data?.price,data?.sellingPrice) > 0 && (
                      <p className='text-lg font-semibold text-green-600'>{discountPercent(data?.price,data?.sellingPrice)}% off</p>
                    )
                  }
                </div>

                {/**stock message (products without stock number are not tracked) */}
                {
                  data?.stock === 0 && (
                    <p className='text-red-600 font-medium'>Out of stock</p>
                  )
                }
                {
                  data?.stock > 0 && data?.stock <= 5 && (
                    <p className='text-orange-600 font-medium'>Only {data.stock} left in stock</p>
                  )
                }

                <div className='flex items-center gap-3 my-2'>
                  <button disabled={data?.stock === 0} className='border-2 border-purple-600 rounded-full px-6 py-2.5 min-w-[120px] text-purple-700 font-semibold hover:bg-purple-50 active:scale-95 transition disabled:opacity-50 disabled:pointer-events-none' onClick={(e)=>handleBuyProduct(e,data?._id)} >Buy Now</button>
                  <button disabled={data?.stock === 0} className='border-2 border-purple-600 rounded-full px-6 py-2.5 min-w-[120px] font-semibold text-white bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-600/30 active:scale-95 transition disabled:opacity-50 disabled:pointer-events-none' onClick={(e)=>handleAddToCart(e,data?._id)}>Add To Cart</button>
                  <button className='border-2 border-slate-200 rounded-full p-3 text-slate-600 hover:border-pink-400 hover:text-pink-500 active:scale-95 transition' title='Add to Wishlist' onClick={(e)=>addToWishlist(e,data?._id)}><FaRegHeart/></button>
                </div>

                <div className='mt-2 p-4 bg-white rounded-xl border border-slate-100'>
                  <p className='text-slate-800 font-semibold mb-1'>Description</p>
                  <p className='text-slate-600 leading-relaxed'>{data?.description}</p>
                </div>
              </div>
          )
        }
      </div>

      {
        data?._id && (
          <ProductReview productId={data._id} reviewData={reviewData} fetchReview={fetchProductReview}/>
        )
      }

      {
        data.category && (
          <CategroyWiseProductDisplay category={data?.category} heading={"Recommended Product"}/>
        )
      }
    </div>
  )
}

export default ProductDetails