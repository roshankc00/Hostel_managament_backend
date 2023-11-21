import express from "express";
import {
  RegisterHostelHandler,
  addImages,
  addthumbnailUrlHandler,
  getAllHostelHandler,
  getSingleHostelHandler,
  updateHostelContentHandler,
  featuredHostel,
  searchForHostel,
} from "../controllers/hostel.controller.js";
import upload from "../middlewares/multer.middleware.js";
import { checkAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/hostels", RegisterHostelHandler);
router.get("/hostels", getAllHostelHandler);
router.get("/hostels/featured", featuredHostel);
router.get("/hostels/:id", getSingleHostelHandler);
router.post("/hostels/add-images", upload.array("image", 20), addImages);
router.post(
  "/hostels/add-thumbnail",
  upload.single("image"),
  addthumbnailUrlHandler
);
router.post("/search-me", searchForHostel);
router.patch("/hostels/:id", updateHostelContentHandler);

export default router;
