import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaUser, FaUsers, FaComments } from "react-icons/fa";
import moment from "moment";
import AdminLayout from "../../components/layout/AdminLayout";
import { DoughnutChart, LineChart } from "../../components/specific/Chart";
import { getDashboardStats } from "../../services/operations/admin";

const Dashboard = () => {
  const dispatch = useDispatch();
  const [stats, setStats] = useState();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  async function fetchDashboardStats() {
    const res = await dispatch(getDashboardStats());
    setStats(res.stats);
  }

  const { loading } = useSelector((state) => state.chat);

  return (
    <AdminLayout>
      {loading ? (
        <div className="h-screen flex items-center justify-center bg-gray-200 animate-pulse">
          <p className="text-gray-600">Loading...</p>
        </div>
      ) : (
        <main className="container mx-auto p-6">
          <div className="bg-white p-6 mb-6 rounded-lg shadow-md flex items-center justify-between">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="flex items-center gap-4">
              <p className="text-gray-700">
                {moment().format("dddd, D MMMM YYYY")}
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md w-full lg:w-2/3">
              <h2 className="text-xl font-semibold mb-4">Last Messages</h2>
              <LineChart value={stats?.messagesChart || []} />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md w-full lg:w-1/3 relative flex items-center justify-center">
              <DoughnutChart
                labels={["Single Chats", "Group Chats"]}
                value={[
                  stats?.totalChatsCount - stats?.groupsCount || 0,
                  stats?.groupsCount || 0,
                ]}
              />
              <div className="absolute flex flex-col items-center justify-center w-full h-full">
                <div className="flex items-center gap-2 text-gray-700">
                  <FaUsers /> <p>Vs</p> <FaUser />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 mt-8">
            <Widget title="Users" value={stats?.usersCount} Icon={<FaUser />} />
            <Widget
              title="Chats"
              value={stats?.totalChatsCount}
              Icon={<FaUsers />}
            />
            <Widget
              title="Messages"
              value={stats?.messagesCount}
              Icon={<FaComments />}
            />
          </div>
        </main>
      )}
    </AdminLayout>
  );
};

const Widget = ({ title, value, Icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-md w-full sm:w-1/3 flex flex-col items-center border border-gray-200">
    <div className="flex items-center justify-center w-16 h-16 mb-4 bg-blue-100 rounded-full">
      <div className="text-3xl text-blue-500">{Icon}</div>
    </div>
    <div className="text-2xl font-semibold text-gray-800 mb-2">{value}</div>
    <p className="text-lg font-medium text-gray-600">{title}</p>
  </div>
);

export default Dashboard;
