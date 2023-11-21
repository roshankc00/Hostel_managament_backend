import express from "express";
import {
  createHostelRoom,
  deleteHostel,
  getAllRoomsOfHostel,
} from "../controllers/room.Controller.js";
import upload from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post("/room-hostel", upload.single("image"), createHostelRoom);
router.post("/get-room-hostel", getAllRoomsOfHostel);
router.delete("/room-hostel/:id", deleteHostel);

export default router;
