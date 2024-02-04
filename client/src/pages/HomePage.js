import React, { useState, useEffect } from "react";
import {  Link } from "react-router-dom"; 
import axios from "axios"; 
import Layout from "./../components/Layout/Layout";  
import "../styles/Homepage.css";  
import { Banner } from "../components/Layout/Banner.js";
import Brands from "../components/Layout/Brands";
import Categories from "../components/Layout/Categories";
import WhatsAppIcon from '@mui/icons-material/WhatsApp'; 

const HomePage = () => { 
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); 
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [foundProducts, setFoundProducts] = useState(true);   

  // OBTENER TODAS LAS CATEGORIAS
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // OBTENER PRODUCTOS
  const getAllProducts = async (page = 1) => {
    try {
      setLoading(true);
      const {data}  = await axios.get(`/api/v1/product/product-sales`);
      console.log(data)
      setLoading(false);
      setProducts(data);
      setFoundProducts(data.length > 0);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  
  

   

  // OBTENER NUMERO TOTAL DE PRODUCTOS
  const getTotal = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/product-count");
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };
  

  useEffect(() => {
    getAllCategory();
    getTotal();
    getAllProducts()
  }, []); // Asegúrate de agregar currentPage como dependencia aquí

    
   
  return (
    <>
      <Layout title={"Por todo Delivery"} >
      <a href="https://api.whatsapp.com/send?phone=+584249604445" class="btn-wsp" target="_blank">
	    <WhatsAppIcon style={{fontSize: "64px"}}/>
	</a>
       <Banner/>
       <Brands/>
       <Categories/> 
       
      </Layout>
    </>
  );
};

export default HomePage;