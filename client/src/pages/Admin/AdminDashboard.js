import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import axios from "axios";
import Inventory2Icon from '@mui/icons-material/Inventory2';
import CategoryIcon from '@mui/icons-material/Category';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import OrderChart from "./OrderChart";  

const AdminDashboard = () => {
  const [auth] = useAuth();
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0); 
  

  useEffect(() => {
    // Obtener los totales desde el servidor
    const getTotals = async () => {
      try {
        const responseProducts = await axios.get("/api/v1/auth/total-products");
        setTotalProducts(responseProducts.data.total);

        const responseOrders = await axios.get("/api/v1/auth/total-orders");
        setTotalOrders(responseOrders.data.total);

        const responseCategories = await axios.get("/api/v1/auth/total-categories");
        setTotalCategories(responseCategories.data.total);

        const responseUsers = await axios.get("/api/v1/auth/total-users");
        setTotalUsers(responseUsers.data.total);
      } catch (error) {
        console.log(error);
      }
    };

    getTotals();
  }, []);

  return (
    <Layout title={"Por todo Delivery"}>
      <div className=" ">
        <div className="row">
          <div className="col-md-3 ">
            <AdminMenu  />
          </div>
         
          <div className=" col-md-9 "> 
            <div className="row">
               <div className="col-md-3 mt-3">
                <div className="card" style={{border: "none", borderRadius: "12px"}}>
                  <div className="card-body bg-primary" style={{borderRadius: "12px"}}>
                    <h5 className="card-title text-white">Productos</h5>
                    <p className="card-text text-white">{totalProducts}</p>
                    <Inventory2Icon  style={{color: "white"}}/>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mt-3">
                <div className="card" style={{border: "none", borderRadius: "12px"}}>
                  <div className="card-body  bg-success" style={{borderRadius: "12px"}}>
                    <h5 className="card-title text-white">Pedidos</h5>
                    <p className="card-text text-white">{totalOrders}</p> 
                    <CategoryIcon style={{color: "white"}}/>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mt-3">
                <div className="card" style={{border: "none", borderRadius: "12px"}}>
                  <div className="card-body  bg-info" style={{borderRadius: "12px"}}>
                    <h5 className="card-title">Categorías</h5>
                    <p className="card-text">{totalCategories}</p>
                    <LoyaltyIcon/>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mt-3">
                <div className="card" style={{border: "none", borderRadius: "12px"}}>
                  <div className="card-body   bg-warning  text-white" style={{borderRadius: "12px"}}>
                    <h5 className="card-title text-white">Usuarios</h5>
                    <p className="card-text text-white">{totalUsers}</p>
                    <PeopleAltIcon/>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mt-3">
                <div className="card" style={{border: "none", borderRadius: "12px"}}>
                  <div className="card-body  bg-secondary" style={{borderRadius: "12px"}}>
                    <h5 className="card-title">Proveedores</h5>
                    <p className="card-text">{totalCategories}</p>
                    <LoyaltyIcon/>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mt-3">
                <div className="card" style={{border: "none", borderRadius: "12px"}}>
                  <div className="card-body  bg-primary" style={{borderRadius: "12px"}}>
                    <h5 className="card-title">Dolar</h5>
                    <p className="card-text">35.53</p>
                    <LoyaltyIcon/>
                  </div>
                </div>
              </div>
              
              <div className="col-12"  >
                  <OrderChart/>
              </div>
               
            </div>
           
           
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
