import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Layout from '../components/Layout/Layout';
import AdminMenu from '../components/Layout/AdminMenu';
import axios from 'axios';
import 'jspdf-autotable'; 
import { Input} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Table, Select, Button  } from 'antd';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import OrderChart from './Admin/OrderChart';
const { Option } = Select;

const SalesReport = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [dateRange, setDateRange] = useState('today');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [monthlyOrderCounts, setMonthlyOrderCounts] = useState([]);
  const [monthlyTotalSales, setMonthlyTotalSales] = useState([]);
  const [labels, setLabels] = useState([]);
  const [dailyOrderCounts, setDailyOrderCounts] = useState([]);
  const [dailyTotalSales, setDailyTotalSales] = useState([]);
  
  const [searchText, setSearchText] = useState({
    client: '',
    orderId: '',
    email: '',
  })
  useEffect(() => {
    fetchOrders(dateRange);
  }, []);

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };
  
  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const getOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/v1/auth/all-orders'); // Realizar una solicitud GET para obtener las órdenes desde la ruta "/api/v1/auth/all-orders"
      setOrders(data); // Establecer las órdenes obtenidas en el estado "orders"
      setLoading(false);
      console.log(data)
    } catch (error) {
      console.log(error);
      
      setLoading(false);
    }
  };

  const fetchOrders = async (dateRange) => {
    try {
      const response = await axios.get(`/api/v1/product/getFilterOrders/${dateRange}`);
       
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } 
  };

  const fetchWeeklyOrders = async () => {
    try {
      const response = await axios.get('/api/v1/auth/order-daily');
      const orders = response.data;
      setOrders(response.data);
      // Restablecer los datos diarios
      const dailyOrderCounts = new Array(7).fill(0);
      const dailyTotalSales = new Array(7).fill(0);
  
      orders.forEach(order => {
        const dayIndex = new Date(order.createdAt).getDay();
        dailyOrderCounts[dayIndex]++;
        dailyTotalSales[dayIndex] += order.total;
      });
  
      setDailyOrderCounts(dailyOrderCounts); // Make sure to create a new array to trigger re-render
    setDailyTotalSales(dailyTotalSales); // Make sure to create a new array to trigger re-render
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Importar y usar la función getFilteredOrders
  const getFilteredOrders = async (range) => {
    try {
      console.log(range)
      const response = await axios.get('/api/v1/auth/order-daily');
       
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching filtered orders:', error);
      throw error;
    }
  };
   
  const fetchMonthlyOrders = async () => {
    try {
      const response = await axios.get('/api/v1/product/getFilterOrders/thisYear');
      const orders = response.data;
  
      // Procesar los datos para obtener ventas mensuales
      const monthlySalesData = new Array(12).fill(0);
      const monthlyOrderCounts = new Array(12).fill(0);
      const monthlyTotalSales = new Array(12).fill(0);
  
      orders.forEach(order => {
        const monthIndex = new Date(order.createdAt).getMonth();
        monthlySalesData[monthIndex] += order.total;
        monthlyOrderCounts[monthIndex]++;
        monthlyTotalSales[monthIndex] += order.total;
      });
  
      const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ];
 
      setOrders(orders)
      setLabels(monthNames);
      setMonthlyOrderCounts(monthlyOrderCounts);
      setMonthlyTotalSales(monthlyTotalSales);
      
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const generateSalesReport = async () => {
    try {
      let filteredOrders = [];
  
      if (dateRange === 'custom') {
        console.log("custom");
        //const {data} = await getFilteredOrders(dateRange, startDate, endDate);
      } else {
        const response = await axios.get(`/api/v1/product/getFilterOrders/${dateRange}`);
        filteredOrders = response.data;
      }  
  
      const doc = new jsPDF();
      doc.text('Reporte de Ventas', 10, 10);
  
      const tableData = [];
      let totalSales = 0;
      let totalOrders = 0;
  
      filteredOrders.forEach(order => {
        const rowData = [
          order._id,
          new Date(order.createdAt).toLocaleDateString(),
          `$${order.total.toFixed(2)}`, // Formatear el total como moneda
          order.cliente.name
        ];
        tableData.push(rowData);
        totalSales += order.total;
        totalOrders += 1;
      });
  
      // Agregar encabezados de columnas
      const headers = [['ID Orden', 'Fecha', 'Total', 'Cliente']];
      doc.autoTable({
        startY: 20,
        head: headers,
        body: tableData,
        theme: 'grid'
      });
  
      // Agregar fila con el total de ventas
      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 10,
        body: [['Total de Ventas', '', `$${totalSales.toFixed(2)}`]],
        theme: 'grid',
        tableWidth: 'auto'
      });

       // Generar la tabla de órdenes por mes
    if (dateRange === "thisYear") {
      doc.addPage();
      doc.text('Órdenes por Mes', 10, 10);

      const monthlyTableData = [];
      labels.forEach((month, index) => {
        const rowData = [
          month,
          monthlyOrderCounts[index],
          `$${monthlyTotalSales[index].toFixed(2)}`
        ];
        monthlyTableData.push(rowData);
      });

      const monthlyTableHeaders = [['Mes', 'Cantidad de Órdenes', 'Total de Ordenes']];
      doc.autoTable({
        startY: 20,
        head: monthlyTableHeaders,
        body: monthlyTableData,
        theme: 'grid'
      });
    }

    if (dateRange === "thisWeek") {
      // Agregar una tabla de órdenes por día de la semana
      doc.addPage();
      doc.text('Órdenes por Día de la Semana', 10, 10);
    
      const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    
      const weeklyTableData = daysOfWeek.map((day, index) => ([
        day,
        dailyOrderCounts[index], dailyTotalSales[index] !== undefined ? `$${dailyTotalSales[index].toFixed(2)}` : '$0.00'
      ]));
    
      const weeklyTableHeaders = [['Día', 'Cantidad de Órdenes', 'Total de Ordenes']];
    
      doc.autoTable({
        startY: 20,
        head: weeklyTableHeaders,
        body: weeklyTableData,
        theme: 'grid'
      });

      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 10,
        body: [
          ['Total de Ordenes', `$${totalOrders.toString()}`],
          ['Monto de Órdenes', totalSales.toFixed(2)],  // Agregar esta línea para mostrar el total de órdenes
       
        ],
        theme: 'grid',
        tableWidth: 'auto'
      });
    }


  
      // Guardar el PDF y descargar
      const pdfFileName = 'reporte_ordenes.pdf';
      doc.save(pdfFileName);
  
    } catch (error) {
      console.error('Error generating sales report:', error);
    }
  };
  
  const handleDateRangeChange = (e) => {
    const selectedDateRange = e.target.value;
    setDateRange(selectedDateRange);
    if (selectedDateRange === 'thisYear') {
      // Llamar a la función para obtener órdenes por mes
      fetchMonthlyOrders();
    } else if (selectedDateRange === 'thisWeek') {
      // Llamar a la función para obtener órdenes por día
      fetchWeeklyOrders();
    }else if(selectedDateRange === 'todas'){
      getOrders();
    } else {
      fetchOrders(selectedDateRange);
    }
  };

  const handleGenerateReport = async () => {
    if (dateRange === 'custom') {
      if (!startDate || !endDate) {
        console.error('Debe seleccionar ambas fechas');
        return;
      }
    }
  
    // Llamar a la función para generar el reporte
    generateSalesReport();
  }

  const handleSearch = (selectedKeys, dataIndex, confirm) => {
    confirm();
    setSearchText((prevSearchText) => ({
      ...prevSearchText,
      [dataIndex]: selectedKeys[0],
    }));
  };
  
  const handleReset = (clearFilters, dataIndex) => {
    clearFilters();
   navigate("/dashboard/admin/orders")
  };
  const columns = [
    {
      title: 'ID de Orden',
      dataIndex: '_id',
      key: 'orderId',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Buscar ID de Orden"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() =>
              handleSearch(selectedKeys, 'orderId', confirm)
            }
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, 'orderId', confirm)}
            icon={<SearchOutlined />}
            size="small"
            style={{ marginRight: 8 }}
          >
            Buscar
          </Button>
          <Button onClick={() => handleReset(clearFilters, 'orderId')} size="small">
            Limpiar
          </Button>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value, record) =>
        record._id.toLowerCase().includes(value.toLowerCase()), // Filtrar por el ID de Orden
    },
    {
      title: 'Cliente',
      dataIndex: 'cliente',
      key: 'cliente',
      render: (buyer) => <span>{buyer?.name}</span>,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Buscar cliente"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() =>
              handleSearch(selectedKeys, 'client', confirm)
            }
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, 'client', confirm)}
            icon={<SearchOutlined />}
            size="small"
            style={{ marginRight: 8 }}
          >
            Buscar
          </Button>
          <Button onClick={() => handleReset(clearFilters, 'client')} size="small">
            Limpiar
          </Button>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value, record) =>
        record.cliente?.name.toLowerCase().includes(value.toLowerCase()), // Filtrar por el nombre del cliente
    },
    
    {
      title: 'Fecha',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt) => (
        <span>{moment(createdAt).format('YYYY-MM-DD HH:mm:ss')}</span> // Formatear y renderizar la fecha de creación de la orden
      ),
    },
    {
      title: 'Estado de pago',
      dataIndex: 'estadoPago',
      key: 'estadoPago',
      render: (estadoPago) => <button className={`btn ${estadoPago ? 'btn-success' : 'btn-danger'}`}>
      {estadoPago ? "Pagada" : "Sin pagar"}
    </button>,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Select
            style={{ width: 80 }}
            value={selectedKeys[0]}
            onChange={(value) => setSelectedKeys([value])}
          >
            <Option value="">Todos</Option>
            <Option value="true">Pagada</Option>
            <Option value="false">Sin pagar</Option>
          </Select>
          <Button
            type="primary"
            onClick={() => {
              confirm();
            }}
            size="small"
            style={{ marginRight: 8 }}
          >
            Filtrar
          </Button>
          <Button onClick={clearFilters} size="small">
            Limpiar
          </Button>
        </div>
      ),
      onFilter: (value, record) => {
        if (value === 'true') {
          return record.estadoPago;
        } else if (value === 'false') {
          return !record.estadoPago;
        }
        return true;
      },
      // ...otras propiedades...
    },
    
    {
      title: 'Estado de entrega',
      key: 'changeStatus',
      render: (text, record) => (
       <span>{record.estadoEntrega}</span>
      ), // Renderizar un select para cambiar el estado de la orden
    },
    {
      title: 'Detalles',
      key: 'orderDetails',
      render: (text, record) => (
        <a className="btn btn-primary" href={ `/dashboard/admin/order/${record?._id} `} target="_blank">Aqui</a>
      ),  
    },
  ];
 

    return (
      <Layout title="Ordenes">
      <div className='container-fluid p-3 dashboard '>
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
         
         
          <div className="col-md-9 ">
          <h1 className='mt-4 mb-4'>Reporte de órdenes</h1>
            <div>
            <div style={{display: "flex", justifyContent: "center"}}>
            <select
                value={dateRange}
                onChange={handleDateRangeChange}
                className="form-select m-1"
              >
               <option value="todas">Todas</option>
                <option value="today">Hoy</option>
                <option value="yesterday">Ayer</option>
                <option value="thisWeek">Esta semana</option> 
                <option value="thisMonth">Este mes</option>
                <option value="thisYear">Este año</option>
                {/* ... otras opciones ... */}
              </select>
              
              <button className='btn btn-success btn-sm' onClick={handleGenerateReport}>Generar Reporte</button>
            </div>
             
              <div>
             
          <Table
            columns={columns}
            rowKey={(record) => record._id}
            dataSource={orders} 
            pagination={{
              
              pageSize: 10, // Cantidad de filas por página
              showSizeChanger: true, // Opción para cambiar la cantidad de filas por página
              pageSizeOptions: ['10', '20', '50'], // Opciones para seleccionar la cantidad de filas por página
            }}
            loading={loading}
          />
        </div>
        </div>
        {dateRange === 'thisYear' && (
  <div>
  
  </div>
)}
 
        </div>
        </div>
      </div>
    </Layout>
    );
}

export default SalesReport;