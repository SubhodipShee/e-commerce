const express = require('express')

const router = express.Router()

const userSignUpController = require('../controller/user/userSignUp')
const userSignInController = require('../controller/user/userSignIn')
const userDetailsController = require('../controller/user/userDetails')
const authToken = require('../middleware/authToken')
const userLogout = require('../controller/user/userLogout')
const allUsers = require ('../controller/user/allUsers')
const updateUser = require('../controller/user/updateUser')
const forgotPasswordController = require('../controller/user/forgotPassword')
const resetPasswordController = require('../controller/user/resetPassword')
const UploadProductController = require('../controller/product/uploadProduct')
const getProductController = require('../controller/product/getProduct')
const updateProductController = require('../controller/product/updateProduct')
const deleteProductController = require('../controller/product/deleteProduct')
const getCategoryProduct = require('../controller/product/getCategoryProductOne')
const getCategoryWiseProduct = require('../controller/product/getCategoryWiseProduct')
const getProductDetails = require('../controller/product/getProductDetails')
const addToCartController = require('../controller/user/addToCartController')
const countAddToCartProduct = require('../controller/user/countAddToCartProduct')
const addToCartViewProduct = require('../controller/user/addToCartViewProduct')
const updateAddToCartProduct = require('../controller/user/updateAddToCartProduct')
const deleteAddToCartProduct = require('../controller/user/deleteAddToCartProduct')
const searchProduct = require('../controller/product/searchProduct')
const filterProductController = require('../controller/product/filterProduct')
const createOrderController = require('../controller/order/createOrder')
const verifyPaymentController = require('../controller/order/verifyPayment')
const orderListController = require('../controller/order/orderList')
const allOrdersController = require('../controller/order/allOrders')
const updateOrderStatusController = require('../controller/order/updateOrderStatus')
const addReviewController = require('../controller/review/addReview')
const getProductReviewController = require('../controller/review/getProductReview')
const addToWishlistController = require('../controller/wishlist/addToWishlist')
const viewWishlistController = require('../controller/wishlist/viewWishlist')
const deleteWishlistController = require('../controller/wishlist/deleteWishlist')
const dashboardSummaryController = require('../controller/dashboard/dashboardSummary')

router.post("/signup",userSignUpController)
router.post("/signin",userSignInController)
router.get("/user-details",authToken,userDetailsController)
router.get("/userLogout",userLogout)
router.post("/forgot-password",forgotPasswordController)
router.post("/reset-password",resetPasswordController)


router.get("/all-user",authToken,allUsers)
router.post("/update-user",authToken,updateUser)

//product
router.post("/upload-product",authToken,UploadProductController)
router.get("/get-product",getProductController)
router.post("/update-product",authToken,updateProductController)
router.post("/delete-product",authToken,deleteProductController)
router.get("/get-categoryProduct",getCategoryProduct)
router.post("/category-product",getCategoryWiseProduct)
router.post("/product-details",getProductDetails)
router.get("/search",searchProduct)
router.post("/filter-product",filterProductController)


//user add to cart
router.post("/addtocart",authToken,addToCartController)
router.get("/countAddToCartProduct",authToken,countAddToCartProduct)
router.get("/view-card-product",authToken,addToCartViewProduct)
router.post("/update-cart-product",authToken,updateAddToCartProduct)
router.post("/delete-cart-product",authToken,deleteAddToCartProduct)

//order and payment
router.post("/create-order",authToken,createOrderController)
router.post("/verify-payment",authToken,verifyPaymentController)
router.get("/order-list",authToken,orderListController)
router.get("/all-order",authToken,allOrdersController)
router.post("/update-order-status",authToken,updateOrderStatusController)

//review
router.post("/add-review",authToken,addReviewController)
router.post("/product-review",getProductReviewController)

//wishlist
router.post("/add-wishlist",authToken,addToWishlistController)
router.get("/view-wishlist",authToken,viewWishlistController)
router.post("/delete-wishlist",authToken,deleteWishlistController)

//admin dashboard
router.get("/dashboard",authToken,dashboardSummaryController)



module.exports = router