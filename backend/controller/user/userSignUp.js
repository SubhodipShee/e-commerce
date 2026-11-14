const userModel = require("../../models/userModel")
const bcrypt = require('bcryptjs');


async function userSignUpController(req,res){
    try{
        const {email, password, name}=req.body

        const user = await userModel.findOne({email})

        if(user){
            throw new Error("Already user exits.")
        }
        

        if(!email){
            throw new Error("Please provide Email")

        }
        if(!password){
            throw new Error("Please provide Password")
            
        }
        if(!name){
            throw new Error("Please provide Name")
            
        }
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hashSync(password, salt);

        if(! hashPassword){
            throw new Error("something is wrong")
        }

        const payload ={
            ...req.body,
            role : "GENERAL",
            password : hashPassword
        }
        
        const userData = new userModel(payload)
        const saveUser = await userData.save()

        // do not send password hash to the client
        const userResponse = saveUser.toObject()
        delete userResponse.password

        res.status(201).json({
            data : userResponse,
            success : true,
            error : false,
            message : "User created Successfully!"
        })




    }catch(err){
        console.log("err",err.message)
        res.json({
            message: err.message ||  err ,
            error:true,
            success:false,
        })
    }
}

module.exports = userSignUpController