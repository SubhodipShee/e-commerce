import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import SummaryApi from '../common'
import forgotPasswordIcon from '../assest/forgotpasswnedSend.gif'

const ForgotPassword = () => {
  const [email,setEmail] = useState("")
  const [loading,setLoading] = useState(false)
  const [emailSent,setEmailSent] = useState(false)

  const handleSubmit = async(e) =>{
    e.preventDefault()
    setLoading(true)

    const dataResponse = await fetch(SummaryApi.forgotPassword.url,{
      method : SummaryApi.forgotPassword.method,
      headers : {
        "content-type" : "application/json"
      },
      body : JSON.stringify({ email : email })
    })

    const dataApi = await dataResponse.json()
    setLoading(false)

    if(dataApi.success){
      toast.success(dataApi.message)
      setEmailSent(true)
    }
    if(dataApi.error){
      toast.error(dataApi.message)
    }
  }

  return (
    <section id='forgot-password'>
      <div className='mx-auto container p-4'>
        <div className='bg-white px-2 py-5 w-full max-w-sm mx-auto'>
          <div className='w-20 h-20 mx-auto'>
            <img src={forgotPasswordIcon} alt='forgot password icon'/>
          </div>

          {
            emailSent ? (
              <p className='text-center my-4'>Check your email for the password reset link. The link is valid for 15 minutes.</p>
            ) : (
              <form className='pt-6 flex flex-col gap-2' onSubmit={handleSubmit}>
                <div className='grid'>
                  <label>Email : </label>
                  <div className='bg-slate-100 p-2 flex'>
                    <input type='email'
                      placeholder='enter your registered email'
                      name='email'
                      value={email}
                      onChange={(e)=>setEmail(e.target.value)}
                      required
                      className='w-full h-full outline-none bg-transparent'/>
                  </div>
                </div>

                <button disabled={loading} className='bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 w-full max-w-[200px] rounded-full hover:scale-110 transition-all mx-auto block mt-6 disabled:opacity-60'>
                  { loading ? "Sending..." : "Send Reset Link" }
                </button>
              </form>
            )
          }

          <p className='my-5'>Remember password ? <Link to={"/login"} className=' text-red-600 hover:text-red-700 hover:underline'>Login</Link></p>
        </div>
      </div>
    </section>
  )
}

export default ForgotPassword
