import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";
const { Option } = Select;

const CreateProvider = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [photo, setPhoto] = useState("");
  
    // Crear producto
    const handleCreate = async (e) => {
      e.preventDefault();
  
      try {
        const productData = new FormData(); 
        productData.append("name", name);
        productData.append("description", description);
        productData.append("photo", photo); 
        
        const { data } = await axios.post("/api/v1/provider/create-provider", productData);
        console.log(data)
        if (data?.success) {
          toast.success(data?.message);
        } else {
          toast.danger("Verifique los campos para crear el producto");
          navigate("/dashboard/admin/create-product");
        }
      } catch (error) {
        console.log(error);
        toast.error("Complete los campos en el formulario");
      }
    };
  
    return (
      <Layout title={"Registrar Proveedor"}>
        <div className="">
          <div className="row">
            <div className="col-md-3">
              <AdminMenu />
            </div>
            <div className="col-md-9">
              <h1 className="mt-4">Registrar Proveedor</h1>
              <form onSubmit={handleCreate}>
                <div className="row pt-3 pb-3 mb-3" style={{ backgroundColor: "#eee", borderRadius: "12px" }}>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <p>
                        <strong>Nombre del proveedor</strong>
                      </p>
                      <input
                        type="text" 
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
                        placeholder="Ingresa una descripción"
                        className="form-control"
                        onChange={(e) => setDescription(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <p>
                        <strong>Imagen</strong>
                      </p>
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
                    Registrar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Layout>
    );
  };
  
  export default CreateProvider;
  