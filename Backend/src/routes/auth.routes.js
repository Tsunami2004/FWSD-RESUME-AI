const {Router} = require("express")
const authController = require("../controllers/auth.controller")
const authMiddleware = require("../middlewares/auth.middleware")
const authRouter = Router() 
/**
 * @route Post /api/auth/register
 * @desc Register a new user
 * @access Public
 */
authRouter.post("/register", authController.registerUserController)

/**
 * @ route Post /api/auth/login
 * @description Login a user, expects email and password in the request body
 * @access Public
 */

authRouter.post("/login", authController.loginUserController)

/**
 * @route GET /api/auth/logout
 * @description clear token from user cookie and add the token to blacklist collection
 * @access public
 */


authRouter.get("/logout", authController.logoutUserController)

console.log("AUTH ROUTES LOADED")

/**
 * @router GET/api/auth/get-me
 * @description Get the details of the logged in user, expects token in the cookie
 * @access Private
 */

authRouter.get("/get-me", authMiddleware.authUser,authController.getMeController)

module.exports = authRouter
