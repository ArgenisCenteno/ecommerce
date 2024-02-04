import mongoose from "mongoose";

const providerSchema = new mongoose.Schema({
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
  },
  venta: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model("Proveedor", providerSchema);
