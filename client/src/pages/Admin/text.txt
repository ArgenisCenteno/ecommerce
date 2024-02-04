import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import { Modal, Button } from "antd";
import { useAuth } from "../../context/auth";
import { useNavigate, useParams } from "react-router-dom"; 
import axios from "axios";
import toast from "react-hot-toast";
import "../../styles/CartStyles.css";
import { Table, Select  } from 'antd';
const { Option } = Select
const AdminOrder = () => {
  const [auth, setAuth] = useAuth();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [codigo, setCodigo] = useState("")
  const [metodoPago, setMetodoPago] = useState("")
  const [orderData, setOrderData] = useState(null); // Estado para almacenar los datos de la orden
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState(["Sin procesar", "Pedido revisado", "Pedido enviado", "Pedido entregado"]);


   const getOrderData = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/v1/auth/order/${params._id}`);
        console.log(data)
        setOrderData(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

  useEffect(() => {
    
   
    getOrderData();
  }, []);
  
  const handleMarkAsPaid = async () => {
    try {
      const pagar = {
        paymentMethod: metodoPago,
        transactionId: codigo,
      };
      // Hacer la solicitud a la ruta /update-isPaid enviando el _id de la orden
      console.log(pagar)
      await axios.put(`/api/v1/auth/update-isPaid/${orderData?.order?._id}`,  pagar);

      // Mostrar un mensaje de éxito usando react-hot-toast
      toast.success("La orden ha sido marcada como pagada.");

      // Cerrar el modal de confirmación
      setShowModal(false);
      getOrderData()
      // Actualizar la información de la orden para reflejar el nuevo estado de pago
      
    } catch (error) {
      console.log(error);
      // Mostrar un mensaje de error en caso de que haya un problema con la solicitud
      toast.error("Ha ocurrido un error al marcar la orden como pagada.");
    }
  };

   // Manejar el cambio de estado de una orden
   const handleChange = async (orderId, value) => {
    try {
      setLoading(true);
      await axios.put(`/api/v1/auth/order-status/${orderId}`, {
        estadoEntrega: value,
      }); // Realizar una solicitud PUT para actualizar el estado de la orden utilizando la ruta "/api/v1/auth/order-status/:orderId"
      getOrderData(); // Volver a obtener las órdenes actualizadas después de cambiar el estado
      setLoading(false);

    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };


  return (
    <Layout title={"Orden"}>
    <div className="cart-page">
    <div className="row pt-20">
          
        </div>

      <div className="container" style={{ marginTop: "22px", paddingBottom: "22px" }}>
        <div className="row pb-4">
        <div className="col-lg-8 mb-4 pb-4">
          <h2 style={{backgroundColor: "#eee", borderRadius: "8px", padding: "12px"}}>Código: {orderData?.order?._id}</h2>  
            <h3>Productos pedidos:</h3>
            {orderData?.order?.productos?.map((p, index) => (
            <div className="card mb-3" key={index} style={{backgroundColor: "#eee", borderRadius: "8px", padding: "12px"}}>
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div className="d-flex flex-row align-items-center">
                    <div>
                      <img
                        src={`/api/v1/product/product-photo/${p._id}`}
                        className="img-fluid rounded-3"
                        alt="Shopping item"
                        style={{ width: '90px' }}
                      />
                    </div>
                    <div className="ms-3">
                      <h5>{p.nombre}</h5>
                       <p>{p.descripcion}</p>
                    </div>
                  </div>
                  <div className="d-flex flex-row align-items-center">
                    <div style={{ width: '50px' }}>
                      <h5 className="fw-normal mb-0">{p.quantity}</h5>
                    </div>
                    <div style={{ width: '80px' }}>
                      <h5 className="mb-0">Bs {p.precio}</h5>
                    </div>
                    
                  </div>
                </div>
              </div>
            </div>
          ))}

          </div>

          <div className="col-lg-4 cart-summary text-center" style={{backgroundColor: "#eee", borderRadius: "12px", paddingTop: "12px", paddingBottom: "12px"}}>
            <h2>Resumen de pago</h2> 
            <hr />
            {/* Show the total amount of the order */}
            <h2  >Total: {orderData?.order?.total?.toFixed(2)} Bs</h2>
            <h5 >Subtotal: {orderData?.order?.subtotal?.toFixed(2)} Bs</h5>
            <h5  >Costo:  {orderData?.order?.direccion.costo} Bs</h5>
            <hr />

            {/* Show the address details if available */}
            {orderData?.order?.direccion && (
  <>
    <div className="mb-3">
      <h4>
        <strong>Dirección de entrega</strong>
      </h4>
      <hr />
      <h5>
        <strong>Municipio:</strong> {orderData?.order?.direccion?.municipio}
      </h5>
      <h5>
        <strong>Parroquia:</strong> {orderData?.order?.direccion?.parroquia}
      </h5>
      <h5>
        <strong>Zona:</strong> {orderData?.order?.direccion?.zona}
      </h5>
      <h5>
        <strong>Calle:</strong> {orderData?.order?.direccion?.calle}
      </h5>
      <h5>
        <strong>Casa:</strong> {orderData?.order?.direccion?.casa}
      </h5>
      <h5>
        <strong>Indicaciones:</strong> {orderData?.order?.direccion?.indicaciones}
      </h5>
       
      <hr />
      
    </div>
  </>
)}
    <div className="mb-3">
      <h4>
        <strong>Estado de Entrega</strong>
      </h4>
      <hr />
      <h5 style={{color: "#059669"}}>
        {orderData?.order?.estadoEntrega}
      </h5>
      <Select
          defaultValue={orderData?.order?.estadoEntrega}
          style={{ width: 170 }}
          className='status-select'
          onChange={(value) => handleChange(orderData?.order?._id, value)}
        >
          {status.map((s) => (
            <Option key={s} value={s}>
              {s}
            </Option>
          ))}
        </Select>
      <h4>
      <hr />
  <strong>Estado de Pago</strong>
</h4>
 
{orderData?.order?.estadoPago ? (
 <>
  <h5 className="btn btn-success">
     Orden Pagada 
  </h5>

  <h5>Metodo de pago: {orderData?.order?.pago.paymentMethod}</h5>
  <h5>Código de pago: {orderData?.order?.pago.transactionId}</h5>
 </>
) : (
  <h5  >
    <p className="btn btn-danger"> Orden Sin Pagar</p> <br/> 
     <button type="success" className=" btn btn-warning mt-2 p-2" onClick={() => setShowModal(true)}>
          Completar pago
     </button>
  </h5>
)}
    </div>
          </div>
        </div>
      </div>
    </div>
    <Modal
        title="Confirmar pago"
        open={showModal}
        onOk={handleMarkAsPaid}
        onCancel={() => setShowModal(false)}
        okText="Confirmar"
        cancelText="Cancelar"
      >
        <h4>Completar pago de orden</h4>
        <form>
  <select className="form-control mb-4" value={metodoPago} name="metodoPago"onChange={(e) => setMetodoPago(e.target.value)}
           >
    <option value="Pago-Movil">Pago móvil</option>
    <option value="Transferencia">Trasnferencia</option>
    <option value="Punto de venta">Punto de venta</option>
  </select>
  <input type="text" className="form-control mb-4" value={codigo} name="codigo" onChange={(e) => setCodigo(e.target.value)} placeholder="Codigo de transacción" />
</form>
      </Modal>
  </Layout>
  

  );
};

export default AdminOrder;
