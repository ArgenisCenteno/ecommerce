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
      <div className="row pt-20"></div>

      <div className="container" style={{ marginTop: "22px", paddingBottom: "22px" }}>
        <div className="row pb-4">
        <div className="col-lg-5">
                    <div className="card bg-success text-white rounded-3">
                      {orderData?.order?.estadoPago ? (
                        <h2 className="text-center text-white p-4 m-0" style={{ borderRadius: "6px" }}>
                          <strong>¡Orden Pagada!</strong>
                        </h2>
                      ) : (
                        <h2 className="text-center text-white bg-danger p-4 m-0" style={{ borderRadius: "9px" }}>
                          <strong>Orden sin pagar</strong>
                        </h2>
                      )}
  
                      <hr className="my-4" />
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                          <h5 className="mb-0">Información de compra</h5>
                          <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-6.webp"
                            className="img-fluid rounded-3"
                            style={{ width: '45px' }}
                            alt="Avatar"
                          />
                        </div> 
  
                        <form className="mt-4">
                          <div className="d-flex justify-content-between">
                            <p className="mb-2">ID</p>
                            <p className="mb-2">{orderData?.order?._id}</p>
                          </div>
                          <div className="d-flex justify-content-between">
                            <p className="mb-2">Municipio</p>
                            <p className="mb-2">{orderData?.order?.direccion?.municipio}</p>
                          </div>
                          <div className="d-flex justify-content-between">
                            <p className="mb-2">Parroquia</p>
                            <p className="mb-2">{orderData?.order?.direccion?.parroquia}</p>
                          </div>
                          <div className="d-flex justify-content-between">
                            <p className="mb-2">Zona</p>
                            <p className="mb-2">{orderData?.order?.direccion?.zona}</p>
                          </div>
                          <div className="d-flex justify-content-between">
                            <p className="mb-2">Calle</p>
                            <p className="mb-2">{orderData?.order?.direccion?.calle}</p>
                          </div>
                          <div className="d-flex justify-content-between">
                            <p className="mb-2">Casa</p>
                            <p className="mb-2">{orderData?.order?.direccion?.casa}</p>
                          </div>
                          <div className="d-flex justify-content-between">
                            <p className="mb-2">Indicaciones</p>
                            <p className="mb-2">{orderData?.order?.direccion?.indicaciones}</p>
                          </div>
                        </form>
                        <hr className="my-4" />
                        <div className="d-flex justify-content-between">
                          <p className="mb-2">Subtotal</p>
                          <p className="mb-2">USD {orderData?.order?.subtotal}   </p>
                        </div>
                        <div className="d-flex justify-content-between">
                          <p className="mb-2">IVA</p>
                          <p className="mb-2">16%</p>
                        </div>
                        <div className="d-flex justify-content-between">
                          <p className="mb-2">Delivery</p>
                          <p className="mb-2">USD  {orderData?.order?.direccion?.costo} </p>
                        </div>
                        <div className="d-flex justify-content-between mb-4">
                          <p className="mb-2">Total en Dolares</p>
                          <p className="mb-2">USD {orderData?.order?.total} </p>
                        </div>
                        <div className="d-flex justify-content-between mb-4">
                          <p className="mb-2">Total en Boívares</p>
                          <p className="mb-2">BS {Number(orderData?.order?.total) / 35.53} </p>
                        </div>
                        { orderData?.order?.pago ? (
                          <>
                          <div className="d-flex justify-content-between mb-4">
                           <p className="mb-2">Metodo de pago </p>
                           <p className="mb-2">{orderData?.order?.pago.paymentMethod}</p>
                         </div>
                         <div className="d-flex justify-content-between mb-4">
                           <p className="mb-2">Código de transacción </p>
                           <p className="mb-2">{orderData?.order?.pago.transactionId}</p>
                         </div>
                          </>
                        ):(
                          <div className="d-flex justify-content-between mb-4">
                          <p className="mb-2">No se ha pagado</p>
                          <p className="mb-2"> </p>
                        </div>
                        )
                           
                        }
                        <h5  >
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
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-7">
                    {orderData?.order?.estadoPago ? (
                      <h5 className=" mb-3">Detalles de la orden</h5>
                    ) : (
                      <h5>Detalles de la orden</h5>
                    )}
                    <hr />
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div>
                        <p className="mb-0">Tiene {orderData?.order?.productos?.length} productos!</p>
                      </div>
                    </div>
                    {orderData?.order?.productos?.map((p, index) => (
                      <div className="card mb-3" key={index}>
                        <div className="card-body">
                          <div className="d-flex justify-content-between">
                            <div className="d-flex flex-row align-items-center">
                              <div>
                                <img
                                  src={`/api/v1/product/product-photo/${p._id}`}
                                  className="img-fluid rounded-3"
                                  alt="Shopping item"
                                  style={{ width: '65px' }}
                                />
                              </div>
                              <div className="ms-2">
                                <h5>{p.nombre}</h5>
                                <p className="small mb-0">{p.descripcion}</p>
                              </div>
                            </div>
                            <div className="d-flex flex-row align-items-center">
                              <div style={{ width: '60px' }}>
                                <h5 className="fw-normal mb-0 ml-2">{p.quantity}</h5>
                              </div>
                              <div style={{ width: '70px' }}>
                                <h5 className="mb-0 ml-3">Bs {p.precio}</h5>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <hr className="my-4" />
                    {loading ? (
                        <h2 className="text-center">Cargando...</h2>
                      ):
                         orderData?.order?.estadoPago ? (
                          <h2 className="text-center "  > <strong>Esta orden fue pagada</strong> </h2>
                        ) : (
                          <>
                            <div className="mt-2 text-muted">
                              <h5 className="text-center  " >  <strong>Seleccione un metodo de pago</strong> </h5>
                              {orderData?.order?.total && (
                                  <button type="success" className=" btn btn-warning mt-2 p-2" onClick={() => setShowModal(true)}>
                                  Completar pago
                             </button>
                              ) } 
                               
                            </div>
                          </>
                        )} 
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
        <select
          className="form-control mb-4"
          value={metodoPago}
          name="metodoPago"
          onChange={(e) => setMetodoPago(e.target.value)}
        >
          <option value="Pago-Movil">Pago móvil</option>
          <option value="Transferencia">Trasnferencia</option>
          <option value="Punto de venta">Punto de venta</option>
        </select>
        <input
          type="text"
          className="form-control mb-4"
          value={codigo}
          name="codigo"
          onChange={(e) => setCodigo(e.target.value)}
          placeholder="Codigo de transacción"
        />
      </form>
    </Modal>
  </Layout>
  

  );
};

export default AdminOrder;
