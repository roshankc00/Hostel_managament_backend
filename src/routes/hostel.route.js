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
  deleteHostelImage,
  verifyHostelImage,
  activateHostelHandler,
  verifyHostelHandler,
  getAllHostelsForSuperAdminHandler,
  deleteHostelVerificationCertificate,
} from "../controllers/hostel.controller.js";
import upload from "../middlewares/multer.middleware.js";
import { checkAuth, checkRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/hostels", RegisterHostelHandler);
router.get("/hostels", getAllHostelHandler);
router.get("/hostels/featured", featuredHostel);
router.get("/hostels/:id", getSingleHostelHandler);
router.post(
  "/hostels/add-images",
  checkAuth,
  upload.array("image", 20),
  addImages
);
router.post(
  "/hostels/add-thumbnail",
  checkAuth,
  upload.single("image"),
  addthumbnailUrlHandler
);
router.post("/hostels/activate-hostel", activateHostelHandler);
router.get("/search-me", searchForHostel);
router.patch(
  "/hostels/:id",
  checkAuth,
  checkRole("owner"),
  updateHostelContentHandler
);
router.post(
  "/delete-hostel-image",
  checkAuth,
  checkRole("owner"),
  deleteHostelImage
);
router.post(
  "/verify-hostel-image",
  upload.single("image"),
  checkAuth,
  checkRole("owner"),
  verifyHostelImage
);
router.post(
  "/verify-hostel-status",
  checkAuth,
  checkRole("superAdmin"),
  verifyHostelHandler
);

router.get(
  "/hostels-superadmin",
  checkAuth,
  checkRole("superAdmin"),
  getAllHostelsForSuperAdminHandler
);
router.post(
  "/delete-hostel-certificate-image",
  checkAuth,
  checkRole("owner"),
  deleteHostelVerificationCertificate
);

export default router;
