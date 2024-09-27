import React, { useEffect, useState } from "react";
import moment from "moment";
import AdminLayout from "../../components/layout/AdminLayout";
import RenderAttachment from "../../components/shared/RenderAttachment";
import Table from "../../components/shared/Table";

import { fileFormat, transformImage } from "../../lib/features";
import { getAllMessages } from "../../services/operations/admin";
import { useDispatch, useSelector } from "react-redux";

const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "attachments",
    headerName: "Attachments",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => {
      const { attachments } = params.row;
      return attachments?.length > 0
        ? attachments.map((i, index) => {
            const url = i.url;
            const file = fileFormat(url);
            return (
              <div key={index} className="text-black">
                <a
                  href={url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {RenderAttachment(file, url)}
                </a>
              </div>
            );
          })
        : "No Attachments";
    },
  },
  {
    field: "content",
    headerName: "Content",
    headerClassName: "table-header",
    width: 400,
  },
  {
    field: "sender",
    headerName: "Sent By",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => (
      <div className="flex items-center space-x-4">
        <img
          src={params.row.sender.avatar}
          alt={params.row.sender.name}
          className="w-12 h-12 rounded-full"
        />
        <span>{params.row.sender.name}</span>
      </div>
    ),
  },
  {
    field: "chat",
    headerName: "Chat",
    headerClassName: "table-header",
    width: 220,
  },
  {
    field: "groupChat",
    headerName: "Group Chat",
    headerClassName: "table-header",
    width: 100,
    renderCell: (params) => (params.row.groupChat ? "Yes" : "No"),
  },
  {
    field: "createdAt",
    headerName: "Time",
    headerClassName: "table-header",
    width: 250,
  },
];

const MessageManagement = () => {
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.chats);

  async function fetchChats() {
    const resData = await dispatch(getAllMessages());
    setData(resData);
  }

  useEffect(() => {
    fetchChats();
  }, []);

  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (data && data.messages) {
      setRows(
        data?.messages?.map((i) => ({
          ...i,
          id: i._id,
          sender: {
            name: i.sender.name,
            avatar: transformImage(i.sender.avatar, 50),
          },
          createdAt: moment(i.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
        }))
      );
    }
  }, [data]);

  return (
    <AdminLayout>
      {loading ? (
        <div className="h-screen flex items-center justify-center">
          <div className="w-full max-w-md p-6 mx-auto bg-white shadow-md rounded-lg">
            <div className="animate-pulse space-y-4">
              <div className="h-12 bg-gray-300 rounded"></div>
              <div className="h-12 bg-gray-300 rounded"></div>
              <div className="h-12 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      ) : (
        <Table
          heading={"All Messages"}
          columns={columns}
          rows={rows}
          rowHeight={200}
        />
      )}
    </AdminLayout>
  );
};

export default MessageManagement;
