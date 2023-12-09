import express from "express";
import { checkAuth, checkRole } from "../middlewares/auth.middleware.js";
import {
  acceptOrderHandler,
  createOrder,
  findSingleOrder,
  getAllTheOrderOfHostel,
  getAllTheOrdersForSuperadmin,
  rejectOrderHandler,
} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/orders", checkAuth, createOrder);
router.get("/orders", checkAuth, getAllTheOrdersForSuperadmin);
router.post("/orders/:id", checkAuth, findSingleOrder);
router.post("/orders-of-hostels", checkAuth, getAllTheOrderOfHostel);
router.post(
  "/orders-accept",
  checkAuth,
  checkRole("owner"),
  acceptOrderHandler
);
router.post(
  "/orders-decline",
  checkAuth,
  checkRole("owner"),
  rejectOrderHandler
);
export default router;
