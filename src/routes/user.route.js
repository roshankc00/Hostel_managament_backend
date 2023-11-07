import express from "express";
import {
  loginUserHandler,
  registerUserHandler,
  getSingleUserHandler,
  getAllUserHandler,
} from "../controllers/user.controler.js";

const router = express.Router();

router.post("/users", registerUserHandler);
router.post("/users/login", loginUserHandler);
router.get("/users/:id", getSingleUserHandler);
router.get("/users", getAllUserHandler);

export default router;
