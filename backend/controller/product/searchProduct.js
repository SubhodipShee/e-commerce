const productModel = require("../../models/productModel")

const searchProduct = async(req,res)=>{
    try{
        const query = req.query.q || ""

        // escape special characters so the search text is matched as plain text
        const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

        const regex = new RegExp(safeQuery,'i')

        const product = await productModel.find({
            "$or" : [
                {
                    productName : regex
                },
                {
                    category : regex
                }
            ]
        })
        res.json({
            data  : product ,
            message : "Search Product list",
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
module.exports = searchProduct