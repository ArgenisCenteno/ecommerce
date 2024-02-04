import React, { useState, useEffect } from 'react' 
import axios from "axios"
import toast from 'react-hot-toast';
import Carousel from 'react-multi-carousel';  
import 'react-multi-carousel/lib/styles.css';
import "../../styles/Brands.css"


const Brands = () => {

  const [categories, setCategories] = useState([])

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/provider/get-provider");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Ha ocurrido un error al traer el proveedor");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);
   
    const responsive = {
        superLargeDesktop: { 
          breakpoint: { max: 4000, min: 3000 },
          items: 5
        },
        desktop: {
          breakpoint: { max: 3000, min: 1024 },
          items: 3
        },
        tablet: {
          breakpoint: { max: 1024, min: 464 },
          items: 2
        },
        mobile: {
          breakpoint: { max: 464, min: 0 },
          items: 1
        }
      };
    


  return (
    <section className="skill" id="habilidades">
    <div className="container">
        <div className="row">
            <div className="col-12">
                <div className="skill-bx wow zoomIn">
                    <h2 className='text-danger'>Proveedores</h2>
                    <p>Conoce nuestros proveedores<br></br> .</p>
                    <Carousel responsive={responsive} infinite={true} className="owl-carousel owl-theme skill-slider">
                        {
                           categories?.map((category, index) =>(
                            <div className="item" key={index}>
                            <img src={`/api/v1/provider/provider-photo/${category._id}`} alt={category.name}   />
                            <h5>{category.nombre}</h5>
                        </div>
                           ) )
                        }
                        
                    </Carousel>
                </div>
            </div>
        </div>
    </div>
    
</section>
  )
}

export default Brands