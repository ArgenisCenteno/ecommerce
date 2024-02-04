import express from "express";
import { isAdmin, requireSignIn } from "./../middlewares/authMiddleware.js"; 
import formidable from "express-formidable";
import { createProviderController, deleteProviderCOntroller, providerControlller, providerPhotoController, singleProviderController, updateProviderController } from "../controllers/providerController.js";
const router = express.Router();

//RUTAS
// CREAR CATEGORÍA
router.post(
  "/create-provider",
  requireSignIn,
  isAdmin,
  formidable(),
  createProviderController,
  
);

//ACTUALIZAR CATEGORÍA
router.put(
  "/update-provider/:id",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProviderController,
  
);

//OBTENER TODAS LAS CATEGORÍAS
router.get("/get-provider", providerControlller);

router.get("/provider-photo/:pid", providerPhotoController)

//CATEGORÍA INDIVIDUAL
router.get("/single-provider/:codigo", singleProviderController);

//ELIMINAR CATEGORIA
router.delete(
  "/delete-provider/:id",
  requireSignIn,
  isAdmin,
  deleteProviderCOntroller
);

export default router;
