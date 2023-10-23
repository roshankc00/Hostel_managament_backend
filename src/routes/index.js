import express from "express";
import UserRoute from "./user.route.js";
import authRoute from "./oauth.route.js";
import hostelRoute from "./hostel.route.js";
import reviewRoute from "./review.route.js";

const router = express.Router();

router.use("/api/v1", UserRoute);
router.use("/api/v1", hostelRoute);
router.use("/api/v1", reviewRoute);
router.use("/auth", authRoute);

export default router;
