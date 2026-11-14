import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from 'react-toastify'
import SummaryApi from '../common'
import loginIcons from '../assest/signin.gif'

const ResetPassword = () => {
  const [showPassword,setShowPassword] = useState(false)
  const [data,setData] = useState({
    password : "",
    confirmPassword : ""
  })
  const params = useParams()
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

  const handleSubmit = async(e) =>{
    e.preventDefault()

    if(data.password !== data.confirmPassword){
      toast.error("Password and confirm password do not match")
      return
    }

    const dataResponse = await fetch(SummaryApi.resetPassword.url,{
      method : SummaryApi.resetPassword.method,
      headers : {
        "content-type" : "application/json"
      },
      body : JSON.stringify({
        token : params?.token,
        password : data.password
      })
    })

    const dataApi = await dataResponse.json()

    if(dataApi.success){
      toast.success(dataApi.message)
      navigate("/login")
    }
    if(dataApi.error){
      toast.error(dataApi.message)
    }
  }

  return (
    <section id='reset-password'>
      <div className='mx-auto container p-4'>
        <div className='bg-white px-2 py-5 w-full max-w-sm mx-auto'>
          <div className='w-20 h-20 mx-auto'>
            <img src={loginIcons} alt='reset password icon'/>
          </div>

          <form className='pt-6 flex flex-col gap-2' onSubmit={handleSubmit}>
            <div>
              <label>New Password : </label>
              <div className='bg-slate-100 p-2 flex'>
                <input type={showPassword ? "text" : "password"}
                  placeholder='enter new password'
                  name='password'
                  value={data.password}
                  onChange={handleOnChange}
                  required
                  className='w-full h-full outline-none bg-transparent'/>
                <div className='cursor-pointer text-xl' onClick={()=>setShowPassword((preve)=>!preve)}>
                  <span>
                    {
                      showPassword ? <FaEyeSlash/> : <FaEye/>
                    }
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label>Confirm Password : </label>
              <div className='bg-slate-100 p-2 flex'>
                <input type={showPassword ? "text" : "password"}
                  placeholder='enter confirm password'
                  name='confirmPassword'
                  value={data.confirmPassword}
                  onChange={handleOnChange}
                  required
                  className='w-full h-full outline-none bg-transparent'/>
              </div>
            </div>

            <button className='bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 w-full max-w-[200px] rounded-full hover:scale-110 transition-all mx-auto block mt-6'>Reset Password</button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default ResetPassword
