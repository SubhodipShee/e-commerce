const wishlistModel = require("../../models/wishlistModel")

const viewWishlistController = async(req,res)=>{
    try{
        const currentUser = req.userId

        const allProduct = await wishlistModel.find({ userId : currentUser })
            .populate("productId","productName category productImage price sellingPrice") // only fields used in wishlist page
            .sort({ createdAt : -1 })
            .lean()

        res.json({
            data : allProduct,
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

module.exports = viewWishlistController
