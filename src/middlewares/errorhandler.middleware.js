import ErrorHandler from '../utils/errorHandler.js';

export const ErrorHandlerMiddleware=(err,req,res,next)=>{
    err.statusCode=err.statusCode || 500;
    err.message=err.message || "Internal Server error"

    // database bug 
    if(err.name==="CastError"){
        const message= ` Resource not found .Invalid  ${err.keyValue} entered`
        err=new ErrorHandler(message,400)
    }

    // jwt bug 


    if(err.name==="JsonWebTokenError"){
        const message="Json web token invalid , try again"
        err=new ErrorHandler(message,400)
    }

    // jwt expire 
    if(err.name==="TokenExpired"){
        const message="Json web token expired , try again"
        err=new ErrorHandler(message,400)

    }

    res.status(err.statusCode).json({
        success:false,
        message:err.message
    })



}
