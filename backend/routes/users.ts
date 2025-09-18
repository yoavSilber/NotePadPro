import express from "express";
import { createUser, loginUser } from "../controllers/userController";

const router = express.Router();

router.post("/users", createUser);
router.post("/login", loginUser);

export default router;
