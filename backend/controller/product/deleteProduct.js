const productModel = require('../../models/productModel')
const addToCartModel = require('../../models/cartProduct')
const wishlistModel = require('../../models/wishlistModel')
const uploadProductPermission = require('../../helpers/permission')

async function deleteProductController(req,res){
    try{
        if(!await uploadProductPermission(req.userId)){
            throw new Error("Permission denied")
        }

        const { _id } = req.body

        const deleteProduct = await productModel.findByIdAndDelete(_id)

        if(!deleteProduct){
            throw new Error("Product not found")
        }

        // remove the deleted product from every user's cart and wishlist
        await Promise.all([
            addToCartModel.deleteMany({ productId : _id }),
            wishlistModel.deleteMany({ productId : _id })
        ])

        res.json({
            message : "Product deleted successfully",
            data : deleteProduct,
            success : true,
            error : false
        })

    }catch(err){
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false
        })
    }
}
module.exports = deleteProductController
