import express from "express";
import {
  createContactForm,
  getAllContactForm,
  getSingleContactForm,
  deleteContactForm,
} from "../controllers/contact.controller.js";

const router = express.Router();

router.post("/contactForm", createContactForm);
router.get("/contactForm", getAllContactForm);
router.get("/contactForm/:id", getSingleContactForm);
router.delete("/contactForm/:id", deleteContactForm);

export default router;
