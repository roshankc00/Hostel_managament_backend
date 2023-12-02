import express from "express";
import UserRoute from "./user.route.js";
import authRoute from "./oauth.route.js";
import hostelRoute from "./hostel.route.js";
import reviewRoute from "./review.route.js";
import faqRoute from "./faq.route.js";
import contactFormRoute from "./contactForm.route.js";
import rulesRoute from "./rules.route.js";
import timeRoutes from "./time.route.js";
import roomRoutes from "./roomRoute.js";
import orderRoutes from "./order.route.js";
import analyticsRoutes from "./analytics.route.js";

const router = express.Router();

router.use("/api/v1", UserRoute);
router.use("/api/v1", hostelRoute);
router.use("/api/v1", reviewRoute);
router.use("/api/v1", faqRoute);
router.use("/auth", authRoute);
router.use("/api/v1", contactFormRoute);
router.use("/api/v1", rulesRoute);
router.use("/api/v1", timeRoutes);
router.use("/api/v1", roomRoutes);
router.use("/api/v1", orderRoutes);
router.use("/api/v1", analyticsRoutes);

export default router;
