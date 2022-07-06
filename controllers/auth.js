const User = require("../models/User");
const {StatusCodes} = require("http-status-codes");
const {BadRequestError, UnauthenticatedError} = require("../errors");



const register = async(req, res) => {

    // hash the passwords will be done by schema.pre("save") method in models folder User.js file
    const user = await User.create({...req.body});
    // const token = jwt.sign({userId: user._id, name: user.name}, "jwtSecret", {expiresIn: "30d"})
    // above work will be done by schema.methods.anyname in models folder
    const token = user.createJWT();

    res.status(StatusCodes.CREATED).json({user: {name: user.name}, token});
}


const login = async(req, res) => {
    const {email, password} = req.body;
    if(!email || !password){
        throw new BadRequestError("Please provide email and password");
    }
    const user = await User.findOne({email})
    
    if(!user){
        throw new UnauthenticatedError("Invalid credentials");
    }
    // compare password
    const isPasswordCorrect = await user.comparePassword(password);
    if(!isPasswordCorrect){
        throw new UnauthenticatedError("Invalid credentials");
    }

    const token = user.createJWT()
    res.status(StatusCodes.OK).json({user: {name: user.name}, token})
}



module.exports = {
    register,
    login
    
}