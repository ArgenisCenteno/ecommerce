import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";
const { Option } = Select;

const UpdateProduct = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(""); 
  const [photo, setPhoto] = useState("");
  const [id, setId] = useState(""); 
  const [stock, setStock] = useState(""); 
  const [priceSale, setPriceSale] = useState("");

  // OBTENER PRODUCTO
  const getSingleProduct = async () => {
    try {
      const { data } = await axios.get(`/api/v1/product/get-product/${params.slug}`);
      setName(data.product.nombre);
      setId(data.product._id);
      setDescription(data.product.descripcion);
      setPrice(data.product.precio);
      setPriceSale(data.product.precioCompra);
      setStock(data.product.stock); 
      setCategory(data.product.categoria._id); 
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSingleProduct();
  }, []);

  // OBTENER CATEGORIAS
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al traer las categorias");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  // FUNCION PARA ACTUALIZAR PRODUCTO
  const handleUpdate = async (e) => {
    e.preventDefault();

    // Validar el campo de precio
    if (parseFloat(price) < 0) {
      toast.error("El precio no puede ser negativo");
      return;
    }

    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("stock", stock);
      productData.append("category", category);
      productData.append("priceSale", priceSale);

      photo && productData.append("photo", photo);

      const { data } = await axios.put(`/api/v1/product/update-product/${id}`, productData);

      if (data?.success) {
        toast.success(data?.message);
      } else {
        navigate(`/dashboard/admin/products`);
        toast.error("Error al actualizar producto");
      }
    } catch (error) {
      console.log(error);
      toast.error("Ocurrió un error inesperado");
    }
  };

  
  

   

  // ELIMINAR PRODUCTO
  const handleDelete = async () => {
    try {
      let answer = window.prompt("Estás seguro de querer eliminar este producto?");
      if (!answer) return;
      const { data } = await axios.delete(`/api/v1/product/delete-product/${id}`);
      toast.success("Producto eliminado correctamente");
      navigate("/dashboard/admin/products");
    } catch (error) {
      console.log(error);
      toast.error("Error inesperado");
    }
  };

  return (
    <Layout title={"Actualizar Producto"}>
    <div className=" ">
      <div className="row">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9">
<h1 className="mt-4">Actualizar Producto</h1>
<div className="row  pt-3 pb-3  mb-3" style={{backgroundColor: "#eee", borderRadius: "12px"}}>
 
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
                      src={`/api/v1/product/product-photo/${id}`}
                      alt="product_photo"
                      height={"200px"}
                      className="img img-responsive"
                    />
                  </div>
                )}
              </div>
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
        value={category}
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
  <div className="mb-4">
      <p>
        <strong>Stock</strong>
      </p>
      <input type="number"
      name="stock"
      value={stock}
      onChange={(e) => setStock(e.target.value)}
       step="any" className="form-control" 
       placeholder="Ingrese el stock" required/>
    </div>

  </div>
</div>
<div className="mb-3">
                <button className="btn btn-primary" onClick={handleUpdate}>
                  Actualizar Producto
                </button>
              </div>
              <div className="mb-3">
                <button className="btn btn-danger" onClick={handleDelete}>
                  Eliminar Producto
                </button>
              </div>
</div>

      </div>
    </div>
  </Layout>
  );
};

export default UpdateProduct;
