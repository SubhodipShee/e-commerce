const wishlistModel = require("../../models/wishlistModel")

const addToWishlistController = async(req,res)=>{
    try{
        const { productId } = req?.body
        const currentUser = req.userId

        const isProductAvailable = await wishlistModel.findOne({ productId, userId : currentUser })

        if(isProductAvailable){
            return res.json({
                message : "Already exists in wishlist",
                success : false,
                error : true
            })
        }

        const newWishlist = new wishlistModel({
            productId : productId,
            userId : currentUser
        })
        const saveProduct = await newWishlist.save()

        return res.json({
            data : saveProduct,
            message : "Product added in wishlist",
            success : true,
            error : false
        })

    }catch(err){
        res.json({
            message : err?.message || err,
            error : true,
            success : false
        })
    }
}

module.exports = addToWishlistController
