import express from "express";
const router = express.Router();
import { checkAuth } from "../middlewares/auth.middleware.js";

import {
  createReviewHandler,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
} from "../controllers/review.controller.js";

router.post("/review", checkAuth, createReviewHandler);
router.get("/review", getAllReviews);
router.patch("/review/update/:id", updateReview);
router.delete("/review/delete/:id", deleteReview);
router.get("/review/:id", getSingleReview);

export default router;
