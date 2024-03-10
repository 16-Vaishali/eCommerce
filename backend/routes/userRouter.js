const express = require("express");
const { registerUser, loginUser, logoutUser, forgotPassword, resetPassword, getUserDetails, updateUserPassword, updateProfile, getAllusers, getUser, updateUserRole, deleteUser } = require("../controllers/userController");
const {isAuthenticateduser, authorizedRoles} = require("../middleware/auth")
const router = express.Router();
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword)
router.route("/password/reset/:token").put(resetPassword)
router.route("/me").get(isAuthenticateduser,getUserDetails)
router.route("/logout").get(logoutUser);
router.route("/password/update").put(isAuthenticateduser,updateUserPassword)
router.route("/me/update").put(isAuthenticateduser,updateProfile)


router.route("/admin/users").get(isAuthenticateduser,authorizedRoles("admin"),getAllusers);
router.route("/admin/user/:id").get(isAuthenticateduser,authorizedRoles("admin"),getUser).put(isAuthenticateduser,authorizedRoles("admin"),updateUserRole).delete(isAuthenticateduser,authorizedRoles("admin"),deleteUser)

module.exports = router