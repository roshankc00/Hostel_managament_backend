import express from "express";
const router = express.Router();

import {
  addHostelTime,
  deleteTimes,
  getAllTimes,
  updateTimes,
} from "../controllers/times.controller.js";
import { checkAuth, checkRole } from "../middlewares/auth.middleware.js";

router.post("/time", addHostelTime);
router.post("/time-hostel", getAllTimes);
router.patch("/time/:id", checkAuth, checkRole("owner"), updateTimes);
router.delete("/time/:id", checkAuth, checkRole("owner"), deleteTimes);

export default router;
