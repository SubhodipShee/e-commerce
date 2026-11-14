
import { lazy, Suspense } from 'react';
import { createBrowserRouter} from 'react-router-dom';
import App from '../App'
import Home from '../pages/Home';
import Login from '../pages/Login';
import ForgotPassword from '../pages/ForgotPassword';
import SignUp from '../pages/SignUp';
import CategoryProduct from '../pages/CategoryProduct'
import ProductDetails from '../pages/ProductDetails'
import Cart from '../pages/Cart'
import SearchProduct from '../pages/SearchProduct';

// admin pages are loaded only when an admin opens them, so normal users download less code
const AdminPanel = lazy(()=> import('../pages/AdminPanel'))
const AllUsers = lazy(()=> import('../pages/AllUsers'))
const AllProducts = lazy(()=> import('../pages/AllProducts'))

const adminLoading = <p className='text-lg text-center p-4'>Loading ...</p>

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
                path : 'search',
                element : <SearchProduct/>
            },
            {
                path:"admin-panel",
                element: <Suspense fallback={adminLoading}><AdminPanel/></Suspense>,
                children :[
                    {
                        path:"all-users",
                        element:<Suspense fallback={adminLoading}><AllUsers/></Suspense>
                    },
                    {
                        path:"all-products",
                        element:<Suspense fallback={adminLoading}><AllProducts/></Suspense>
                    }
                ]
            }
            
        ]
        
    }
])

export default router