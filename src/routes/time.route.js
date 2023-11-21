import express from "express";
const router = express.Router();

import {
  addHostelTime,
  deleteTimes,
  getAllTimes,
  updateTimes,
} from "../controllers/times.controller.js";

router.post("/time", addHostelTime);
router.post("/time-hostel", getAllTimes);
router.patch("/time/:id", updateTimes);
router.delete("/time/:id", deleteTimes);

export default router;
