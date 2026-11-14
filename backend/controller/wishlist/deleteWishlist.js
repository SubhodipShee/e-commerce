const wishlistModel = require("../../models/wishlistModel")

const deleteWishlistController = async(req,res)=>{
    try{
        const currentUserId = req.userId
        const wishlistId = req.body._id

        const deleteProduct = await wishlistModel.deleteOne({ _id : wishlistId, userId : currentUserId })

        res.json({
            message : "Product removed from wishlist",
            error : false,
            success : true,
            data : deleteProduct
        })
    }catch(err){
        res.json({
            message : err?.message || err,
            error : true,
            success : false
        })
    }
}

module.exports = deleteWishlistController
