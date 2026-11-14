const orderModel = require("../../models/orderModel")
const uploadProductPermission = require("../../helpers/permission")

const allOrdersController = async(req,res)=>{
    try{
        if(!await uploadProductPermission(req.userId)){
            throw new Error("Permission denied")
        }

        // all paid orders with customer name and email, newest first
        const allOrders = await orderModel.find({ paymentStatus : "PAID" })
            .populate("userId","name email")
            .sort({ createdAt : -1 })
            .lean()

        res.json({
            data : allOrders,
            message : "All orders",
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

module.exports = allOrdersController
