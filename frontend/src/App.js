import logo from './logo.svg';
import './App.css';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import SummaryApi from './common';
import Context from './context';
import { useDispatch } from 'react-redux';
import { setUserDetails } from './store/userSlice';



function App() {
  const dispatch = useDispatch()
  const location = useLocation()
  const [cartProductCount,setCartProductCount] = useState(0)

  const fetchUserDetails = async()=>{
    
    const dataResponse = await fetch(SummaryApi.current_user.url,{
      method : SummaryApi.current_user.method ,
      credentials : 'include'
    })

    
    const dataApi = await dataResponse.json()

    
    if(dataApi.success){
          dispatch(setUserDetails(dataApi.data))
        } 

    }
    const fetchUserAddToCart = async()=>{
      const dataResponse = await fetch(SummaryApi.addToCartProductCount.url,{
        method : SummaryApi.addToCartProductCount.method,
        credentials : 'include'
      })
      const dataApi = await dataResponse.json()

      
      setCartProductCount(dataApi?.data?.count)

    }
   useEffect(()=>{

  fetchUserDetails()
  fetchUserAddToCart()


  },[])
    return (
      <>
        <Context.Provider value={{
        fetchUserDetails ,  //USER DETAILS FETCH
        cartProductCount,   //USER add to cart count
        fetchUserAddToCart
        }}>
          <ToastContainer position='top-center' autoClose={2500} newestOnTop />

          <Header/>
          <main className='min-h-[calc(100vh-120px)] pt-28 lg:pt-16'>
            {/* key changes on every page, so each page fades in */}
            <div key={location.pathname} className='animate-fadeIn'>
              <Outlet/>
            </div>
          </main>
          <Footer/>

        </Context.Provider>
      </>
    );
  }    

export default App;
