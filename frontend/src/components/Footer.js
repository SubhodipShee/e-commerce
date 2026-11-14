import React from 'react'
import { Link } from 'react-router-dom'
import Logo from './Logo'
import productCategory from '../helpers/productCategory'

const Footer = () => {
  return (
    <footer className='bg-slate-900 text-slate-300 mt-10'>
      <div className='container mx-auto px-4 py-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4'>
        <div>
          <div className='bg-white rounded-xl px-3 py-2 w-fit'>
            <Logo/>
          </div>
          <p className='text-sm mt-3 text-slate-400'>Your one-stop shop for mobiles, TVs, audio and smart gadgets at the best prices.</p>
        </div>

        <div>
          <h3 className='text-white font-semibold mb-3'>Quick Links</h3>
          <nav className='grid gap-2 text-sm'>
            <Link to={"/"} className='hover:text-white transition-colors'>Home</Link>
            <Link to={"/cart"} className='hover:text-white transition-colors'>Cart</Link>
            <Link to={"/wishlist"} className='hover:text-white transition-colors'>Wishlist</Link>
            <Link to={"/order"} className='hover:text-white transition-colors'>My Orders</Link>
          </nav>
        </div>

        <div>
          <h3 className='text-white font-semibold mb-3'>Categories</h3>
          <nav className='grid grid-cols-2 gap-2 text-sm'>
            {
              productCategory.slice(0,8).map(category =>{
                return(
                  <Link to={"/product-category?category="+category.value} className='hover:text-white transition-colors' key={category.value}>{category.label}</Link>
                )
              })
            }
          </nav>
        </div>

        <div>
          <h3 className='text-white font-semibold mb-3'>Why ElectroPlaza</h3>
          <ul className='grid gap-2 text-sm text-slate-400'>
            <li>Secure payments with Razorpay</li>
            <li>Genuine branded products</li>
            <li>Easy order tracking</li>
          </ul>
        </div>
      </div>

      <div className='border-t border-slate-800'>
        <p className='container mx-auto px-4 py-4 text-center text-sm text-slate-400'>Copyright © {new Date().getFullYear()} Subhodip Shee | All Rights Reserved</p>
      </div>
    </footer>
  )
}

export default Footer
