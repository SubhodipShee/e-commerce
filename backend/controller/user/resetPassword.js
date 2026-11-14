const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const userModel = require("../../models/userModel")

async function resetPasswordController(req,res){
    try{
        const { token, password } = req.body

        if(!token){
            throw new Error("Reset link is invalid")
        }
        if(!password){
            throw new Error("Please provide Password")
        }

        // find user by hashed token that is not expired yet
        const user = await userModel.findOne({
            resetPasswordToken : crypto.createHash("sha256").update(token).digest("hex"),
            resetPasswordExpire : { $gt : Date.now() }
        })

        if(!user){
            throw new Error("Reset link is invalid or expired")
        }

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hashSync(password, salt);

        user.password = hashPassword
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined
        await user.save()

        res.json({
            message : "Password reset successfully, please login",
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

module.exports = resetPasswordController
