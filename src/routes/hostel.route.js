import express from 'express'
import { RegisterHostelHandler, addImages, getAllHostelHandler, getSingleHostelHandler } from '../controllers/hostel.controller.js'
import upload from '../middlewares/multer.middleware.js'

const router=express.Router()


router.post("/hostels",RegisterHostelHandler)
router.get("/hostels",getAllHostelHandler)
router.get("/hostels/:id",getSingleHostelHandler)
router.post('/hostels/add-images',upload.array("image",12),addImages)




export default router