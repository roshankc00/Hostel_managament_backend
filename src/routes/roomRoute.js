import express from "express";
import {
  EditHostelRoom,
  createHostelRoom,
  deleteHostelRoom,
  getAllRoomsOfHostel,
  getSingleHostelRoom,
} from "../controllers/room.Controller.js";
import upload from "../middlewares/multer.middleware.js";
import { checkAuth, checkRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
  "/room-hostel",
  checkAuth,
  checkRole("owner"),
  upload.single("image"),
  createHostelRoom
);
router.post("/get-room-hostel", getAllRoomsOfHostel);
router.delete(
  "/room-hostel/:id",
  checkAuth,
  checkRole("owner"),
  deleteHostelRoom
);
router.get("/room-hostel/:id", getSingleHostelRoom);
router.patch(
  "/room-hostel/:id",
  checkAuth,
  checkRole("owner"),
  upload.single("image"),
  EditHostelRoom
);

export default router;
