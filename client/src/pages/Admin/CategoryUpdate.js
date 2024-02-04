import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";
const { Option } = Select;

const CategoryUpdate = () => {

    const params = useParams()

    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [photo, setPhoto] = useState("");
    const [id, setId] = useState("");

    const getCategory = async () => {
        try {
          const { data } = await axios.get(`/api/v1/category/single-category/${params.id}`);
          console.log(data)
          setName(data.category.nombre); 
          setDescription(data.category.descripcion); 
          setId(data.category.codigo)
        } catch (error) {
          console.log(error);
        }
      };
    
      useEffect(() => {
        getCategory();
      }, []);
  
    // Crear producto
    const handleCreate = async (e) => {
      e.preventDefault();
  
      try {
        const productData = new FormData(); 
        productData.append("name", name);
        productData.append("description", description);
        productData.append("photo", photo); 
        
        const { data } = await axios.put(`/api/v1/category/update-category/${params.id}` , productData);
      
        if (data?.success) {
          toast.success(data?.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("Complete los campos en el formulario");
      }
    };
  
    return (
      <Layout title={"Registrar Categoria"}>
        <div className="">
          <div className="row">
            <div className="col-md-3">
              <AdminMenu />
            </div>
            <div className="col-md-9">
              <h1 className="mt-4">Registrar Categoria</h1>
              <form onSubmit={handleCreate}>
                <div className="row pt-3 pb-3 mb-3" style={{ backgroundColor: "#eee", borderRadius: "12px" }}>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <p>
                        <strong>Nombre de la categoria</strong>
                      </p>
                      <input
                        type="text" 
                        value={name}
                        name="name"
                        placeholder="Ingresa un nombre"
                        className="form-control"
                        onChange={(e) => setName(e.target.value)  }
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <p>
                        <strong>Descripción</strong>
                      </p>
                      <input
                        type="text" 
                        name="description"
                        value={description}
                        placeholder="Ingresa una descripción"
                        className="form-control"
                        onChange={(e) => setDescription(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                    {photo ? (
                  <div className="text-center">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt="product_photo"
                      height={"200px"}
                      className="img img-responsive"
                    />
                  </div>
                ) : (
                  <div className="text-center">
                    <img
                      src={`/api/v1/category/category-photo/${params.id}`}
                      alt="product_photo"
                      height={"200px"}
                      className="img img-responsive"
                    />
                  </div>
                )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                    <label className="btn btn-primary col-md-12">
        {photo ? photo.name : "Imagen"}
        <input
          type="file"
          name="photo"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files[0])}
          hidden
          required
        />
      </label>
                    </div>
                  </div>
                  {/* Puedes agregar más inputs aquí */}
                </div>
                <div className="mb-3">
                  <button type="submit" className="btn btn-primary">
                    Editar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Layout>
    );
  };
  
  export default CategoryUpdate;
  