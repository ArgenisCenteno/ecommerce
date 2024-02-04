import React, { useState, useEffect } from "react"; 
import Layout from "./../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import axios from "axios";
 
const Profile = () => {
  //CONTEXTO
  const [auth, setAuth] = useAuth();
  
  //ESTADOS
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [phone, setPhone] = useState(""); 
   
  //OBTENER USUARIO
  useEffect(() => {
    const { email, name, phone, _id  } = auth?.user;
    setName(name);
    setPhone(phone);
    setEmail(email); 
    setId(_id)
  }, [auth?.user]);

  // FUNCIÓN DE FORMULARIO 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (phone.length !== 11) {
      setPhoneError("El número de telefono debe tener 11 digitos");
      return;
    } else {
      setPhoneError("");
    }
     
    try {
      const { data } = await axios.put("/api/v1/auth/profile", {
        name,
        email, 
        phone,
        id 
      });
      if (data?.errro) {
        toast.error(data?.error);
      } else {
        setAuth({ ...auth, user: data?.updatedUser });
        let ls = localStorage.getItem("auth");
        ls = JSON.parse(ls);
        ls.user = data.updatedUser;
        localStorage.setItem("auth", JSON.stringify(ls));
        toast.success("Perfil actualizado correctamente");
      }
    } catch (error) {
      console.log(error);
      toast.error("Ha ocurrido un error");
    }
  };
  const isButtonDisabled = !name || !email || !phone || phone.length !== 11 || phoneError;

    
  return (
    <Layout title={"Configuracion"}>
      <div className="container-fluid-4 p-3 " style={{backgroundColor: "#eee"}} >
         
            <div className="form-container  " style={{ marginTop: "10px", backgroundColor: "#eee"  }}>
              <form onSubmit={handleSubmit}>
                <h4 className="title mt-4 mb-4">Configurar usuario</h4>
                <div className="mb-3">
                <span> <strong>Nombre</strong> </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-control"
                    id="exampleInputEmail16"
                    placeholder="Ingesa tu nombre"
                    autoFocus
                  />
                </div>
                <div className="mb-3">
                <span> <strong>Email</strong> </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                    id="exampleInputEmail12"
                    placeholder="Ingresa tu email"
                     
                  />
                </div>
               
                <div className="mb-3">
                <span> <strong>Telefono</strong> </span>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-control"
                    id="exampleInputEmail13"
                    placeholder="Ingresa tu telefono"
                    maxLength="11"
                  />
                   {phoneError && (
                    <small className="text-danger">
                      {phoneError}
                    </small>
                  )}
                  {phone.length !== 11 && (
                    <small className="text-danger">
                      El número de telefono debe tener 11 digitos
                    </small>
                  )}
                </div>
                

                <button type="submit" className="btn btn-primary  " disabled={isButtonDisabled} >
                  Guardar cambios
                </button>
              </form>
            
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
