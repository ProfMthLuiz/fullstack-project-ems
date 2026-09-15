import express from "express";
import CategoryController from "../controllers/CategoryController.js";

const router = express.Router();

router.get("/", CategoryController.index);
router.get("/:id", CategoryController.show);
router.post("/", CategoryController.store);
router.put("/:id", CategoryController.update);
router.delete("/:id", CategoryController.destroy);

export default router;
