import express from "express";
import {
  loginUserHandler,
  registerUserHandler,
  getSingleUserHandler,
  getAllUserHandler,
  changeEmailHandler,
  changePasswordHandler,
  changeNameHandler,
  activateUserHandler,
  forgetPasswordHandler,
  resetForgetPasswordHandler,
} from "../controllers/user.controler.js";
import { checkAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/users", registerUserHandler);
router.post("/users/login", loginUserHandler);
router.get("/users/:id", getSingleUserHandler);
router.get("/users", checkAuth, getAllUserHandler);
router.patch("/reset-email", checkAuth, changeEmailHandler);
router.patch("/reset-password", checkAuth, changePasswordHandler);
router.patch("/reset-name", checkAuth, changeNameHandler);
router.post("/activate-user", activateUserHandler);
router.post("/forget-password", forgetPasswordHandler);
router.post("/reset-forget-password", resetForgetPasswordHandler);

export default router;
