import React, { useEffect, useState } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios"; 
import { Table } from "antd";
import { Link } from "react-router-dom";
import { Image } from "react-bootstrap-icons";

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [visibleCreate, setVisibleCreate] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdatedName] = useState("");

  // FORMULARIO PARA CREAR CATEGORIA
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/v1/category/create-category", {
        name,
      });
      if (data?.success) {
        toast.success(`${name} ha sido creado`);
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // OBTENER TODAS LAS CATEGORIAS
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Ha ocurrido un error al crear la categoria");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  // ACTUALIZAR CATEGORIA
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `/api/v1/category/update-category/${selected._id}`,
        { name: updatedName }
      );
      if (data?.success) {
        toast.success(`${updatedName} ha sido actualizada`);
        setSelected(null);
        setUpdatedName("");
        setVisible(false);
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ELIMINAR CATEGORIA
  const handleDelete = async (pId) => {
    try {
      const { data } = await axios.delete(
        `/api/v1/category/delete-category/${pId}`
      );
      if (data.success) {
        toast.success(`Categoria eliminada correctamente`);
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
        title: "Código",
        dataIndex: "codigo",
        key: "codigo",
        render: (imagen, record) => (
          <>
          <img src={`/api/v1/category/category-photo/${record._id}`} height="100px" className="card-img-top-dashboard" alt={record.name} />
    
          </>
        )
      },
      
      {
        title: "Acciones", 
        key: "acciones",
        render: (record) => (
          <>
          <Link
          to={`/dashboard/admin/updateCategory/${record._id} `}
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
    <Layout title={"Categorias"}>
      <div className="container-fluid p-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1 className="mt-4 mb-4">Categorias</h1>
            <div className="p-3 w-50">
             <Link to={"/dashboard/admin/createCategory"} className="btn btn-primary "  >Registrar categoria</Link> 
             
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

export default CreateCategory;
