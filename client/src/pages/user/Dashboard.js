import React from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";
import WavingHandIcon from '@mui/icons-material/WavingHand';
const Dashboard = () => {
  const [auth] = useAuth();
  return (
    <Layout title={"Dashboard - Cliente"}>
      <div className="container-flui p-3 dashboard " style={{marginBottom: "18rem"}}>
        <div className="row">
        <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <div className="card w-100 p-3">
            <h1>Bienvenido, {auth?.user?.name} <WavingHandIcon style={{fontSize: "40px", color: "#198754"}}/> </h1> 
          </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
