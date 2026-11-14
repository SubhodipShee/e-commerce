const userModel = require("../../models/userModel")

async function updateAddressController(req,res){
    try{
        const { fullName, phone, addressLine, city, state, pincode } = req.body

        if(!fullName?.trim() || !addressLine?.trim() || !city?.trim() || !state?.trim()){
            throw new Error("Please fill all address fields")
        }
        if(!/^[0-9]{10}$/.test(phone)){
            throw new Error("Please enter a valid 10 digit phone number")
        }
        if(!/^[0-9]{6}$/.test(pincode)){
            throw new Error("Please enter a valid 6 digit pincode")
        }

        const address = {
            fullName : fullName.trim(),
            phone : phone,
            addressLine : addressLine.trim(),
            city : city.trim(),
            state : state.trim(),
            pincode : pincode
        }

        const updateUser = await userModel.findByIdAndUpdate(req.userId,{ address : address },{ new : true }).select("-password")

        res.json({
            data : updateUser,
            message : "Address saved",
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

module.exports = updateAddressController
