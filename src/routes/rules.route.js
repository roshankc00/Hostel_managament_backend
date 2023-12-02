import express from "express";
const router = express.Router();

import {
  addHostelRules,
  getAllRules,
  updateRule,
  deleteRule,
} from "../controllers/rules.controller.js";

router.post("/rules", addHostelRules);
router.post("/rules-hostel", getAllRules);
router.patch("/rules/:id", updateRule);
router.delete("/rules/:id", deleteRule);

export default router;
