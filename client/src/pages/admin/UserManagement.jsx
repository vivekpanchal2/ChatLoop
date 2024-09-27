import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import Table from "../../components/shared/Table";
import { transformImage } from "../../lib/features";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../services/operations/admin";

const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "avatar",
    headerName: "Avatar",
    headerClassName: "table-header",
    width: 150,
    renderCell: (params) => (
      <img
        alt={params.row.name}
        src={params.row.avatar}
        className="rounded-full w-12 h-12"
      />
    ),
  },
  {
    field: "name",
    headerName: "Name",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "username",
    headerName: "Username",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "friends",
    headerName: "Friends",
    headerClassName: "table-header",
    width: 150,
  },
  {
    field: "groups",
    headerName: "Groups",
    headerClassName: "table-header",
    width: 200,
  },
];

const UserManagement = () => {
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.chats);

  async function fetchChats() {
    const resData = await dispatch(getAllUsers());
    setData(resData);
  }

  useEffect(() => {
    fetchChats();
  }, []);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (data && data.users) {
      setRows(
        data?.users?.map((i) => ({
          ...i,
          id: i._id,
          avatar: transformImage(i.avatar, 50),
        }))
      );
    }
  }, [data]);

  console.log({ data, rows });

  return (
    <AdminLayout>
      {loading ? (
        <div className="h-screen flex justify-center items-center">
          <div className="animate-pulse">
            <div className="h-64 w-full bg-gray-200 rounded-md"></div>
          </div>
        </div>
      ) : (
        <Table heading={"All Users"} columns={columns} rows={rows} />
      )}
    </AdminLayout>
  );
};

export default UserManagement;
