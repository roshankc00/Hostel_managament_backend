import express from "express";
const router = express.Router();
import { checkAuth } from "../middlewares/auth.middleware.js";

import {
  createReviewHandler,
  getAllReviews,
  getSingleReview,
} from "../controllers/review.controller.js";

router.post("/review", checkAuth, createReviewHandler);
router.get("/review", getAllReviews);
router.get("/review/:id", getSingleReview);

export default router;
