import express from "express";
import { checkAuth } from "../middlewares/auth.middleware.js";
import {
  createOrder,
  findSingleOrder,
  getAllTheOrderOfHostel,
} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/orders", checkAuth, createOrder);
router.post("/orders/:id", checkAuth, findSingleOrder);
router.post("/orders-of-hostels", checkAuth, getAllTheOrderOfHostel);
export default router;
