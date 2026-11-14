const addToCartModel = require("../../models/cartProduct")
const productModel = require("../../models/productModel")

const addToCartController = async(req,res)=>{
    try{
        const { productId } = req?.body
        const currentUser = req.userId

        const product = await productModel.findById(productId).select("stock").lean()

        if(product?.stock === 0){
            return res.json({
                message : "Product is out of stock",
                success : false,
                error : true
            })
        }

        const isProductAvailable = await addToCartModel.findOne({ productId, userId : currentUser })

        if(isProductAvailable){
            return res.json({
                message : "Already exits in Add to cart",
                success : false,
                error : true
            })
        }

        const payload  = {
            productId : productId,
            quantity : 1,
            userId : currentUser,
        }
        const newAddToCart = new addToCartModel(payload)
        const saveProduct = await newAddToCart.save()

        return res.json({
            data : saveProduct,
            message : "Product Added in Cart",
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
module.exports = addToCartController