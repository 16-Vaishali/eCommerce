const express = require("express")
const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder } = require("../controllers/orderController");
const { isAuthenticateduser,authorizedRoles } = require("../middleware/auth");
const router = express.Router();
router.route("/order/new").post(isAuthenticateduser,newOrder)
router.route("/order/:id").get(isAuthenticateduser,getSingleOrder)
router.route("/orders/me").get(isAuthenticateduser,myOrders)
router.route("/admin/orders").get(isAuthenticateduser,authorizedRoles("admin"),getAllOrders);
router.route("/admin/order/:id").put(isAuthenticateduser,authorizedRoles("admin"),updateOrder).delete(isAuthenticateduser,authorizedRoles("admin"),deleteOrder)
module.exports = router;
