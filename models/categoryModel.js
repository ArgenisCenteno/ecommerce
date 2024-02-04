import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
  },
  codigo: {
    type: String,
    lowercase: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  imagen: {
    type: String,  
    required: true, 
  } 
});

export default mongoose.model("Categoria", categorySchema);
