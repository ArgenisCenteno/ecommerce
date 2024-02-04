import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import AdminMenu from '../../components/Layout/AdminMenu';
import Layout from './../../components/Layout/Layout';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 4,
  });
 
  // Obtener todos los productos
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/v1/product/get-product', {
        params: {
          page: pagination.current,
          limit: pagination.pageSize,
        },
      });
      setProducts(data.products);
      setPagination(prevPagination => ({
        ...prevPagination,
        total: data.counTotal,
      }));
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error('Ocurrió un error al traer los productos');
      setLoading(false);
    }
  };
  const generateProductSalesPDF = async () => {
    try {
      // Obtén los productos y las estadísticas de ventas desde tu API
      const response = await axios.get('/api/v1/product/product-sales');
      const productSalesData = response.data;
  
      const doc = new jsPDF();
      doc.text('Informe de Productos Más Vendidos', 10, 10);
  
      const tableData = [];  
      let totalProfit = 0;
  
      // Itera a través de los datos de productos más vendidos
      productSalesData.forEach(product => {

        let ganancia; 
        const rowData = [
          product.nombre,
          product.venta,
          ganancia =  product.venta === 0 ? 0 : (product.precio - product.precioCompra) * product.venta 
        ];
        
        tableData.push(rowData);
        totalProfit += ganancia;
      });
  
      // Agregar encabezados de columnas
      const headers = [['Producto', 'Ventas', 'Ganancia']];
      doc.autoTable({
        startY: 20,
        head: headers,
        body: tableData,
        theme: 'grid'
      });
  
      // Agregar fila con el total de ganancias
      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 10,
        body: [['Total de Ganancias', '', ` ${totalProfit.toFixed(2)}Bs`]],
        theme: 'grid',
        tableWidth: 'auto'
      });
  
      // Guardar el PDF y descargar
      const pdfFileName = 'informe_productos_mas_vendidos.pdf';
      doc.save(pdfFileName);
    } catch (error) {
      console.error('Error generating product sales report:', error);
    }
  };
  
  // Ciclo de vida
  useEffect(() => {
    getAllProducts();
  }, [pagination.current, pagination.pageSize]);

  // Manejar cambios en la tabla de paginación y orden
  const handleTableChange = (pagination, filters, sorter) => {
    setPagination(pagination);
  };

  

  // Definir las columnas de la tabla
  const columns = [
    {
      title: 'Imagen',
      dataIndex: 'image',
      render: (image, record) => (
        <img src={`/api/v1/product/product-photo/${record._id}`} height="100px" className="card-img-top-dashboard" alt={record.name} />
      ),
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre',
    },
    {
      title: 'Precio de venta',
      dataIndex: 'precio',
    },
    {
      title: 'Precio de compra',
      dataIndex: 'precioCompra',
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
    },
    {
      title: 'Ventas',
      dataIndex: 'venta',
    },
    {
      title: 'Ganancia',
      dataIndex: 'ganancia',
      render: (_id, record) => (
        <>
        <p  >
        {(record.precio - record.precioCompra).toFixed(2)}

        </p>
        
        </>
      ),
    },
    {
      title: 'Detalles',
      dataIndex: '_id',
      render: (_id, record) => (
        <>
        <Link to={`/dashboard/admin/product/${record.codigo}`} className="product-link">
          <button className="btn btn-success">Detalles</button>
        </Link>
        
        </>
      ),
    },
  ];

  return (
    <Layout>
      <div className="row container-fluid dashboard">
        <div className="col-md-3">
          <AdminMenu />
        </div>

        <div className="col-md-8">
          <h1 className='mt-4 mb-4'>Productos</h1>
          <button className='btn btn-success mb-4' onClick={generateProductSalesPDF}>
            Generar reporte
          </button>
         <Link to={"/dashboard/admin/create-product"}> <button className='btn btn-primary mb-4' >Registrar producto</button></Link>
          <Table
            columns={columns}
            rowKey={(record) => record._id}
            dataSource={products}
            pagination={pagination}
            loading={loading}
            onChange={handleTableChange}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Products;
