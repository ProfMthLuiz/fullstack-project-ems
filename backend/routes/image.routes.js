import express from "express";
import { upload } from "../config/multer.js";
import ImageController from "../controllers/ImageController.js";

const router = express.Router();

// middleware multer recebe 5 imagens;
// middleware -> função que intercepta a requisição antes de seu destino final.
router.post("/products/:id/images", upload.array("imagens", 5), ImageController.createMany);
router.put("/:id", upload.single("imagem"), ImageController.update);
router.put("/update-many/:id", upload.array("imagens", 5), ImageController.updateMany);
router.delete("/:id", ImageController.destroy);

export default router;
