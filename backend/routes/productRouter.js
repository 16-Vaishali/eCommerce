const express = require("express");
const { getAllProducts,createProduct, updateProduct, deleteProduct, getProductDetails, createReview, getReviews, deleteReview, getAdminProducts } = require("../controllers/productController");
const { isAuthenticateduser,authorizedRoles } = require("../middleware/auth");
const router = express.Router();
router.route("/products").get( getAllProducts)
router.route("/admin/products").get(isAuthenticateduser, getAdminProducts)
router.route("/admin/product/new").post(isAuthenticateduser,createProduct)
router.route("/admin/product/:id").put(isAuthenticateduser,updateProduct).delete(isAuthenticateduser,deleteProduct)
router.route("/product/:id").get(getProductDetails);
router.route("/review").put(isAuthenticateduser,createReview)
router.route("/reviews").get(getReviews).delete(isAuthenticateduser,deleteReview)
module.exports = router