import express from 'express'
import UserRoute from './user.route.js'

const router=express.Router()


router.use('/api/v1',UserRoute)




export default router 