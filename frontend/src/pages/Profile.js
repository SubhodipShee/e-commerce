import React, { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaRegCircleUser } from 'react-icons/fa6'
import SummaryApi from '../common'
import Context from '../context'
import uploadImage from '../helpers/uploadImage'

const Profile = () => {
  const user = useSelector(state => state?.user?.user)
  const { fetchUserDetails } = useContext(Context)

  const [profile,setProfile] = useState({
    name : "",
    profilePic : ""
  })
  const [password,setPassword] = useState({
    oldPassword : "",
    newPassword : "",
    confirmPassword : ""
  })

  // fill the form with current user details
  useEffect(()=>{
    setProfile({
      name : user?.name || "",
      profilePic : user?.profilePic || ""
    })
  },[user])

  const handleUploadPic = async(e)=>{
    const file = e.target.files[0]
    const uploadImageCloudinary = await uploadImage(file)

    setProfile((preve)=>{
      return{
        ...preve,
        profilePic : uploadImageCloudinary.url
      }
    })
  }

  const handleUpdateProfile = async(e)=>{
    e.preventDefault()

    const response = await fetch(SummaryApi.updateProfile.url,{
      method : SummaryApi.updateProfile.method,
      credentials : 'include',
      headers : {
        "content-type" : "application/json"
      },
      body : JSON.stringify(profile)
    })
    const responseData = await response.json()

    if(responseData.success){
      toast.success(responseData.message)
      fetchUserDetails()
    }
    if(responseData.error){
      toast.error(responseData.message)
    }
  }

  const handleOnChangePassword = (e)=>{
    const { name, value } = e.target

    setPassword((preve)=>{
      return{
        ...preve,
        [name] : value
      }
    })
  }

  const handleChangePassword = async(e)=>{
    e.preventDefault()

    if(password.newPassword !== password.confirmPassword){
      toast.error("New password and confirm password do not match")
      return
    }

    const response = await fetch(SummaryApi.changePassword.url,{
      method : SummaryApi.changePassword.method,
      credentials : 'include',
      headers : {
        "content-type" : "application/json"
      },
      body : JSON.stringify({
        oldPassword : password.oldPassword,
        newPassword : password.newPassword
      })
    })
    const responseData = await response.json()

    if(responseData.success){
      toast.success(responseData.message)
      setPassword({ oldPassword : "", newPassword : "", confirmPassword : "" })
    }
    if(responseData.error){
      toast.error(responseData.message)
    }
  }

  if(!user?._id){
    return (
      <div className='container mx-auto p-4'>
        <p className='bg-white text-lg text-center p-4'>Please <Link to={"/login"} className='text-red-600 hover:text-red-700 hover:underline'>login</Link> to see your profile</p>
      </div>
    )
  }

  return (
    <div className='container mx-auto p-4'>
      <h2 className='text-2xl font-semibold py-4'>My Profile</h2>

      <div className='grid lg:grid-cols-2 gap-6 max-w-4xl'>
        {/**profile details */}
        <form className='bg-white p-4 rounded grid gap-2 h-fit' onSubmit={handleUpdateProfile}>
          <div className='w-20 h-20 mx-auto relative overflow-hidden rounded-full bg-slate-200 flex items-center justify-center text-5xl'>
            {
              profile.profilePic ? (
                <img src={profile.profilePic} alt={profile.name} className='w-full h-full object-cover'/>
              ) : (
                <FaRegCircleUser/>
              )
            }
            <label className='text-xs bg-opacity-80 bg-slate-200 pb-2 pt-1 cursor-pointer text-center absolute bottom-0 w-full'>
              Change
              <input type='file' accept='image/*' className='hidden' onChange={handleUploadPic}/>
            </label>
          </div>

          <label>Name : </label>
          <input type='text' name='name' value={profile.name} onChange={(e)=>setProfile(preve => ({ ...preve, name : e.target.value }))} required className='p-2 bg-slate-100 border rounded'/>

          <label>Email : </label>
          <input type='email' value={user?.email} disabled className='p-2 bg-slate-100 border rounded text-slate-500'/>

          <button className='bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded mt-2'>Save Profile</button>
        </form>

        {/**change password */}
        <form className='bg-white p-4 rounded grid gap-2 h-fit' onSubmit={handleChangePassword}>
          <h3 className='font-semibold text-lg'>Change Password</h3>

          <label>Old Password : </label>
          <input type='password' name='oldPassword' value={password.oldPassword} onChange={handleOnChangePassword} required className='p-2 bg-slate-100 border rounded'/>

          <label>New Password : </label>
          <input type='password' name='newPassword' value={password.newPassword} onChange={handleOnChangePassword} required className='p-2 bg-slate-100 border rounded'/>

          <label>Confirm New Password : </label>
          <input type='password' name='confirmPassword' value={password.confirmPassword} onChange={handleOnChangePassword} required className='p-2 bg-slate-100 border rounded'/>

          <button className='bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded mt-2'>Change Password</button>
        </form>
      </div>
    </div>
  )
}

export default Profile
