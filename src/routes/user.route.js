import express from 'express'
import { loginUserHandler, registerUserHandler , getSingleUserHandler} from '../controllers/user.controler.js'

const router=express.Router()


router.post('/users',registerUserHandler)
router.post('/users/login',loginUserHandler)
router.get('/users/:id',getSingleUserHandler)




export default router