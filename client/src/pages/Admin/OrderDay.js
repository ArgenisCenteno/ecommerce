import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

const ProductSalesChart = () => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  const [productSalesData, setProductSalesData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/v1/product/product-sales');
        setProductSalesData(response.data); 
      } catch (error) {
        console.error('Error fetching product sales data:', error);
      }
    };

    fetchData();
  }, []);

  const calculateProfit = (product) => {
    const { precioVenta, precioCompra, venta } = product;
    return (precioVenta - precioCompra) * venta;
  };
  

  const getProductLabels = () => {
    return productSalesData ? productSalesData.map((product) => product.nombre) : [];
  };
  
  const getProfitData = () => {
    return productSalesData ? productSalesData.map((product) => calculateProfit(product)) : [];
  };
  

  const chartData = {
    labels: getProductLabels(),
    datasets: [
      {
        label: 'Ganancias por Producto',
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(75,192,192,0.4)',
        hoverBorderColor: 'rgba(75,192,192,1)',
        data: getProfitData(),
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: { title: { display: true, text: 'Productos' } },
      y: { title: { display: true, text: 'Ganancias' }, beginAtZero: true },
    },
  };

  return (
    <div>
      <h2>Ganancias por Producto</h2>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default ProductSalesChart;
