import React,{useState} from 'react'
import loginIcons from '../assest/signin.gif'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate} from 'react-router-dom';
import uploadImage from '../helpers/uploadImage';
import SummaryApi from '../common';
import { toast } from 'react-toastify';



const SignUp = () => {
    const [showPassword,setShowPassword]= useState(false)
    const [showConfirmPassword,setShowConfirmPassword] =useState(false)
    const [data,setData] = useState({
        email : "",
        password : "",
        name : "",
        confirmPassword: "",
        profilePic: ""
    })
    const navigate = useNavigate()

    const handleOnChange = (e) =>{
        const { name , value } = e.target

        setData((preve)=>{
            return{
                ...preve,
                [name] : value
            }
        })
    }
    const handleUploadPic =async(e)=>{
        const file =e.target.files[0]

        // upload to Cloudinary and save only the image URL (same as product images)
        const uploadImageCloudinary = await uploadImage(file)

        setData((preve)=>{
            return{
              ...preve,
              profilePic : uploadImageCloudinary.url
              
            }

          })
    }

    const handleSubmit = async(e) =>{
        e.preventDefault()

        if(data.password === data.confirmPassword){
            
            const dataResponse = await fetch(SummaryApi.signUP.url,{
                method : SummaryApi.signUP.method,
                headers : {
                    "content-type" : "application/json"
                },
                body : JSON.stringify(data)
              })
    
              const dataApi = await dataResponse.json()

              if(dataApi.success){
                toast.success(dataApi.message)
                navigate("/login")
              }
              if(dataApi.error){
                toast.error(dataApi.message)
              }

              toast(dataApi.message)
    
              console.log("data",dataApi)
        }else {
            console.log("Please check password & confirm password")
        }

        
    }

    return (
    <section id='signup'>
    <div className='mx-auto container p-4'>
        <div className='bg-white p-6 md:p-8 w-full max-w-sm mx-auto mt-6 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/60'>
                <div className='w-20 h-20 mx-auto relative overflow-hidden rounded-full'>
                    <div>
                    
                    <img src={data.profilePic || loginIcons} alt='login icons'/>

                    </div>
                    <form>
                        <label>
                        <div className='text-xs bg-opacity-80 bg-slate-200 pb-4 pt-2 cursor-pointer text-center absolute bottom-0 w-full'>
                        Upload Photo
                        </div>
                            <input type='file' className='hidden' onChange={handleUploadPic}/>
                        </label>
                       
                    </form>
                </div>
                <h1 className='text-2xl font-bold text-center mt-2'>Create your account</h1>
                <p className='text-sm text-slate-500 text-center'>Join ElectroPlaza and start shopping</p>
                <form className='pt-6 flex flex-col gap-3' onSubmit={handleSubmit}>
                <div className='grid'>
                        <label>Name : </label>
                        <div className='bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex transition focus-within:bg-white focus-within:ring-2 focus-within:ring-purple-500'>
                            <input type='text' 
                            placeholder='enter your name'
                            name='name'
                            value={data.name}
                            onChange={handleOnChange}
                            required 
                            className='w-full h-full outline-none bg-transparent'/>
                        </div>
                    </div>
                    <div className='grid'>
                        <label>Email : </label>
                        <div className='bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex transition focus-within:bg-white focus-within:ring-2 focus-within:ring-purple-500'>
                            <input type='email' 
                            placeholder='enter email'
                            name='email'
                            value={data.email}
                            onChange={handleOnChange} 
                            required
                            className='w-full h-full outline-none bg-transparent'/>
                        </div>
                    </div>
                   
                    <div>
                        <label>Password : </label>
                        <div className='bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex transition focus-within:bg-white focus-within:ring-2 focus-within:ring-purple-500'>
                            <input type= {showPassword ? "text": "password"}
                             placeholder='enter password'
                             name='password'
                             value={data.password}
                             onChange={handleOnChange} 
                             required
                             className='w-full h-full outline-none bg-transparent'/>
                        <div className='cursor-pointer text-xl' onClick={()=>setShowPassword((preve)=>!preve)}>
                            <span>
                                {
                                    showPassword ?(
                                        <FaEyeSlash/>
                                    )
                                    :
                                    (
                                        <FaEye/>
                                    )
                                }
                                
                                
                            </span>
                        </div>
                        </div>
                       
                    </div>
                    <div>
                        <label>Confirm Password : </label>
                        <div className='bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex transition focus-within:bg-white focus-within:ring-2 focus-within:ring-purple-500'>
                            <input type= {showConfirmPassword ? "text": "password"}
                             placeholder='enter confirm password'
                             name='confirmPassword'
                             value={data.confirmPassword}
                             onChange={handleOnChange} 
                             required
                             className='w-full h-full outline-none bg-transparent'/>
                        <div className='cursor-pointer text-xl' onClick={()=>setShowConfirmPassword((preve)=>!preve)}>
                            <span>
                                {
                                    showConfirmPassword ?(
                                        <FaEyeSlash/>
                                    )
                                    :
                                    (
                                        <FaEye/>
                                    )
                                }
                                
                                
                            </span>
                        </div>
                        </div>
                        
                    </div>


                    <button className='bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 w-full max-w-[160px] rounded-full hover:scale-110 transition-all mx-auto block mt-6'>Sign Up</button>
                </form>

                 <p className='my-5'>Already have acc ? <Link to={"/login"} className=' text-red-600 hover:text-red-700 hover:underline'>Login</Link></p>               

        </div>
    </div>
  </section>  
  )
}

export default SignUp
