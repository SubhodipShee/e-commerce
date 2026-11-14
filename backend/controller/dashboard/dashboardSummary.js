const userModel = require("../../models/userModel")
const productModel = require("../../models/productModel")
const orderModel = require("../../models/orderModel")
const uploadProductPermission = require("../../helpers/permission")

const dashboardSummaryController = async(req,res)=>{
    try{
        if(!await uploadProductPermission(req.userId)){
            throw new Error("Permission denied")
        }

        const [totalUser, totalProduct, outOfStockProduct, totalOrder, revenue, orderStatus] = await Promise.all([
            userModel.countDocuments(),
            productModel.countDocuments(),
            productModel.countDocuments({ stock : 0 }),
            orderModel.countDocuments({ paymentStatus : "PAID" }),

            // revenue from paid orders, cancelled orders not counted
            orderModel.aggregate([
                { $match : { paymentStatus : "PAID", orderStatus : { $ne : "CANCELLED" } } },
                { $group : { _id : null, total : { $sum : "$totalAmount" } } }
            ]),

            // number of paid orders in each status
            orderModel.aggregate([
                { $match : { paymentStatus : "PAID" } },
                { $group : { _id : "$orderStatus", count : { $sum : 1 } } }
            ])
        ])

        const orderStatusCount = {}
        orderStatus.forEach(el =>{
            orderStatusCount[el._id] = el.count
        })

        res.json({
            data : {
                totalUser : totalUser,
                totalProduct : totalProduct,
                outOfStockProduct : outOfStockProduct,
                totalOrder : totalOrder,
                totalRevenue : revenue[0]?.total || 0,
                orderStatusCount : orderStatusCount
            },
            message : "Dashboard summary",
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

module.exports = dashboardSummaryController
