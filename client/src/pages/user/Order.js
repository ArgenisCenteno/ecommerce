import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import {PayPalButtons } from '@paypal/react-paypal-js';  
import {  useParams, useNavigate } from "react-router-dom"; 
import axios from "axios";
import toast from "react-hot-toast"; 
import WhatsAppIcon from '@mui/icons-material/WhatsApp'; 
import {FaCcPaypal, FaCcMastercard, FaCcVisa} from "react-icons/fa"   
import {BsCash} from "react-icons/bs" 
import "../../styles/CartStyles.css";
import Swal from "sweetalert2" 
import { MdOutlineTroubleshoot } from "react-icons/md";
const Order = () => {   
  const params = useParams();
  const [loading, setLoading] = useState(false); 
  const [orderData, setOrderData] = useState(null); // Estado para almacenar los datos de la orden
  const [isPaying, setIsPaying] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false); // Estado para controlar la visibilidad del formulario

  const [formData, setFormData] = useState({
    banco: '',
    monto: 0,
    tipoTransaccion: '',
    codigoReferencia: ''
  });
  const [tasa, setTasa] = useState("");
  const [banco, setBanco] = useState("");
  const [documento, setDocumento] = useState("");
  const [telefono, setTelefono] = useState("");
   
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await axios.get("/api/v1/auth//all-config");
        const configData = response.data.config;

        // Establecer los valores de la configuración en los estados del componente 
        setTasa(configData.tasa); 
        setBanco(configData.banco);
        setTelefono(configData.telefono);   
        setDocumento(configData.documento)
      } catch (error) {
        console.error("Error al obtener la configuración:", error);
      }
    };

    fetchConfig();
  }, []); // La dependencia vacía asegura que esta función s
  const handleSubmit = async(e) => {
    // Aquí puedes manejar la lógica para enviar los datos del formulario
    // Puedes enviar los datos al servidor, actualizar el estado, etc.
    e.preventDefault()
    try {
      const orderId = params._id;
      console.log(formData)
      const { data } = await  axios.post("/api/v1/product/paywithbank", {
         value: formData,
          orderId, 
      }); 
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Pago enviado",
        showConfirmButton: true,
        timer: 2500
      }).then((result) =>{
        window.location.reload()  
   }) 
    
  } catch (error) {
      setIsPaying(false); 
      toast.error('Error al realizar el pago');
  }
    setShowPaymentForm(false);
  };
  useEffect(() => {
    setLoading(true);
    const getOrderData = async () => {
      try {
        const { data } = await axios.get(`/api/v1/auth/order/${params._id}`);
         
        setOrderData(data);
        console.log(data)
        formData.monto(orderData?.order?.total * tasa)
        setLoading(false);

      } catch (error) {
         
        setLoading(false);
      }
    };
    getOrderData();
  }, [params.slug]);

 
  const navigate = useNavigate();

  const onOrderCompleted = async (details) => {
    if ( details.status !== 'COMPLETED' ) {
      return toast.error('No hay pago en Paypal'); }

      setIsPaying(true);
      setLoading(true);

      try {
          const orderId = params._id;
          const { data } = await  axios.post("/api/v1/product/paypal-pay", {
              transactionId: details.id,
              orderId, 
          }); 
          setLoading(false);

          Swal.fire({
            position: "center",
            icon: "success",
            title: "Orden pagada, gracias por elegirnos ",
            showConfirmButton: true,
            timer: 2500
          }).then((result) =>{
            window.location.reload()  
       }) 
         
      } catch (error) {
          setIsPaying(false); 
          toast.error('Error al realizar el pago');
      }
   
  }
  const handlePaymentFormToggle = () => {
    setShowPaymentForm(!showPaymentForm);
  }

 
    
  return (
    <Layout title={"Por todo Delivery"} style={{ width: "100vw" }}>
    <section className="h-100 h-custom" style={{ backgroundColor: '#eee' }}>
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col">
            <div className="card">
              <div className="card-body p-4">
                <div className="row">
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
                        <p className="small mb-2">Aceptamos</p>
                        <FaCcPaypal style={{ fontSize: "40px", marginRight: "4px" }} />
                        <FaCcMastercard style={{ fontSize: "40px", marginRight: "4px" }} />
                        <FaCcVisa style={{ fontSize: "40px", marginRight: "4px" }} />
                        <BsCash style={{ fontSize: "40px", marginRight: "4px" }} />
                        <div className="d-flex justify-content-between">
                            <p className="mb-2">TASA DEL DOLAR</p>
                            <p className="mb-2">{tasa} Bs</p>
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
                          <p className="mb-2">USD {orderData?.order?.subtotal} </p>
                        </div>
                        <div className="d-flex justify-content-between">
                          <p className="mb-2">IVA</p>
                          <p className="mb-2">16%</p>
                        </div>
                        <div className="d-flex justify-content-between">
                          <p className="mb-2">Delivery</p>
                          <p className="mb-2"> USD {orderData?.order?.direccion?.costo}</p>
                        </div>
                        <div className="d-flex justify-content-between mb-4">
                          <p className="mb-2">Total en Dolares</p>
                          <p className="mb-2">USD {orderData?.order?.total} </p>
                        </div>
                        <div className="d-flex justify-content-between mb-4">
                          <p className="mb-2">Total en Boívares</p>
                          <p className="mb-2">BS {orderData?.order?.total * tasa} </p>
                        </div>
                        <h4>REALIZAR PAGO MOVIL</h4>
                        <div className="d-flex justify-content-between mb-4">
                          <p className="mb-2">Telefono</p>
                          <p className="mb-2">{telefono}</p>
                        </div>
                        <div className="d-flex justify-content-between mb-4">
                          <p className="mb-2">Docuemeto</p>
                          <p className="mb-2">{documento}</p>
                        </div>
                        <div className="d-flex justify-content-between mb-4">
                          <p className="mb-2">Banco</p>
                          <p className="mb-2">{banco}</p>
                        </div>
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
                        <p className="mb-0">¡Pediste {orderData?.order?.productos?.length} productos!</p>
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
                                <h5 className="mb-0 ml-3">Bs {p.precio} </h5>
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
                       orderData?.order?.pago?.transactionId ? (
                          <h2 className="text-center "  > <strong>¡Gracias por su compra!</strong> </h2>
                        ) : (
                          <>
                            <div className="mt-2 text-muted">
                              <h5 className="text-center  " >  <strong>Seleccione un metodo de pago</strong> </h5>
                              {orderData?.order?.total && (
                                <PayPalButtons
                                  createOrder={(data, actions) => {
                                    return actions.order.create({
                                      purchase_units: [
                                        {
                                          amount: {
                                            value: `${orderData?.order?.total}` ,
                                          },
                                        },
                                      ],
                                    });
                                  }} 
                                  onApprove={(data, actions) => {
                                    return actions.order.capture().then((details) => {
                                      onOrderCompleted( details );
                                    });
                                  }}
                                />
                              ) } 
                              <a href="https://wa.link/5ye7qg" target="_blank" style={{ textDecoration: "none" }}>
                                <button className="btn btn-primary btn-lg btn-block mt-4" style={{ width: "100%" }}> <WhatsAppIcon /> WhatsApp</button>
                              </a>
                              <button 
                          className="btn btn-primary btn-lg btn-block mt-4" 
                          style={{ width: "100%" }}
                          onClick={handlePaymentFormToggle} // Manejador para mostrar/ocultar el formulario
                        >
                          Pago Movil
                        </button>
                        {showPaymentForm && ( // Renderizar el formulario solo si showPaymentForm es verdadero
                           <form onSubmit={handleSubmit} className="p-3  mt-3  text-white bg-success">
                           <div className="mb-3">
                             <label htmlFor="banco" className="form-label">Banco</label>
                             <input type="text" className="form-control" id="banco" name="banco" value={banco} onChange={handleChange} required />
                           </div>
                           <div className="mb-3">
                             <label htmlFor="banco" className="form-label">Monto</label>
                             <input type="text" className="form-control" id="monto" name="monto"   onChange={handleChange} required />
                           </div>
                      
                           <div className="mb-3">
                             <label htmlFor="tipoTransaccion" className="form-label">Tipo de Transacción</label>
                             <select className="form-select" id="tipoTransaccion" name="tipoTransaccion"   onChange={handleChange} required>
                               <option value="">Seleccionar tipo de transacción</option> 
                               <option value="Pago Movil">Pago Movil</option>
                             </select>
                           </div>
                           <div className="mb-3">
                             <label htmlFor="codigoReferencia" className="form-label">Código de Referencia</label>
                             <input type="text" className="form-control" id="codigoReferencia" name="codigoReferencia"   onChange={handleChange} required />
                           </div>
                           <button type="submit" className="btn btn-primary">Enviar Pago</button>
                         </form>
                        )}
                            </div>
                          </>
                        )} 
                  </div>
  
                 
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </Layout>
  
  );
};

export default Order;
