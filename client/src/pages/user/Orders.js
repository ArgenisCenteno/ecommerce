import React, { useState, useEffect } from "react";
import UserMenu from "../../components/Layout/UserMenu";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import { useAuth } from "../../context/auth";
import moment from "moment";
import { Table, Button } from "antd";
import {TbTruckDelivery} from "react-icons/tb"
const { Column } = Table;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useAuth();
  
  

  // Obtener las órdenes del usuario autenticado
  const getOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/orders");
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  
  return (
    <Layout title={"Mis pedidos "}>
       <section >
<div className="container-fluid p-3  " >  
            <h1 className="text-center mt-4 mb-4">Mis pedidos <TbTruckDelivery  /> </h1>
            <Table dataSource={orders} rowKey="_id" pagination={true}>
              <Column title="#" dataIndex="_id" key="id" render={(text, record, index) => index + 1} />
              <Column
                title="Fecha"
                dataIndex="createdAt"
                key="createdAt"
                render={(createdAt) => moment(createdAt).format('YYYY-MM-DD HH:mm:ss')} 
              />
             <Column
  title="Estado de pago"
  dataIndex="estadoPago"
  key="estadoPago"
  render={(success) => (
    <button className={`btn ${success ? 'btn-success' : 'btn-danger'}`}>
      {success ? "Pagada" : "Sin pagar"}
    </button>
  )}
/>

               <Column
                title="Monto total"
                dataIndex="total"
                key="total"
              />
              <Column title="Estado" dataIndex="estadoEntrega" key="estadoEntrega" />
              
              
             
              
              <Column
                title="Detalles"
                key="detalles"
                render={(text, record) => (
                  <Button className="btn btn-primary" type="link" href={`/dashboard/user/order/${record._id}`}>
                    Detalles
                  </Button>
                )}
              />
            </Table>
           
      </div>

       </section>
      
      
    </Layout>
  );
};

export default Orders;
