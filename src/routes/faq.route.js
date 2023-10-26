import express from 'express'
import { createFaqHandler, deleteFaqHandler, getAllFaqHandler, getSingleFaqHandler, updateFaqHandler } from '../controllers/faq.controller.js'

const router=express.Router()


router.post('/faqs',createFaqHandler)
router.get('/faqs',getAllFaqHandler)
router.get('/faqs/:id',getSingleFaqHandler)
router.patch('/faqs/:id',updateFaqHandler)
router.delete('/faqs/:id',deleteFaqHandler)


export default router