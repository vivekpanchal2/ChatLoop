import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import AvatarCard from "../../components/shared/AvatarCard";
import { useDispatch, useSelector } from "react-redux";
import { getAllChats } from "../../services/operations/admin";
import { transformImage } from "../../lib/features";
import Table from "../../components/shared/Table"; 

const columns = [
  {
    field: "id",
    headerName: "ID",
    width: 200,
  },
  {
    field: "avatar",
    headerName: "Avatar",
    width: 150,
    renderCell: (params) => <AvatarCard avatar={params.row.avatar} />,
  },
  {
    field: "name",
    headerName: "Name",
    width: 300,
  },
  {
    field: "groupChat",
    headerName: "Group",
    width: 100,
  },
  {
    field: "totalMembers",
    headerName: "Total Members",
    width: 120,
  },
  {
    field: "members",
    headerName: "Members",
    width: 400,
    renderCell: (params) => <AvatarCard avatar={params.row.avatar} />,
  },
  {
    field: "totalMessages",
    headerName: "Total Messages",
    width: 120,
  },
  {
    field: "creator",
    headerName: "Created By",
    width: 250,
    renderCell: (params) => (
      <div className="flex items-center space-x-4">
        {/* Render the creator's avatar and name */}
        <img
          alt={params.row.creator.name}
          src={params.row.creator.avatar}
          className="w-10 h-10 rounded-full flex justify-center items-center"
        />
        <span>{params.row.creator.name}</span>
      </div>
    ),
  },
];

const ChatManagement = () => {
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.chats);

  async function fetchChats() {
    const resData = await dispatch(getAllChats());
    setData(resData);
  }

  useEffect(() => {
    fetchChats();
  }, []);

  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (data && data.chats) {
      setRows(
        data.chats.map((i) => ({
          ...i,
          id: i._id,
          avatar: i.avatar.map((a) => transformImage(a, 50)),
          members: i.members.map((m) => transformImage(m.avatar, 50)),
          creator: {
            name: i.creator.name,
            avatar: transformImage(i.creator.avatar, 50),
          },
        }))
      );
    }
  }, [data]);

  console.log(rows);

  return (
    <AdminLayout>
      {loading ? (
        <div className="h-screen bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 animate-pulse flex items-center justify-center">
          <div className="text-3xl font-bold text-gray-600">Loading...</div>
        </div>
      ) : (
        <div className="p-6">
          <h1 className="text-4xl font-semibold mb-8">All Chats</h1>
          {/* Use the Table component */}
          <Table
            rows={rows}
            columns={columns}
            heading="All Chats"
            rowHeight={60}
          />
        </div>
      )}
    </AdminLayout>
  );
};

export default ChatManagement;
