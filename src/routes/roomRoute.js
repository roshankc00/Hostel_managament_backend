import express from "express";
import {
  EditHostelRoom,
  createHostelRoom,
  deleteHostelRoom,
  getAllRoomsOfHostel,
  getSingleHostelRoom,
} from "../controllers/room.Controller.js";
import upload from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post("/room-hostel", upload.single("image"), createHostelRoom);
router.post("/get-room-hostel", getAllRoomsOfHostel);
router.delete("/room-hostel/:id", deleteHostelRoom);
router.get("/room-hostel/:id", getSingleHostelRoom);
router.patch("/room-hostel/:id", upload.single("image"), EditHostelRoom);

export default router;
