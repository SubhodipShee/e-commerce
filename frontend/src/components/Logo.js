import React from 'react'
import { FaBolt } from "react-icons/fa6";

const Logo = ({w,h}) => {
  return (
    <div className='flex items-center gap-2'>
      <span className='w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-fuchsia-500 text-white flex items-center justify-center shadow-md shadow-purple-500/30'>
        <FaBolt/>
      </span>
      <strong className='text-lg font-extrabold tracking-tight text-slate-800'>
        Electro<span className='text-purple-600'>Plaza</span>
      </strong>
    </div>
  )
}

export default Logo
