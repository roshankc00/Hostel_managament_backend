import express from "express";
import {
  getHostelAnalytics,
  getUserAnalytics,
  getOrderAnalytics,
} from "../controllers/analytics.controller.js";
import { checkAuth, checkRole } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.get(
  "/analytics/hostels",
  checkAuth,
  checkRole("superAdmin"),
  getHostelAnalytics
);
router.get(
  "/analytics/users",
  checkAuth,
  checkRole("superAdmin"),
  getUserAnalytics
);
router.get(
  "/analytics/orders",
  checkAuth,
  checkRole("superAdmin"),
  getOrderAnalytics
);

export default router;
