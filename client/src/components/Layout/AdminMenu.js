import React from "react";
import { NavLink } from "react-router-dom";
const AdminMenu = () => {
  return (
    <>
      <div className="text-left  ">
     
        <div className=" dashboard-menu">
         <h5>Panel de Administración</h5>
          <NavLink
            to="/dashboard/admin"
            className="list-group-item list-group-item-action "
          >
            Inicio
          </NavLink>
         
          <NavLink
            to="/dashboard/admin/products"
            className="list-group-item list-group-item-action"
          >
            Productos
          </NavLink>
          <NavLink
            to="/dashboard/admin/sales-report"
            className="list-group-item list-group-item-action"
          >
            Ordenes
          </NavLink>
          <NavLink
            to="/dashboard/admin/create-category"
            className="list-group-item list-group-item-action"
          >
            Categoría
          </NavLink> 
          <NavLink
            to="/dashboard/admin/providers"
            className="list-group-item list-group-item-action"
          >
            Proveedores
          </NavLink> 
        <NavLink
            to="/dashboard/admin/users"
            className="list-group-item list-group-item-action"
          >
            Usuarios
          </NavLink> 
          <NavLink
            to="/dashboard/admin/config"
            className="list-group-item list-group-item-action"
          >
            Configuracion
          </NavLink> 
           
        </div>
      </div>
    </>
  );
};

export default AdminMenu;
