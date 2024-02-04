import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
    } ,
    venta: {
      type: Number,
      default: 0,
    },
    codigo: {
      type: String,
      required: true,
    },
    precio: {
      type: Number,
      required: true,
    },
    precioCompra: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    descripcion: {
      type: String,
      required: true,
    }, 
    categoria: {
      type: mongoose.ObjectId,
      ref: "Categoria",
      required: true,
    },  
    proveedor: {
      type: mongoose.ObjectId,
      ref: "Proveedor",
      required: true,
    },  
    imagen: {
      type: String,  
      required: true, 
    }  
  },

 
  { timestamps: true }
);

export default mongoose.model("Productos", productSchema);
