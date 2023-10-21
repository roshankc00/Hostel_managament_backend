import 'dotenv/config'
import jwt from 'jsonwebtoken'

export const createToken=(user)=>{

    const payload={
        email:user.email,
        id:user._id
    }

    const token=jwt.sign(payload,process.env.SECRET_KEY, {expiresIn:process.env.EXPIRES_IN})

    return token

}