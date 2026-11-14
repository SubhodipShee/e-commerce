const reviewModel = require("../../models/reviewModel")

const getProductReviewController = async(req,res)=>{
    try{
        const { productId } = req.body

        // all reviews of the product with reviewer name, newest first
        const reviews = await reviewModel.find({ productId })
            .populate("userId","name")
            .sort({ createdAt : -1 })
            .lean()

        const totalReview = reviews.length
        const totalRating = reviews.reduce((preve,curr)=> preve + curr.rating,0)
        const averageRating = totalReview ? Number((totalRating / totalReview).toFixed(1)) : 0

        res.json({
            data : {
                reviews : reviews,
                averageRating : averageRating,
                totalReview : totalReview
            },
            message : "Product review",
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

module.exports = getProductReviewController
