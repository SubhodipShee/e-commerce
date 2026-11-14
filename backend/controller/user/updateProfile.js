const userModel = require("../../models/userModel")

async function updateProfileController(req,res){
    try{
        const { name, profilePic } = req.body

        if(name !== undefined && !name.trim()){
            throw new Error("Name cannot be empty")
        }

        // user can change only own name and photo (not email or role)
        const payload = {
            ...( name && { name : name.trim() }),
            ...( profilePic && { profilePic : profilePic }),
        }

        const updateUser = await userModel.findByIdAndUpdate(req.userId,payload,{ new : true }).select("-password")

        res.json({
            data : updateUser,
            message : "Profile updated",
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

module.exports = updateProfileController
