import express from "express";
import {
  getHostelAnalytics,
  getUserAnalytics,
  getOrderAnalytics,
} from "../controllers/analytics.controller.js";

const router = express.Router();

router.get("/analytics/hostels", getHostelAnalytics);
router.get("/analytics/users", getUserAnalytics);
router.get("/analytics/orders", getOrderAnalytics);

export default router;
