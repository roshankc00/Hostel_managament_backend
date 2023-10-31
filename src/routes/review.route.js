import express from "express";
const router = express.Router();
import { checkAuth } from "../middlewares/auth.middleware.js";

import {
  createReviewHandler,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getAllReviewsOfHostelHandler,
} from "../controllers/review.controller.js";

router.post("/reviews", checkAuth, createReviewHandler);
router.get("/reviews", getAllReviews);
router.patch("/reviews/:id",checkAuth, updateReview);
router.delete("/reviews/:id", checkAuth, deleteReview);
router.get("/reviews/:id", getSingleReview);
router.post('/reviews-of-hostels',getAllReviewsOfHostelHandler)

export default router;
