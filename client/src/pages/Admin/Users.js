import React, { useState, useEffect } from "react";
import { Table, Input, Button, Space, Select, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";

const { Option } = Select;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [roleOptions, setRoleOptions] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");

  const getUsers = async () => {
    try {
      const response = await axios.get("/api/v1/auth/all-users");
      setUsers(response.data.users);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  useEffect(() => {
   

    getUsers();
 
  }, []);

 

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.patch(`/api/v1/auth/user/${userId}/change-role`, {
        role: newRole,
      });
      // Actualizar la lista de usuarios después de cambiar el rol
      getUsers()
      
      message.success("Rol actualizado exitosamente");
    } catch (error) {
      console.log("Error updating user role", error);
      message.error("Error al actualizar el rol del usuario");
    }
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Buscar ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Buscar
          </Button>
          <Button
            onClick={() => handleReset(clearFilters, dataIndex)}
            size="small"
            style={{ width: 90 }}
          >
            Limpiar
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters, dataIndex) => {
    clearFilters();
    setSearchText("");
  };

  const columns = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Correo electrónico",
      dataIndex: "email",
      key: "email",
      ...getColumnSearchProps("email"),
    },
    {
      title: "Telefono",
      dataIndex: "phone",
      key: "phone",
      ...getColumnSearchProps("phone"),
    },
    {
      title: "Rol",
      dataIndex: "role",
      key: "role",
      render: (role, record) => (
        <Select
          style={{ width: 120 }}
          value={role}
          onChange={(value) => handleRoleChange(record._id, value)}
        >
           
            <Option   value={0} >
              Cliente
            </Option>
            <Option   value={1}>
              Admin 
            </Option>
            <Option   value={2}>
              Vendedor 
            </Option>
         
        </Select>
      ),
    },
  ];

  return (
    <Layout title={"Usuarios"}>
      <div className="container-fluid p-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1 className="mt-4 mb-4">Usuarios</h1>
            <Table columns={columns} dataSource={users} loading={loading} rowKey="_id" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Users;
