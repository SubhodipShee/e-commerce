const productModel = require("../../models/productModel")

const filterProductController = async(req,res)=>{
    try{
           const categoryList = req?.body?.category || []
   
           // only the fields needed by product cards
           const product = await productModel.find({
               category :  {
                   "$in" : categoryList
               }
           })
           .select("productName category productImage price sellingPrice")
           .lean()
   
           res.json({
               data : product,
               message : "product",
               error : false,
               success : true
           })
    }catch(err){
       res.json({
           message : err.message || err,
           error : true,
           success : false
       })
    }
   }
   
module.exports = filterProductController