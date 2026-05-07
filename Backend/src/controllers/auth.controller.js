const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const blacklistTokenModel = require("../models/blacklist.model")    

/**
 * @name registerUserController
 * @description register a new user, expects username, email and password in the request body
 *@access Public
 */
async function registerUserController(req, res){
    const {username, email, password} = req.body

    if(!username || !email || !password){
        return res.status(400).json({
            message: "All fields are required"
        })
    }
    const isUserAlreadyRegistered = await userModel.findOne({
        $or: [{username}, {email}]
    })

    if(isUserAlreadyRegistered){
        return res.status(400).json({
            message: "Username or email already registered"
        })
    }
    const hash = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username,
        email,
        password: hash
    })

    const token = jwt.sign(
        {id: user._id, username: user.username, email: user.email},
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
    )
    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    })

    res.status(201).json({
        message: "User registered successfully",
        user:{
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

async function loginUserController(req, res){
    const {email, password} = req.body

    const user = await userModel.findOne({email})
    if(!user){
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const isPasswordValid = await  bcrypt.compare(password, user.password)

    if(!isPasswordValid){
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }
    const token = jwt.sign(
        {id: user._id, username: user.username, email: user.email},
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
    )
    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    })
    res.status(200).json({
        message: "User logged in successfully",
        user:{ 
            id: user._id,
            username: user.username,
            email: user.email
        }
    })  
}

/**
 * @name logoutUserController
 * @description clear token from user cookie and add the token to blacklist collection
 * @access public 
 */
async function logoutUserController(req, res){
    const token = req.cookies.token
    console.log("TOKEN:", token)
    if(token){
        await blacklistTokenModel.create({token})
    }
    res.clearCookie("token")
    res.status(200).json({
        message: "User logged out successfully"
    })
}
/**
 * @name getMeController
 * @description Get the details of the logged in user, expects token in the cookie
 * @access Private   
 */

async function getMeController(req, res){
    const user= await userModel.findById(req.user.id)

    res.status(200).json({
        message: "User details fetched successfully",
        user:{
            id: user._id,
            username: user.username,
            email: user.email
        }
    })

}



module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController
}