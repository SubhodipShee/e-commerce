import React from 'react'
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

// shows 5 stars for a rating like 4.3 (full, half and empty stars)
const RatingStars = ({ rating = 0 }) => {
  return (
    <div className='text-yellow-400 flex items-center gap-1'>
      {
        [1,2,3,4,5].map(star =>{
          if(rating >= star){
            return <FaStar key={star}/>
          }
          if(rating >= star - 0.5){
            return <FaStarHalfAlt key={star}/>
          }
          return <FaRegStar key={star}/>
        })
      }
    </div>
  )
}

export default RatingStars
