import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    productos: [{
        _id     : { type: mongoose.ObjectId, ref: 'Producto', required: true },
        nombre   : { type: String, required: true },
        descripcion    : { type: String, required: true }, 
        quantity: { type: Number, required: true },  
        precio: { type: Number, required: true },
      }
    ],
    total: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    estadoPago : { type: Boolean, required: true, default: false },
    pago: {}, 
    direccion: {},
    cliente: {
      type: mongoose.ObjectId,
      ref: "users",
    },
    estadoEntrega: {  
      type: String,
      default: "Sin procesar",
      enum: ["Sin procesar", "Pedido revisado", "Pedido enviado", "Pedido etregado"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
