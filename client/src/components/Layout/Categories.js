import { Container, Row, Col, Tab, Nav } from "react-bootstrap";   
import 'animate.css';
import TrackVisibility from 'react-on-screen';
import "../../styles/Categories.css"

import toast from "react-hot-toast";
import axios from "axios"; 
import { useState, useEffect } from "react"; 
import { Link } from "react-router-dom";


const Categories = () => {
  const [categories, setCategories] = useState([]);
  const img1 = "https://angelicasmarket.com/wp-content/uploads/2020/09/COMBO-VIVERES.png";
  const img2 = "https://angelicasmarket.com/wp-content/uploads/2020/09/COMBO-CARNES.png";
  const img3 = "https://angelicasmarket.com/wp-content/uploads/2020/09/COMBO-VERDURAS.jpg";
  const img4 = "https://www.nicepng.com/png/detail/355-3555175_refrescos-en-png-soft-drink.png";


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

   

  return (
    <section className="project" id="proyectos">
      <Container>
        <Row>
          <Col size={12}>
            <TrackVisibility>
              {({ isVisible }) => (
                <div className={isVisible ? "animate__animated animate__fadeIn" : ""}>
                  <h2 className="text-danger">Categorias</h2>
                  <p>Explora nuestras categorias de productos.</p>
                  <Tab.Container id="projects-tabs" defaultActiveKey="first">
                    <Tab.Content id="slideInUp" className={isVisible ? "animate__animated animate__slideInUp" : ""}>
                      <Tab.Pane eventKey="first">
                        <Row>
                          {categories.map((category, index) => (
                            
                            <Col size={12} sm={6} md={4} key={index}>
                              <Link to={`category/${category.codigo} `}>
                              <div className="proj-imgbx">
                                <img src={`/api/v1/category/category-photo/${category._id}`} alt={category.nombre} width="300px" />
                                <div className="proj-txtx">
                                  <h5>{category.nombre}</h5>
                                  <span>{category.descripcion}</span>
                                </div>
                              </div>
                            </Link>
                            </Col>
                           
                          ))}
                        </Row>
                      </Tab.Pane>
                    </Tab.Content>
                  </Tab.Container>
                </div>
              )}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
      <img className="background-image-right" src={img1} alt="Background" />
    </section>
  );
}

export default Categories;
