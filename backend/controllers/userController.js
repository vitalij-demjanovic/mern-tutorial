const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

// @desc Register new user
// @route POST /api/users
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
        res.status(400)
        throw Error('Please add all fields')
    }
    //CHeck user exist
    const userExist = await User.findOne({email})
    if (userExist) {
        res.status(400)
        throw new Error('User already exists')
    }
    //Hash password
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)

    //Create usser
    const user = await User.create({
        name,
        email,
        password: hashPassword
    })

    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generationJWT(user.id)
        })
    }else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})

// @desc Log In user
// @route POST /api/users
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    //Check for user email password
    const user = await User.findOne({email})

    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generationJWT(user.id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid credentials')
    }
})

// @desc User Data
// @route Get /api/users/me
const getMe = asyncHandler(async (req, res) => {
    res.status(200).json(req.user)
})


//Generate JWT
const generationJWT = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    } )
}

module.exports = {
    registerUser,
    loginUser,
    getMe
}