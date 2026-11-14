import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaStar, FaRegStar } from "react-icons/fa";
import SummaryApi from '../common'
import RatingStars from './RatingStars'

const ProductReview = ({ productId, reviewData, fetchReview }) => {
  const user = useSelector(state => state?.user?.user)
  const [rating,setRating] = useState(0)
  const [comment,setComment] = useState("")

  // if user already reviewed this product, show their review in the form for editing
  const myReview = reviewData.reviews.find(el => el?.userId?._id === user?._id)

  useEffect(()=>{
    setRating(myReview?.rating || 0)
    setComment(myReview?.comment || "")
  },[productId, myReview])

  const handleSubmit = async(e) =>{
    e.preventDefault()

    if(!rating){
      toast.error("Please select a rating")
      return
    }

    const response = await fetch(SummaryApi.addReview.url,{
      method : SummaryApi.addReview.method,
      credentials : 'include',
      headers : {
        "content-type" : "application/json"
      },
      body : JSON.stringify({
        productId : productId,
        rating : rating,
        comment : comment
      })
    })
    const responseData = await response.json()

    if(responseData.success){
      toast.success(responseData.message)
      fetchReview()
    }
    if(responseData.error){
      toast.error(responseData.message)
    }
  }

  return (
    <div className='my-6'>
      <h2 className='text-2xl font-semibold py-4'>Ratings & Reviews</h2>

      <div className='flex flex-col lg:flex-row gap-6'>
        {/**write review */}
        <div className='bg-white p-4 rounded w-full lg:max-w-sm h-fit'>
          {
            user?._id ? (
              <form className='grid gap-2' onSubmit={handleSubmit}>
                <p className='font-medium'>{ myReview ? "Update your review" : "Write a review" }</p>

                <div className='flex gap-1 text-2xl text-yellow-400'>
                  {
                    [1,2,3,4,5].map(star =>{
                      return(
                        <button type='button' key={star} onClick={()=>setRating(star)}>
                          { rating >= star ? <FaStar/> : <FaRegStar/> }
                        </button>
                      )
                    })
                  }
                </div>

                <textarea
                  className='h-24 bg-slate-100 border resize-none p-1'
                  placeholder='share your experience with this product'
                  value={comment}
                  maxLength={1000}
                  onChange={(e)=>setComment(e.target.value)}
                />

                <button className='bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded'>
                  { myReview ? "Update Review" : "Submit Review" }
                </button>
              </form>
            ) : (
              <p>Please <Link to={"/login"} className='text-red-600 hover:text-red-700 hover:underline'>login</Link> to write a review</p>
            )
          }
        </div>

        {/**review list */}
        <div className='w-full grid gap-3 h-fit'>
          {
            reviewData.totalReview === 0 && (
              <p className='bg-white p-4'>No reviews yet. Be the first to review this product.</p>
            )
          }

          {
            reviewData.reviews.map(review =>{
              return(
                <div className='bg-white p-4 rounded' key={review._id}>
                  <div className='flex items-center justify-between gap-2'>
                    <p className='font-medium capitalize'>{review?.userId?.name}</p>
                    <p className='text-sm text-slate-500'>{new Date(review.createdAt).toLocaleDateString('en-IN')}</p>
                  </div>
                  <RatingStars rating={review.rating}/>
                  {
                    review.comment && (
                      <p className='mt-1 text-slate-700'>{review.comment}</p>
                    )
                  }
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default ProductReview
