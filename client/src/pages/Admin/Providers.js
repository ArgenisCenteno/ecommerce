import React, { useEffect, useState } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios"; 
import { Table } from "antd";
import { Link } from "react-router-dom";
import { Image } from "react-bootstrap-icons";

const Providers = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [visibleCreate, setVisibleCreate] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
 

  // OBTENER TODAS LAS CATEGORIAS
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/provider/get-provider");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Ha ocurrido un error al traer el proveedor");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

   

  // ELIMINAR CATEGORIA
  const handleDelete = async (pId) => {
    try {
      const { data } = await axios.delete(
        `/api/v1/provider/delete-provider/${pId}`
      );
      if (data.success) {
        toast.success(`Proveedor eliminado correctamente`);
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error inesperado");
    }
  };
    // Columnas de la tabla
    const columns = [
      {
        title: "Nombre",
        dataIndex: "nombre",
        key: "nombre",
        
      },
      {
        title: "Código",
        dataIndex: "codigo",
        key: "codigo",
 
      },
      {
        title: "Descripción",
        dataIndex: "codigo",
        key: "codigo",
 
      },
      {
        title: "Imagen",
        dataIndex: "codigo",
        key: "codigo",
        render: (imagen, record) => (
          <>
          <img src={`/api/v1/provider/provider-photo/${record._id}`} height="100px" className="card-img-top-dashboard" alt={record.name} />
    
          </>
        )
      },
      
      {
        title: "Acciones", 
        key: "acciones",
        render: (record) => (
          <>
          <Link
          to={`/dashboard/admin/update-provider/${record._id} `}
        className="btn btn-success ms-2"
        
      >
        Editar
      </Link>
      <button
        className="btn btn-danger ms-2"
        onClick={() => {
          handleDelete(record._id);
        }}
      >
        Eliminar
      </button>
          </>
        )
      },
    ];


  return (
    <Layout title={"Proveedores"}>
      <div className="container-fluid p-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1 className="mt-4 mb-4">Proveedores</h1>
            <div className="p-3 w-50">
             <Link to={"/dashboard/admin/create-provider"} className="btn btn-primary "  >Registrar proveedor</Link> 
             
            </div>
            <Table
              columns={columns}
               rowKey={(record) => record._id} 
              dataSource={categories} 
             
            />
              
            
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Providers;
