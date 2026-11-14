const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: String,
    email:{
        type: String,
        unique : true,
        required :true
    },
    password :String,
    profilePic : String,
    role: String,
    // used by forgot password, select:false keeps them out of every API response
    resetPasswordToken : {
        type : String,
        select : false
    },
    resetPasswordExpire : {
        type : Date,
        select : false
    }
},{
    timestamps : true
})


const userModel = mongoose.model("user",userSchema)

module.exports = userModel