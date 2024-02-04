import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/cart"; 
import "../styles/ProductDetails.css"
import WhatsAppIcon from '@mui/icons-material/WhatsApp'; 

const ProductDetails = () => {
  const [cart, setCart] = useCart();
  const params = useParams();
  const navigate = useNavigate();
  const [tasa, setTasa] = useState("");
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]); 
  const [selectedQuantity, setSelectedQuantity] = useState(1); 
  const [inputFocused, setInputFocused] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState(null);

  const handleInputFocus = () => {
    setInputFocused(true);
  };

  const handleInputBlur = () => {
    setInputFocused(false);
  };

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await axios.get("/api/v1/auth//all-config");
        const configData = response.data.config;

        // Establecer los valores de la configuración en los estados del componente 
        setTasa(configData.tasa); 
      } catch (error) {
        console.error("Error al obtener la configuración:", error);
      }
    };

    fetchConfig();
  }, []); // La dependencia vacía asegura que esta función s

    // Obtener el producto por slug
    const getProduct = async () => {
      try {
        const { data } = await axios.get(
          `/api/v1/product/get-product/${params.slug}`
        );
        setProduct(data?.product);
        getSimilarProduct(data?.product._id, data?.product.categoria._id);
      } catch (error) {
        console.log(error);
      }
    };
  

  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);


  // Obtener productos similares
  const getSimilarProduct = async (productId, categoryId) => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/related-product/${productId}/${categoryId}`
      );
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

   
  // Agregar producto al carrito
  const handleAddToCart = () => {
    

    const productData = {
      _id: product._id,
      nombre : product.nombre,
      descripcion: product.descripcion,
      precio: product.precio,
      categoria: product.categoria, 
      quantity: selectedQuantity, 
    };

    setCart([...cart, productData]);
    localStorage.setItem("cart", JSON.stringify([...cart, productData]));
    toast.success("Agregado al carrito");
  };

  return (
    <Layout title="De todo un poco Online">
       <a href="https://api.whatsapp.com/send?phone=+51987654321" class="btn-wsp" target="_blank">
	    <WhatsAppIcon style={{fontSize: "64px"}}/>
	</a>
      <div className="d-flex justify-content-center p-3 align-content-center align-items-center row   product-details boxShadowInfo">
      <div className="col-md-4 col-sm-4">
        {product._id ? (
            <img
              src={`/api/v1/product/product-photo/${product._id}`}
               className="card-img-top product-image"
              
               alt={product.nombre}
               
               
            />
            ) : (
           <p>Imagen no disponible</p>
            )}
 
        </div>
        <div className="col-md-5 m-2  product-details-info ">
          <h1 className="text-left text-success" >{product.nombre}</h1>   
           
          <h6  text-muted>  {product.descripcion}</h6>
          {product.stock === 0 || product.stock < 0  && <p className="unavailable-label">No disponible</p>}
          <h6  text-muted><strong>Categoría:</strong> {product?.categoria?.nombre}</h6>
          <div> 
           
               
            <h2  text-muted>USD {product.precio}</h2>
            <h3  text-muted>BS {(product.precio * tasa).toFixed(2)}
</h3>
           
   
     <div className="col-6 col-sm-6 d-flex align-items-center mb-4">
    <button
      className="btn  btn-danger"
      onClick={() => setSelectedQuantity((prev) => Math.max(prev - 1, 1))}
    >
      -
    </button>
    <input
      className="form-control inputQuantity mx-2 " 
      type="number"
      min={1}
      value={selectedQuantity}
      onChange={(e) => setSelectedQuantity(Number(e.target.value))}
    />
   <button
  className="btn  btn-primary"
  onClick={() =>
    setSelectedQuantity((prev) =>
      Math.min(prev + 1 )
    )
  }
>
  +
</button>
  
 
</div>
          </div>

          <button
            className="btn btn-outline-dark  ms-1 "
            disabled={product.quantity === 0}
            onClick={handleAddToCart}
            
          >
            Agregar al carrito
          </button>
        </div>
        
      </div>
      <hr />
      <div className="d-flex justify-content-center  align-content-center align-items-center  row   similar-products">
          <h2 className="text-success mt-4 mb-4  text-center">Quizás te pueda interesar</h2>
        {relatedProducts.length < 1 && (
          <p className="text-center">Sin productos similares</p>
        )}
       
        <div className="d-flex flex-wrap justify-content-center mt-4 mb-4  ">
         
          {relatedProducts?.map((p) => (
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
      </div>
    </Layout>
  );
};

export default ProductDetails;
