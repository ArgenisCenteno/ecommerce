import express from "express";
import { isAdmin, requireSignIn } from "./../middlewares/authMiddleware.js";
import {
  categoryControlller,
  categoryPhotoController,
  createCategoryController,
  deleteCategoryCOntroller,
  singleCategoryController,
  updateCategoryController,
} from "./../controllers/categoryController.js";
import formidable from "express-formidable";
const router = express.Router();

//RUTAS
// CREAR CATEGORÍA
router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  formidable(),
  createCategoryController,
  
);

//ACTUALIZAR CATEGORÍA
router.put(
  "/update-category/:id",
  requireSignIn,
  isAdmin,
  formidable(),
  updateCategoryController,
  
);

//OBTENER TODAS LAS CATEGORÍAS
router.get("/get-category", categoryControlller);

router.get("/category-photo/:pid", categoryPhotoController)

//CATEGORÍA INDIVIDUAL
router.get("/single-category/:codigo", singleCategoryController);

//ELIMINAR CATEGORIA
router.delete(
  "/delete-category/:id",
  requireSignIn,
  isAdmin,
  deleteCategoryCOntroller
);

export default router;
