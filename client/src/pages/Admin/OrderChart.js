import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
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

const OrderChart = () => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/api/v1/auth/all-orders");
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const processOrdersForChart = () => {
    const ordersByMonth = {};

    orders.forEach((order) => {
      const timestamp = new Date(order.createdAt);
      const month = `${timestamp.getMonth() + 1}-${timestamp.getFullYear()}`;

      if (!ordersByMonth[month]) {
        ordersByMonth[month] = 0;
      }

      ordersByMonth[month] += order.total;
    });

    // Ordenar los meses de manera ascendente
    const sortedMonths = Object.keys(ordersByMonth).sort();

    const labels = sortedMonths.map((month) => {
      // Obtener el nombre del mes en español
      const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
      ];
      const [monthNumber, year] = month.split("-");
      return `${monthNames[parseInt(monthNumber, 10) - 1]} ${year}`;
    });

    const data = sortedMonths.map((month) => ordersByMonth[month]);

    return { labels, data };
  };

  const chartData = {
    labels: processOrdersForChart().labels,
    datasets: [
      {
        label: "Ordenes Mensuales", 
        fill: true,
        lineTension: 0.4,
        backgroundColor: "rgba(75,192,192,0.2)", // Color de relleno más claro
        borderColor: "rgba(75,192,192,1)",
        data: processOrdersForChart().data, 
        spanGaps: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Gráfica de Órdenes Mensuales',
      },
    },
   
  };

  return (
    <div>
       <Line    data={chartData} options={chartOptions} />
    </div>
  );
};

export default OrderChart;
