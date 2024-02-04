import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";
const { Option } = Select;

const CreateProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [priceSale, setPriceSale] = useState("");
  const [category, setCategory] = useState(""); 
  const [photo, setPhoto] = useState(""); 
  const [provider, setProvider] = useState([]); 
  const [providerSelected, setProviderSelected] = useState(""); 
   
  const [formValid, setFormValid] = useState(false);
  

  // Obtener todas las categorías
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Ha ocurrido un error al consultar las categorias");
    }
  };
  const getAllProvider= async () => {
    try {
      const { data } = await axios.get("/api/v1/provider/get-provider");
      if (data?.success) {
        setProvider(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Ha ocurrido un error al traer el proveedor");
    }
  };

  useEffect(() => {
    getAllCategory();
    getAllProvider();
  }, []);

   

  // Crear producto
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      
      const productData = new FormData();
      productData.append("name", name);
      productData.append("provider", providerSelected);
      productData.append("stock", stock);
      productData.append("price", price);
      productData.append("priceSale", priceSale);
      productData.append("description", description); 
      productData.append("photo", photo);
      productData.append("category", category);  

      const { data } = await axios.post("/api/v1/product/create-product", productData);

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
    <Layout title={"Registrar Producto"}>
      <div className="">
        <div className="row ">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
  <h1 className="mt-4">Registrar Producto</h1>
  <div className="row  pt-3  pb-3  mb-3" style={{backgroundColor: "#eee", borderRadius: "12px"}}>
   
    <div className="col-md-6">
      <div className="mb-3">
        <p>
          <strong>Nombre del producto</strong>
        </p>
        <input
          type="text"
          value={name}
          placeholder="Ingresa un nombre"
          className="form-control"
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <p>
          <strong>Descripción</strong>
        </p>
        <input
          type="text"
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
        <p>
          <strong>Precio de venta</strong>
        </p>
        <input
          type="number"
          step="any"
          name="price"
          value={price}
          placeholder="Precio de venta"
          className="form-control"
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <p>
          <strong>Precio de compra</strong>
        </p>
        <input
          type="number"
          step="any"
          value={priceSale} 
          name="priceSale"
          placeholder="Precio de compra"
          className="form-control"
          onChange={(e) => setPriceSale(e.target.value)}
          required
        />
      </div>
 
    </div>
    <div className="col-md-6">
    <div  className="mb-3">
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
    <div className="col-md-6">
      <div className="mb-3">
        <p>
          <strong>Categoría</strong>
        </p>
        <Select
          bordered={false}
          placeholder="Categoría"
          size="large"
          showSearch
          className="form-select mb-3"
          onChange={(value) => {
            setCategory(value);
          }}
        >
           {categories?.map((c) => (
                  <Option key={c._id} value={c._id}>
                    {c.nombre}
                  </Option>
                ))}
        </Select>
      </div>
      
    </div>

    <div className="col-md-6">
      <div className="mb-3">
        <p>
          <strong>Proveedor</strong>
        </p>
        <Select
          bordered={false}
          placeholder="Proveedor"
          size="large"
          showSearch
          className="form-select mb-3"
          onChange={(value) => {
            setProviderSelected(value);
          }}
        >
           {provider?.map((c) => (
                  <Option key={c._id} value={c._id}>
                    {c.nombre}
                  </Option>
                ))}
        </Select>
      </div>
      
    </div>
    <div className="col-md-6">
    <div className="mb-4">
        <p>
          <strong>Stock</strong>
        </p>
        <input type="number"
        name="stock"
        onChange={(e) => setStock(e.target.value)}
         step="any" className="form-control" 
         placeholder="Ingrese el stock" required/>
      </div>

    </div>
  </div>
  <div className="mb-3">
    <button className="btn btn-primary" onClick={handleCreate} >
      Registrar
    </button>
  </div>
</div>

        </div>
      </div>
    </Layout>
  );
};

export default CreateProduct;
