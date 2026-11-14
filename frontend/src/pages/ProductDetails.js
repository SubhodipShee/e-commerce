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
      <div className=' min-h-[200px] flex flex-col lg:flex-row gap-4'>
        {/***product image */}
        <div className='h-96 flex flex-col lg:flex-row-reverse gap-4'>

            <div className='h-[300px] w-[300px] lg:h-96 lg:w-96 bg-slate-200 relative'>
                <img src={activeImage} className='h-full w-full object-scale-down mix-blend-multiply' onMouseMove={handleZoomImage} onMouseLeave={handleLeaveImageZoom}/>

              {/***product zoom */}
              {
                zoomImage && (
                  <div className='hidden lg:block absolute min-w-[500px] overflow-hidden min-h-[400px] bg-slate-200 p-1 -right-[510px] top-0'>
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
                          <div className='h-20 w-20 bg-slate-200 rounded p-1' key={imgURL}>
                            <img src={optimizeImage(imgURL,150)} className='w-full h-full object-scale-down mix-blend-multiply cursor-pointer' onMouseEnter={()=>handleMouseEnterProduct(imgURL)} onClick={()=>handleMouseEnterProduct(imgURL)}/>
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
            <div className='flex flex-col gap-1'>
                <p className='bg-purple-200 text-purple-600 px-2 rounded-full inline-block w-fit'>{data?.brandName}</p>
                <h2 className='text-2xl lg:text-4xl font-medium'>{data?.productName}</h2>
                <p className='capitalize text-slate-400'>{data?.category}</p>

                <div className='flex items-center gap-2'>
                    <RatingStars rating={reviewData.averageRating}/>
                    <p className='text-sm text-slate-500'>{reviewData.averageRating} ({reviewData.totalReview} reviews)</p>
                </div>

                <div className='flex items-center gap-2 text-2xl lg:text-3xl font-medium my-1'>
                  <p className='text-green-600'>{displayINRCurrency(data.sellingPrice)}</p>
                  <p className='text-slate-400 line-through'>{displayINRCurrency(data.price)}</p>
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
                  <button disabled={data?.stock === 0} className='border-2 border-purple-600 rounded px-3 py-1 min-w-[120px] text-purple-600 font-medium hover:bg-purple-600 hover:text-white disabled:opacity-50 disabled:pointer-events-none' onClick={(e)=>handleBuyProduct(e,data?._id)} >Buy</button>
                  <button disabled={data?.stock === 0} className='border-2 border-purple-600 rounded px-3 py-1 min-w-[120px] font-medium text-white bg-purple-600 hover:text-purple-600 hover:bg-white disabled:opacity-50 disabled:pointer-events-none' onClick={(e)=>handleAddToCart(e,data?._id)}>Add To Cart</button>
                  <button className='border-2 border-purple-600 rounded p-2 text-purple-600 hover:bg-purple-600 hover:text-white' title='Add to Wishlist' onClick={(e)=>addToWishlist(e,data?._id)}><FaRegHeart/></button>
                </div>

                <div>
                  <p className='text-slate-600 font-medium my-1'>Description : </p>
                  <p>{data?.description}</p>
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