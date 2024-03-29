import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Pagenotfound from "./pages/Pagenotfound";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/user/Dashboard";
import PrivateRoute from "./components/Routes/Private";
import ForgotPasssword from "./pages/Auth/ForgotPasssword";
import AdminRoute from "./components/Routes/AdminRoute";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import CreateCategory from "./pages/Admin/CreateCategory";
import CreateProduct from "./pages/Admin/CreateProduct";
import Users from "./pages/Admin/Users";
import Orders from "./pages/user/Orders";
import Profile from "./pages/user/Profile";
import Products from "./pages/Admin/Products";
import UpdateProduct from "./pages/Admin/UpdateProduct";
import Search from "./pages/Search";
import ProductDetails from "./pages/ProductDetails";
import Categories from "./pages/Categories";
import CategoryProduct from "./pages/CategoryProduct";
import CartPage from "./pages/CartPage";
import AdminOrders from "./pages/Admin/AdminOrders";
import Checkout from "./pages/user/Checkout"; 
import Order from "./pages/user/Order";
import AdminOrder from "./pages/Admin/AdminOrder";
import ForgotPassword from "./pages/Auth/ForgotPasssword";
import NewPassword from "./pages/Auth/NewPassword";
import PasswordUpdate from "./pages/user/PasswordUpdate";
import Gender from "./pages/Gender";
import SalesReport from "./pages/SalesReport";
import CategoryCreate from "./pages/Admin/CategoryCreate";
import CategoryUpdate from "./pages/Admin/CategoryUpdate";
import Providers from "./pages/Admin/Providers";
import CreateProvider from "./pages/Admin/CreateProvider";
import ProviderUpdate from "./pages/Admin/ProviderUpdate";
import ConfigAdmin from "./pages/Admin/ConfigAdmin";

function App() {
  return (
    <>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:slug" element={<ProductDetails />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/category/:slug" element={<CategoryProduct />} />
        <Route path="/search" element={<Search />} /> 
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/new-password/:token" element={<NewPassword/>} />
        <Route path="/reset-password" element={<ForgotPassword/>} />
        <Route path="/gender/:name" element={<Gender/>} />

        {/* Rutas privadas de usuario */}
        <Route path="/dashboard" element={<PrivateRoute />}>
          <Route path="user" element={<Dashboard />} />
          <Route path="user/orders" element={<Orders />} />
          <Route path="user/profile" element={<Profile />} />
          <Route path="user/order/:_id" element={<Order />} />
          <Route path="user/password" element={<PasswordUpdate />} />
          
        </Route>

        {/* Rutas privadas de administrador */}
        <Route path="/dashboard" element={<AdminRoute />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/create-category" element={<CreateCategory />} />
          <Route path="admin/create-product" element={<CreateProduct />} />
          <Route path="admin/product/:slug" element={<UpdateProduct />} />
          <Route path="admin/products" element={<Products />} />
          <Route path="admin/users" element={<Users />} />
          <Route path="admin/config" element={<ConfigAdmin />} />
          <Route path="admin/orders" element={<AdminOrders />} />
          <Route path="admin/sales-report" element={<SalesReport />} />
          <Route path="admin/order/:_id" element={<AdminOrder />} />
          <Route path="admin/createCategory" element={<CategoryCreate />} />
          <Route path="admin/updateCategory/:id" element={<CategoryUpdate />} />
          <Route path="admin/providers" element={<Providers />} />
          <Route path="admin/create-provider" element={<CreateProvider/>} />
          <Route path="admin/update-provider/:id" element={<ProviderUpdate />} />
        </Route>

        {/* Rutas de autenticación */}
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPasssword />} />
        <Route path="/login" element={<Login />} />

        {/* Ruta no encontrada */}
        <Route path="*" element={<Pagenotfound />} />
      </Routes>
    </>
  );
}

export default App;
