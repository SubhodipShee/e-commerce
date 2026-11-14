import React, { useContext, useState } from 'react'
import loginIcons from '../assest/signin.gif'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import Context from '../context';


const Login = () => {
    const [showPassword,setShowPassword]= useState(false)
    const [data,setData] = useState({
        email : "",
        password : ""
    })
    const navigate = useNavigate()
    const {fetchUserDetails,fetchUserAddToCart} = useContext(Context)

    

    const handleOnChange = (e) =>{
        const { name , value } = e.target

        setData((preve)=>{
            return{
                ...preve,
                [name] : value
            }
        })
    }

    const handleSubmit = async(e) =>{
        e.preventDefault()

        const dataResponse = await fetch(SummaryApi.signIn.url,
            {
            method : SummaryApi.signIn.method,
            credentials : 'include',
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify(data)
        })

        const dataApi = await dataResponse.json()

        if(dataApi.success){
            toast.success(dataApi.message)
            
            navigate('/')
            fetchUserDetails()
            fetchUserAddToCart()
        }
        if(dataApi.error){
            toast.error(dataApi.message)
        }


    }

  return (
    <section id='login'>
        <div className='mx-auto container p-4'>
            <div className='bg-white p-6 md:p-8 w-full max-w-sm mx-auto mt-6 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/60'>
                    <div className='w-20 h-20 mx-auto'>
                        <img src={loginIcons} alt='login icons' className='mix-blend-multiply'/>
                    </div>
                    <h1 className='text-2xl font-bold text-center mt-2'>Welcome back</h1>
                    <p className='text-sm text-slate-500 text-center'>Login to continue shopping</p>
                    <form className='pt-6 flex flex-col gap-3' onSubmit={handleSubmit}>
                        <div className='grid'>
                            <label>Email : </label>
                            <div className='bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex transition focus-within:bg-white focus-within:ring-2 focus-within:ring-purple-500'>
                                <input type='email' 
                                placeholder='enter email'
                                name='email'
                                value={data.email}
                                onChange={handleOnChange} 
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
                            <Link to={'/forgot-password'} className='block w-fit ml-auto hover:underline hover:text-red-600'>
                                    forgot password ?
                            </Link>
                        </div>


                        <button className='bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 w-full max-w-[160px] rounded-full hover:scale-110 transition-all mx-auto block mt-6'>Login</button>
                    </form>

                     <p className='my-5'>Don't have acc ? <Link to={"/sign-up"} className=' text-red-600 hover:text-red-700 hover:underline'>Sign up</Link></p>               

            </div>
        </div>
    </section>    
  )
}

export default Login
