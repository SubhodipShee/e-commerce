const productModel = require('../../models/productModel')

const getCategoryProduct = async(req,res)=>{
    try{
        // one product from each category, fetched in a single query
        const productByCategory = await productModel.aggregate([
            { $group : { _id : "$category", product : { $first : "$$ROOT" } } },
            { $replaceRoot : { newRoot : "$product" } },
            { $sort : { category : 1 } }
        ])

        res.json({
            message : "category product",
            data : productByCategory,
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
module.exports = getCategoryProduct