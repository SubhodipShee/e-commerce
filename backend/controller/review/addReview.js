const reviewModel = require("../../models/reviewModel")
const productModel = require("../../models/productModel")

const addReviewController = async(req,res)=>{
    try{
        const currentUser = req.userId
        const { productId, rating, comment } = req.body

        if(![1,2,3,4,5].includes(Number(rating))){
            throw new Error("Please select a rating from 1 to 5")
        }

        if(comment && comment.length > 1000){
            throw new Error("Review is too long (max 1000 characters)")
        }

        const product = await productModel.findById(productId)

        if(!product){
            throw new Error("Product not found")
        }

        // if user already reviewed this product, update the old review
        const review = await reviewModel.findOneAndUpdate(
            { productId : productId, userId : currentUser },
            { rating : Number(rating), comment : comment?.trim() },
            { upsert : true, new : true }
        )

        res.json({
            data : review,
            message : "Review saved",
            success : true,
            error : false
        })

    }catch(err){
        res.json({
            message : err.message || err,
            error : true,
            success : false
        })
    }
}

module.exports = addReviewController
