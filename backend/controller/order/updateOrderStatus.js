const orderModel = require("../../models/orderModel")
const uploadProductPermission = require("../../helpers/permission")

const ORDER_STATUS = ["PLACED","SHIPPED","DELIVERED","CANCELLED"]

const updateOrderStatusController = async(req,res)=>{
    try{
        if(!await uploadProductPermission(req.userId)){
            throw new Error("Permission denied")
        }

        const { _id, orderStatus } = req.body

        if(!ORDER_STATUS.includes(orderStatus)){
            throw new Error("Invalid order status")
        }

        const updateOrder = await orderModel.findByIdAndUpdate(_id,{ orderStatus : orderStatus },{ new : true })

        res.json({
            data : updateOrder,
            message : "Order status updated",
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

module.exports = updateOrderStatusController
