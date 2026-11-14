const crypto = require('crypto')
const userModel = require("../../models/userModel")
const sendEmail = require("../../helpers/sendEmail")

async function forgotPasswordController(req,res){
    try{
        const { email } = req.body

        if(!email){
            throw new Error("Please provide email")
        }

        // same message whether the email exists or not, so nobody can check which emails are registered
        const message = "If this email is registered, a password reset link has been sent"

        const user = await userModel.findOne({ email })

        if(!user){
            return res.json({
                message : message,
                success : true,
                error : false
            })
        }

        // random token goes in the email link, only its hash is saved in database
        const resetToken = crypto.randomBytes(32).toString("hex")

        user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000     // valid for 15 minutes
        await user.save()

        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`

        try{
            await sendEmail({
                to : user.email,
                subject : "Reset your ElectroPlaza password",
                html : `
                    <p>Hi ${user.name},</p>
                    <p>Click the link below to reset your password. This link is valid for 15 minutes.</p>
                    <p><a href="${resetLink}">Reset Password</a></p>
                    <p>If you did not request this, you can ignore this email.</p>
                `
            })
        }catch(err){
            // email failed, remove the token so the link can't be used
            user.resetPasswordToken = undefined
            user.resetPasswordExpire = undefined
            await user.save()
            throw err
        }

        res.json({
            message : message,
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

module.exports = forgotPasswordController
