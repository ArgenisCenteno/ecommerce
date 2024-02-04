import React from "react";
import Layout from "./../components/Layout/Layout";
import { useSearch } from "../context/search";
import { useCart } from "../context/cart";
 
import { Link, useNavigate } from "react-router-dom";

const Search = () => {
  const navigate = useNavigate();
  const [values, setValues] = useSearch();
   
  return (
    <Layout title={"Resultados de búsqueda"}> 
      <div className="container">
        <div className="text-center text-success mt-4 mb-4">
          <h3 className="mt-4"  style={{  marginTop: "53px"}}>Resultados de {values?.keyword}</h3>
          <h5 className="text-success"   >
            {values?.results.length < 1
              ? "No se encontraron productos"
              : `Resultado ${values?.results.length}`}
          </h5>
          <div className="d-flex flex-wrap justify-content-center mt-4">
            {values?.results.map((p, index) => (
                <Link to={`/product/${p.codigo}`}  style={{textDecoration: "none"}}>
                <div className="card m-2 boxShadow" key={p._id}>
                  <img
                    src={`/api/v1/product/product-photo/${p._id}`}
                    className="card-img-top"
                    alt={p.nombre}
                  />
                  <div className="card-body">
                    <div className="card-name-price">
                      <h5 className="text-black" >{p.nombre}</h5>
                      <h5 className="text-success" >Bs {p.precio}</h5>
                    </div> 
                  </div>
                </div>
                </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Search;


