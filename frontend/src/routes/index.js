
import { lazy, Suspense } from 'react';
import { createBrowserRouter} from 'react-router-dom';
import App from '../App'
import Home from '../pages/Home';
import Login from '../pages/Login';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import SignUp from '../pages/SignUp';
import CategoryProduct from '../pages/CategoryProduct'
import ProductDetails from '../pages/ProductDetails'
import Cart from '../pages/Cart'
import Wishlist from '../pages/Wishlist'
import SearchProduct from '../pages/SearchProduct';

// these pages are loaded only when opened, so the home page downloads less code
const AdminPanel = lazy(()=> import('../pages/AdminPanel'))
const AllUsers = lazy(()=> import('../pages/AllUsers'))
const AllProducts = lazy(()=> import('../pages/AllProducts'))
const AllOrders = lazy(()=> import('../pages/AllOrders'))
const OrderPage = lazy(()=> import('../pages/OrderPage'))

const pageLoading = <p className='text-lg text-center p-4'>Loading ...</p>

const router= createBrowserRouter([
    {
        path :"/",
        element : <App/>,
        children :[
            {
                path: "",
                element : <Home/>
            },
            {
                path:"login",
                element: <Login/>
            },
            {
                path: "forgot-password",
                element:<ForgotPassword/>
            },
            {
                path: "reset-password/:token",
                element:<ResetPassword/>
            },
            {
                path: "sign-up",
                element:<SignUp/>
            },
            {
                
                path : "product-category",
                element : <CategoryProduct/>
            },
            {
                path : "product/:id",
                element : <ProductDetails/>   
            },
            {
                path : 'cart',
                element : <Cart/>
            },
            {
                path : 'wishlist',
                element : <Wishlist/>
            },
            {
                path : 'search',
                element : <SearchProduct/>
            },
            {
                path : 'order',
                element : <Suspense fallback={pageLoading}><OrderPage/></Suspense>
            },
            {
                path:"admin-panel",
                element: <Suspense fallback={pageLoading}><AdminPanel/></Suspense>,
                children :[
                    {
                        path:"all-users",
                        element:<Suspense fallback={pageLoading}><AllUsers/></Suspense>
                    },
                    {
                        path:"all-products",
                        element:<Suspense fallback={pageLoading}><AllProducts/></Suspense>
                    },
                    {
                        path:"all-orders",
                        element:<Suspense fallback={pageLoading}><AllOrders/></Suspense>
                    }
                ]
            }
            
        ]
        
    }
])

export default router