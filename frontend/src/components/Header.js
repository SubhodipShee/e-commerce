import React, { useContext, useState } from 'react'
import Logo from './Logo'
import { FaRegCircleUser } from "react-icons/fa6";
import { GrSearch } from "react-icons/gr";
import { FaCartShopping } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa6";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';
import SummaryApi from '../common';
import {toast} from 'react-toastify'
import { setUserDetails } from '../store/userSlice';
import ROLE from '../common/role';
import Context from '../context';

const Header = () => {
  const user = useSelector(state => state?.user?.user)
  const dispatch = useDispatch()
  const [menuDisplay,setMenuDisplay] = useState(false)
  const context = useContext(Context)
  const navigate = useNavigate()
  const searchInput = useLocation()
  const URLSearch = new URLSearchParams(searchInput?.search)
  const searchQuery = URLSearch.getAll("q")
  const [search,setSearch] = useState(searchQuery)

  const handleLogout = async() => {
    const fetchData = await fetch(SummaryApi.logout_user.url,{
      method : SummaryApi.logout_user.method,
      credentials : 'include'
    })

    const data = await fetchData.json()

    if(data.success){
      toast.success(data.message)
      dispatch(setUserDetails(null))
      navigate("/")
    }

    if(data.error){
      toast.error(data.message)
    }

  }

  const handleSearch = (e)=>{
    const { value } = e.target
    setSearch(value)

    if(value){
      navigate(`/search?q=${value}`)
    }else{
      navigate("/search")
    }
  }
  return (
    <header className='fixed w-full z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm'>
      {/* on mobile the search bar wraps to a second row */}
      <div className='container mx-auto px-4 py-2 lg:py-0 lg:h-16 flex flex-wrap items-center justify-between gap-x-4 gap-y-2'>
            <div className=''>
                <Link to={"/"}>
                    <Logo w={90} h={50}/>
                </Link>
            </div>

            <div className='order-last lg:order-none w-full lg:max-w-md h-10 flex items-center justify-between bg-slate-100 rounded-full pl-4 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-purple-500'>
                <input type='text' placeholder='Search mobiles, TVs, earphones...' className='w-full bg-transparent outline-none text-sm' onChange={handleSearch} value={search}/>
                <div className='text-lg min-w-[48px] h-10 bg-purple-600 flex items-center justify-center rounded-r-full text-white'>
                  <GrSearch />
                </div>
            </div>


            <div className='flex items-center gap-4 md:gap-6'>
                
                <div className='relative flex justify-center'>

                  {
                    user?._id && (
                      <div className='text-3xl cursor-pointer relative flex justify-center' onClick={()=>setMenuDisplay(preve => !preve)}>
                        {
                          user?.profilePic ? (
                            <img src={user?.profilePic} className='w-10 h-10 rounded-full object-cover ring-2 ring-purple-200 hover:ring-purple-500 transition' alt={user?.name} />
                          ) : (
                            <FaRegCircleUser/>
                          )
                        }
                      </div>
                    )
                  }
                  
                  
                  {
                    menuDisplay && (
                      <div className='absolute right-0 top-12 h-fit min-w-[160px] bg-white p-2 shadow-xl rounded-xl border border-slate-100 origin-top-right animate-scaleIn' >
                        <nav className='text-sm font-medium'>
                          {
                            user?.role === ROLE.ADMIN && (
                              <Link to={"/admin-panel/dashboard"} className='whitespace-nowrap hidden md:block rounded-lg px-3 py-2 hover:bg-purple-50 hover:text-purple-700' onClick={()=>setMenuDisplay(preve => !preve)}>Admin Panel</Link>
                            )
                          }
                          <Link to={"/profile"} className='whitespace-nowrap block rounded-lg px-3 py-2 hover:bg-purple-50 hover:text-purple-700' onClick={()=>setMenuDisplay(preve => !preve)}>My Profile</Link>
                          <Link to={"/order"} className='whitespace-nowrap block rounded-lg px-3 py-2 hover:bg-purple-50 hover:text-purple-700' onClick={()=>setMenuDisplay(preve => !preve)}>My Orders</Link>
                        </nav>
                      </div>
                    )
                  }
                 
                </div>

                  {
                     user?._id && (
                      <Link to={"/wishlist"} className='text-2xl text-slate-700 hover:text-purple-600 transition-colors' title='Wishlist'>
                          <FaRegHeart/>
                      </Link>
                     )
                  }

                  {
                     user?._id && (
                      <Link to={"/cart"} className='text-2xl relative text-slate-700 hover:text-purple-600 transition-colors' title='Cart'>
                          <span><FaCartShopping/></span>

                          <div className='bg-red-500 text-white w-5 h-5 rounded-full p-1 flex items-center justify-center absolute -top-2 -right-3 shadow'>
                              <p className='text-xs font-semibold'>{context?.cartProductCount}</p>
                          </div>
                      </Link>
                      )
                  }
              


                <div>
                  {
                    user?._id  ? (
                      <button onClick={handleLogout} className='px-4 py-1.5 rounded-full text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-600/30 active:scale-95 transition'>Logout</button>
                    )
                    : (
                    <Link to={"/login"} className='px-4 py-1.5 rounded-full text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-600/30 active:scale-95 transition'>Login</Link>
                    )
                  }
                    
                </div>

            </div>

      </div>
    </header>
  )
}

export default Header
