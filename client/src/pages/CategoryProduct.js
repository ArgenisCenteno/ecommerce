import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useParams, useNavigate, Link } from "react-router-dom";
import "../styles/CategoryProductStyles.css";
import { useCart } from "../context/cart";
import axios from "axios";
import toast from "react-hot-toast";

const CategoryProduct = () => {
  const [cart, setCart] = useCart();
  const params = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (params?.slug) {
      setLoading(true);
      getProductsByCat();
    }
  }, [params?.slug]);

  // Obtener productos por categoría
  const getProductsByCat = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/product-category/${params.slug}`
      );
      setProducts(data?.products);
      setCategory(data?.categoria);
      setTotal(data?.total);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Error al obtener los productos");
    }
  };

  return (
    <Layout title={"Por todo Delivery"}>
      <div className="container mt-6 category titlePageCategory">
        {loading ? (
          <div className="text-center text-success mt-4"> 
            <h1>Cargando...</h1>
          </div>
        ) : (
          <>
            <h1 className="text-center mt-4 text-success"  >
             {category?.nombre}
            </h1>
            
          </>
        )}

        <div className="row">
          <div className="col-md-12 offset-1">
            <div className="d-flex flex-wrap justify-content-center">
              {products?.map((p) => (
                <Link to={`/product/${p.codigo}`}  style={{textDecoration: "none"}}>
                <div className="card m-3 boxShadow" key={p._id}>
                  <img
                    src={`/api/v1/product/product-photo/${p._id}`}
                    className="card-img-top"
                    alt={p.nombre}
                  />
                  <div className="card-body">
                    <div className="card-name-price">
                      <h5 className="text-black " >{p.nombre}</h5>
                    </div> 
                    <h5 className="text-success" >USD {p.precio}</h5>

                  </div>
                </div>
                </Link>
                
              ))}
            </div>
            <div className="m-2 p-3">
              {products && products.length < total && (
                <button
                  className="btn btn-warning"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(page + 1);
                  }}
                >
                  Ver más
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryProduct;
