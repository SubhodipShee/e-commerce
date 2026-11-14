const bcrypt = require('bcryptjs')
const userModel = require("../../models/userModel")

async function changePasswordController(req,res){
    try{
        const { oldPassword, newPassword } = req.body

        if(!oldPassword || !newPassword){
            throw new Error("Please provide old and new password")
        }

        const user = await userModel.findById(req.userId)

        if(!user){
            throw new Error("User not found")
        }

        const checkPassword = await bcrypt.compare(oldPassword,user.password)

        if(!checkPassword){
            throw new Error("Old password is incorrect")
        }

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hashSync(newPassword, salt);

        user.password = hashPassword
        await user.save()

        res.json({
            message : "Password changed successfully",
            success : true,
            error : false
        })

    }catch(err){
        res.json({
            message : err.message || err,
            error : true,
            success : false
        })
    }
}

module.exports = changePasswordController
