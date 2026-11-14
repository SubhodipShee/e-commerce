import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { FaRegCircleUser } from 'react-icons/fa6'
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import ROLE from '../common/role';

const AdminPanel = () => {
    const user = useSelector(state => state?.user?.user)
    const navigate = useNavigate()
    
    useEffect(()=>{
        if(user?.role !== ROLE.ADMIN){
          navigate("/")
        }
    },[user])

    // highlight the link of the page that is open
    const navLinkClass = ({ isActive }) => `px-3 py-2 rounded-lg font-medium transition ${isActive ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30' : 'text-slate-600 hover:bg-purple-50 hover:text-purple-700'}`


  return (
    <div className='min-h-[calc(100vh-120px)] md:flex hidden'>

      <aside className='bg-white min-h-full w-full max-w-60 border-r border-slate-100 shadow-sm'>
            <div className='h-36 flex justify-center items-center flex-col gap-1'>
            <div className='text-5xl cursor-pointer relative flex justify-center text-slate-400' >
                        {
                          user?.profilePic ? (
                            <img src={user?.profilePic}className='w-20 h-20 rounded-full object-cover ring-4 ring-purple-100' alt={user?.name}  />
                          ) : (
                            <FaRegCircleUser/>
                          )
                        }
                  
                    </div>
                    <p className='capitalize text-lg font-semibold'>{user?.name}</p>
                    <p className='text-xs font-semibold tracking-wide text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full'>{user?.role}</p>
            </div>

            <div>
              <nav className='grid gap-1 p-4'>
                <NavLink to={"dashboard"} className={navLinkClass}>Dashboard</NavLink>
                <NavLink to={"all-users"} className={navLinkClass}>All users</NavLink>
                <NavLink to={"all-products"} className={navLinkClass}>All products</NavLink>
                <NavLink to={"all-orders"} className={navLinkClass}>All orders</NavLink>

              </nav>
            </div>
      </aside>


      <main className='w-full h-full p-4'>
        <Outlet/>
      </main>
    </div>
  )
}

export default AdminPanel
