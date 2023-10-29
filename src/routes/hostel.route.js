import express from 'express'
import { RegisterHostelHandler, addImages, addthumbnailUrlHandler, getAllHostelHandler, getSingleHostelHandler, updateHostelContentHandler } from '../controllers/hostel.controller.js'
import upload from '../middlewares/multer.middleware.js'
import { checkAuth } from '../middlewares/auth.middleware.js'

const router=express.Router()


router.post("/hostels",RegisterHostelHandler)
router.get("/hostels",getAllHostelHandler)
router.get("/hostels/:id",getSingleHostelHandler)
router.post('/hostels/add-images',upload.array("image",20),addImages)
router.post('/hostels/add-thumbnail',upload.single('image'),addthumbnailUrlHandler)
router.patch('/hostels/:id',updateHostelContentHandler)




export default router