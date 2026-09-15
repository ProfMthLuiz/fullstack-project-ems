import { Router } from "express";
import UserController from "../controllers/UserController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { authorizeAdmin } from "../middlewares/authorizeAdmin.js";

const router = Router();

// Rotas Públicas
router.post("/forgot-password", UserController.forgotPassword);
router.post("/reset-password", UserController.resetPassword);
router.post("/register", UserController.store);

// Rotas Protegidas
router.get("/", authMiddleware, authorizeAdmin, UserController.index);
router.get("/:id", authMiddleware, UserController.show);
router.put("/:id", authMiddleware, UserController.update);
router.delete("/:id", authMiddleware, UserController.destroy);
router.patch("/:id/restore", authMiddleware, UserController.restore);

export default router;
