import express from "express";
import {
  forgotPassword,
  getUser,
  loginUser,
  registerUser,
  resetPassword,
} from "../Controllers/user.controller.js";

const router = express.Router();

router.post("/register-user", registerUser);
router.post("/login-user", loginUser);
router.get("/get-user/:id", getUser);
router.post("/forgotuser", forgotPassword);
router.post("/passwordreset", resetPassword);

export default router;
