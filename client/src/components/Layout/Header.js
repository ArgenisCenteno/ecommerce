 
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import SearchInput from "../Form/SearchInput";
import useCategory from "../../hooks/useCategory";
import { useCart } from "../../context/cart";
import hella from "./img/logo192.png";
import { Badge } from "antd"; 
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import {FaUserCog} from "react-icons/fa"
import ReactModal from "react-modal";
import axios from "axios"
import { useState, useEffect } from "react";

const formatUserName = (name) => {
  
  const namesArray = name.split(" ");
  if (namesArray.length === 4) {
    // Si tiene dos nombres y dos apellidos, mostrar primer nombre y segundo apellido
    return `${namesArray[0]} ${namesArray[2]}`;
  } else {
    // Si no, mostrar el nombre tal cual
    return name;
  }
};

const Header = () => {
  const [showSearchInput, setShowSearchInput] = useState(false);  
  const [auth, setAuth] = useAuth();
  const [buscar, setBuscar] = useState("")
  const [cart] = useCart();
  const categories = useCategory();
  const [categorias, setCategories] = useState([]);

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
  // CERRAR SESION
  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
    toast.success("Sesion cerrada");
  };
 

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-class  bg-body-tertiary pt-4 pb-2" >
        <div className="container-fluid">
          <button
            className="navbar-toggler iconHeader"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarTogglerDemo01"
            aria-controls="navbarTogglerDemo01"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"> 
           
 
            </span>
            
          </button>
             <div className="logo-container">
            <Link to={"/"} className="navbar-brand  title-header" style={{color: "white"}}>
               <img src={hella}  alt="logo-delivery" width="80px" height="80px" />
            {/*<img src={hella}  alt="logo-blanca" width="50px" height="50px" />*/}
            De todo un poco Online  
            </Link> 
             
            </div>

          <div className="collapse navbar-collapse" style={{zIndex: "10"}} id="navbarTogglerDemo01">
           
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0   ">
            <li className="nav-item  ">
              <button   className="btn btn-success nav-link " onClick={() => {
                          setShowSearchInput(true); ;
                        }}>
              Buscar
              </button>
              </li>

              {categorias.map((category, index) =>(
              <li className="nav-item  "> 
              <Link to={`/category/${category.codigo}`} className="nav-link">
              {category.nombre}
              </Link>
              </li>
              ) 
              )
              }
             
               
              
             
              {/*<li className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle"
                  to={"/categories"}
                  data-bs-toggle="dropdown"
                >
                  Categorias
                </Link>
                <ul className="dropdown-menu ">
                  <li>
                    <Link className="dropdown-item" to={"/categories"}>
                      Todas las categorias
                    </Link>
                  </li>
                  {categories?.map((c) => (
                    <li key={c._id}>
                      <Link
                        className="dropdown-item"
                        to={`/category/${c.slug}`}
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
                  </li>*/}

              {!auth?.user ? (
                <>
                  <li className="nav-item">
                    <NavLink to="/register" className="nav-link">
                      Registrarse
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/login" className="nav-link">
                      Acceder
                    </NavLink>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item dropdown">
                  <NavLink
                        className="nav-link text-white " 
                       role="button"
                       data-bs-toggle="dropdown"
                       style={{ border: "none" }}
                                 >
                              
                      <FaUserCog style={{fontSize: "25px", marginBottom: "7px"}}/>  
                        
                    </NavLink>
                    <ul className="dropdown-menu userDropDown">
                      <li>
                        <NavLink
                          to={`/dashboard/${
                            auth?.user?.role === 1 ? "admin" : "user/profile"
                          }`}
                          className="dropdown-item"
                        >
                          Configuración
                        </NavLink>
                        <NavLink
                          to={`/dashboard/user/orders`}
                          className="dropdown-item"
                        >
                          Mis pedidos
                        </NavLink>
                         
                      </li>
                      <li>
                        <NavLink
                          onClick={handleLogout}
                          to="/login"
                          className="dropdown-item"
                        >
                          Salir
                        </NavLink>
                      </li>
                    </ul>
                  </li>
                  
                </>
              )}
             
            </ul>
          </div>
         <ul  >
         <li className="iconHeaderPrincipal" style={{listStyle: "none"}}>
              <Link to={"/"} className="navbar-brand text-success d-lg-none" >
            <img src={hella}  alt="logo-blanca" width="100px" height="100px" />

            </Link></li> 
          </ul> 
                        <ul>
  
            
            <li className="nav-item fixed-cart-icon " style={{marginRight: "14px"}}>
              <NavLink to="/cart" className="nav-link " style={{ marginLeft: "32px", marginRight: "9px" }}>
                      <Badge
                        count={cart?.length}
                        style={{ color: "#e71717", background: "white" }}
                        showZero
                        offset={[10, -5]}
                      >
                        
                        <ShoppingCart style={{ color: "white" }} />
                      </Badge>
                    </NavLink>
              </li>  

                       

          </ul>
         
        
        </div>
       
      </nav>
      <ReactModal
              isOpen={showSearchInput}
              onRequestClose={() => setShowSearchInput(false)}
              style={{
                overlay: {
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                },
                content: {
                  top: "60%",
                  left: "50%",
                  right: "auto",
                  bottom: "auto",
                  marginRight: "-50%",
                  transform: "translate(-50%, -50%)",
                  borderRadius: "5px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                  padding: "20px",
                  width: "364px",
                  height: "220px", 
                },
              }}
            >
              <SearchInput
               
              />
            </ReactModal>
      
    </>
  );
};

export default Header;