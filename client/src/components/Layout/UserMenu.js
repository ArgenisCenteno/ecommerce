import React from "react";
import { NavLink } from "react-router-dom"; 
import {FaUserCog} from "react-icons/fa"
import {FiHome} from "react-icons/fi"
import {GrConfigure} from "react-icons/gr"
import {CiDeliveryTruck} from "react-icons/ci"
const UserMenu = () => {
  return (
    <div>
      <div className="text-left dashboard-menu" style={{border: "1px solid black", borderRadius: "12px", padding: "20px"}}>
        <div className="list-group">
          
          <NavLink
            to="/dashboard/user "
            className="list-group-item list-group-item-action "
          >
             <FiHome style={{fontSize: "30px", marginRight: "9px"}}/>
            Inicio
           
          </NavLink>
          <NavLink
            to="/dashboard/user/profile"
            className="list-group-item list-group-item-action"
          >
            <GrConfigure style={{fontSize: "30px", marginRight: "9px"}}/> 
            Configuración
           
         </NavLink>
          <NavLink
            to="/dashboard/user/orders"
            className="list-group-item list-group-item-action "
          >
          <CiDeliveryTruck style={{fontSize: "30px", marginRight: "9px"}}/>
            Mis pedidos
            
          </NavLink>
           
        </div>
      </div>
    </div>
  );
};

export default UserMenu;
