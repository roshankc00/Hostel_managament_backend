import express from "express";
const router = express.Router();

import {
  addHostelRules,
  addHostelTime,
} from "../controllers/rulesAndTime.controller.js";

router.post("/addRule/:id", addHostelRules);
router.post("/addTime/:id", addHostelTime);

export default router;
