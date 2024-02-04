import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";
import axios from  "axios";
 
import dotenv from "dotenv";
import cloudinary from "cloudinary";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//CREAR CATEGORIA
export const createCategoryController = async (req, res) => {
  try { 
    const { name, description } = req.fields;
    const { photo } = req.files;
    if (!name) {
      return res.status(401).send({ message: "Nombre es requerido" });
    }
    const existingCategory = await categoryModel.findOne({nombre: name });
    if (existingCategory) {
      return res.status(200).send({
        success: false,
        message: "Esta categoría existe",
      });
    }

    const cloudinaryResult = await cloudinary.uploader.upload(photo.path, {
      folder: "productos", // Nombre de la carpeta donde se almacenarán las fotos en Cloudinary
      use_filename: true, // Utilizar el nombre original del archivo
    });
    const category = await new categoryModel({
      nombre: name,
      codigo: slugify(name),
      imagen: cloudinaryResult.secure_url,
      descripcion: description
    }).save();
    res.status(201).send({
      success: true,
      message: "Nueva categoría creada",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error al crear categoría",
    });
  }
};

//ACTUALIZAR CATEGORIA
export const updateCategoryController = async (req, res) => {
  try {
    const { name, description } = req.fields;
    const {photo} = req.files;
     

    
    let category = await categoryModel.findById(req.params.id);

    if (!category) {
      return res.status(404).send({ error: "Categoria no encontrada" });
    } 

    if (photo) {
      // Sube la nueva foto a Cloudinary
      const result = await cloudinary.uploader.upload(photo.path, {
        folder: 'productos', // Establece el nombre de la carpeta deseada en Cloudinary

      }); 

      
    category.imagen = result.secure_url;
    }

    category.nombre = name; 
    category.codigo = slugify(name);
    category.descripcion = description;   

    // Guardar los cambios en la base de datos
    await category.save();
    res.status(200).send({
      success: true,
      message: "Categoria actualizada",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error interno",
    });
  }
};

//TODAS LAS CATEGORÍAS
export const categoryControlller = async (req, res) => {
  try {
    const category = await categoryModel
    .find({})
    res.status(200).send({
      success: true,
      message: "Lista de categorías",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error al listar las categorías",
    });
  }
};

// UNA SOLA CATEGORÍA
export const singleCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ _id: req.params.codigo })
    .select("-imagen"); 
    res.status(200).send({
      success: true,
      message: "Categoría individual",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error al traer una categoría",
    });
  }
};

//ELIMINAR CATEGORÍA
export const deleteCategoryCOntroller = async (req, res) => {
  try {
    const { id } = req.params;
    await categoryModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Categoría eliminada",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error al eliminar categoría",
      error,
    });
  }
};

export const categoryPhotoController = async (req, res) => {
  try {
    
    const category = await categoryModel.findById(req.params.pid).select("imagen");
    
    if (category.imagen) {
      // Descargar la imagen desde Cloudinary
      const response = await axios.get(category.imagen, { responseType: 'arraybuffer' });
      const imageBuffer = Buffer.from(response.data, 'binary');

      // Enviar la imagen como una respuesta binaria
      return res.status(200).send(imageBuffer);
    } else {
      // Si no hay foto disponible, puedes enviar una respuesta de error o una imagen de reemplazo por defecto
      return res.status(404).send({ message: "Foto no encontrada" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error al traer foto",
      error,
    });
  }
};