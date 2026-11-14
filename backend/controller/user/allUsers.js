const userModel = require("../../models/userModel")
const uploadProductPermission = require("../../helpers/permission")


async function allUsers(req,res){
    try{
        if(!await uploadProductPermission(req.userId)){
            throw new Error("Permission denied")
        }

        const allUsers = await userModel.find().select("-password")

        res.json({
            message : "All User ",
            data : allUsers,
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
module.exports = allUsers