


// set REACT_APP_BACKEND_URL in frontend/.env (e.g. http://localhost:7070 for local development)
const backendDomin = process.env.REACT_APP_BACKEND_URL || "https://e-commerce-backend-rem3.onrender.com"


const SummaryApi = {
    signUP : {
        url : `${backendDomin}/api/signup`,
        method : "post"
    },
    signIn : {
        url : `${backendDomin}/api/signin`,
        method : "post"
    },
    current_user : {
        url : `${backendDomin}/api/user-details`,
        method : "get"
    },
    logout_user : {
        url : `${backendDomin}/api/userLogout`,
        method : 'get'
    },
    forgotPassword : {
        url : `${backendDomin}/api/forgot-password`,
        method : 'post'
    },
    resetPassword : {
        url : `${backendDomin}/api/reset-password`,
        method : 'post'
    },
    allUser : {
        url : `${backendDomin}/api/all-user`,
        method : 'get'
    },
    updateUser : {
        url : `${backendDomin}/api/update-user`,
        method : "post"
    },
    uploadProduct : {
        url : `${backendDomin}/api/upload-product`,
        method : 'post'
    },
    allProduct : {
        url : `${backendDomin}/api/get-product`,
        method : 'get'
    },
    updateProduct : {
        url : `${backendDomin}/api/update-product`,
        method  : 'post'
    },
    categoryProduct : {
        url : `${backendDomin}/api/get-categoryProduct`,
        method : 'get'
    },
    categoryWiseProduct :{
        url : `${backendDomin}/api/category-product`,
        method :'post'
    },
    productDetails :{
        url:`${backendDomin}/api/product-details`,
        method :'post'
    },
    addToCartProduct : {
        url : `${backendDomin}/api/addtocart`,
        method : 'post'
    },
    addToCartProductCount : {
        url : `${backendDomin}/api/countAddToCartProduct`,
        method : 'get'
    },
    addToCartProductView :{
        url:`${backendDomin}/api/view-card-product`,
        method :'get'
    },
    updateCartProduct : {
        url : `${backendDomin}/api/update-cart-product`,
        method : 'post'
    },
    deleteCartProduct : {
        url : `${backendDomin}/api/delete-cart-product`,
        method : 'post'
    },
    searchProduct : {
        url : `${backendDomin}/api/search`,
        method : 'get'
    },
    filterProduct : {
        url : `${backendDomin}/api/filter-product`,
        method : 'post'
    },
    createOrder : {
        url : `${backendDomin}/api/create-order`,
        method : 'post'
    },
    verifyPayment : {
        url : `${backendDomin}/api/verify-payment`,
        method : 'post'
    },
    orderList : {
        url : `${backendDomin}/api/order-list`,
        method : 'get'
    },
    allOrder : {
        url : `${backendDomin}/api/all-order`,
        method : 'get'
    },
    updateOrderStatus : {
        url : `${backendDomin}/api/update-order-status`,
        method : 'post'
    },
    addReview : {
        url : `${backendDomin}/api/add-review`,
        method : 'post'
    },
    productReview : {
        url : `${backendDomin}/api/product-review`,
        method : 'post'
    },
    addToWishlist : {
        url : `${backendDomin}/api/add-wishlist`,
        method : 'post'
    },
    viewWishlist : {
        url : `${backendDomin}/api/view-wishlist`,
        method : 'get'
    },
    deleteWishlist : {
        url : `${backendDomin}/api/delete-wishlist`,
        method : 'post'
    }
}



export default SummaryApi
