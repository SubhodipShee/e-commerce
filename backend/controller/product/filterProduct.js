const productModel = require("../../models/productModel")

const filterProductController = async(req,res)=>{
    try{
           const categoryList = req?.body?.category || []
           const { minPrice, maxPrice, sortBy } = req?.body || {}

           // page number and products per page (max 50)
           const page = Math.max(Number(req?.body?.page) || 1, 1)
           const limit = Math.min(Number(req?.body?.limit) || 20, 50)

           const filter = {
               category :  {
                   "$in" : categoryList
               },
               // price range on selling price, only if given
               ...((minPrice || maxPrice) && {
                   sellingPrice : {
                       ...(minPrice && { "$gte" : Number(minPrice) }),
                       ...(maxPrice && { "$lte" : Number(maxPrice) })
                   }
               })
           }

           const sort = sortBy === 'asc' ? { sellingPrice : 1 } : sortBy === 'dsc' ? { sellingPrice : -1 } : { createdAt : -1 }

           // only the fields needed by product cards
           const [product, totalProduct] = await Promise.all([
               productModel.find(filter)
                   .select("productName category productImage price sellingPrice")
                   .sort(sort)
                   .skip((page - 1) * limit)
                   .limit(limit)
                   .lean(),
               productModel.countDocuments(filter)
           ])

           res.json({
               data : product,
               totalProduct : totalProduct,
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