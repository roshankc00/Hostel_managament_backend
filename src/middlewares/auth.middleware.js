import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
import UserModel from '../models/user.model.js'
import ErrorHandler from '../utils/errorHandler.js'






// check auth 
export const checkAuth=asyncHandler(async(req,res,next)=>{
    try {
        if(!req.headers.authorization){
            throw new Error("no token is attach to header")
        }
        let checktoken=req.headers.authorization.startsWith('Bearer')
        if(!checktoken){
            throw new Error("register first")
        }
        let token=req.headers.authorization.split(' ')[1]
        let decoded=jwt.verify(token,process.env.SECRET_KEY)
        const email=decoded.email
        const user=await UserModel.findOne({email})
        req.user=user 
        next()   
    } catch (error) {
        next(new ErrorHandler(error.message, 500))
    }
})





// check role 
export const checkRole=(...roles)=>(req,res,next)=>{
    if(roles.includes(req?.user?.role)){
        next()
    }else{
        res.status(400).json({
            sucess:false,
            message:"you are not authorized to acess this resource"
        
    })

    }
}

