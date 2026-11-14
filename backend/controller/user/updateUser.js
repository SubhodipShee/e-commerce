const userModel = require("../../models/userModel")

async function updateUser(req,res){
    try{
        const sessionUser = req.userId

        const { userId , email, name, role} = req.body

        const payload = {
            ...( email && { email : email}),
            ...( name && { name : name}),
            ...( role && { role : role}),
        }
        const user = await userModel.findById(sessionUser)

        if(user?.role !== 'ADMIN'){
            throw new Error("Permission denied")
        }

        const updateUser = await userModel.findByIdAndUpdate(userId,payload).select("-password")

        
        res.json({
            data : updateUser,
            message : "User Updated",
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

module.exports = updateUser