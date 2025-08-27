import React, { useEffect, useState } from "react";
import {
  BookOpen,
  Users,
  CheckCircle,
  Clock,
  TrendingUp,
  Calendar,
  BarChart3,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { getMonthlyBorrowStats } from "./adminApi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DashboardHome = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchStats = async () => {
  //     try {
  //       const result = await getMonthlyBorrowStats();
  //       setMonthlyData(result.data || []);
  //     } catch (err) {
  //       setMonthlyData([]);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchStats();
  // }, []);
useEffect(() => {
  const fetchStats = async () => {
    try {
      // Mocked data (seed values)
      const mockData = [
        { month: "Jan", borrowed: 120, returned: 100 },
        { month: "Feb", borrowed: 140, returned: 130 },
        { month: "Mar", borrowed: 180, returned: 150 },
        { month: "Apr", borrowed: 200, returned: 190 },
        { month: "May", borrowed: 170, returned: 160 },
        { month: "Jun", borrowed: 210, returned: 200 },
      ];
      setMonthlyData(mockData);

      // Uncomment below once API is ready
      // const result = await getMonthlyBorrowStats();
      // setMonthlyData(result.data || []);
    } catch (err) {
      setMonthlyData([]);
    } finally {
      setLoading(false);
    }
  };
  fetchStats();
}, []);

  const chartData = {
    labels: monthlyData.map((d) => d.month),
    datasets: [
      {
        label: "Books Borrowed",
        data: monthlyData.map((d) => d.borrowed),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "rgb(59, 130, 246)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: "Books Returned",
        data: monthlyData.map((d) => d.returned),
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "rgb(34, 197, 94)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: "600",
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        padding: 12,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
            weight: "500",
          },
          color: "#6b7280",
        },
      },
      y: {
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 12,
            weight: "500",
          },
          color: "#6b7280",
          padding: 8,
        },
        border: {
          display: false,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
  };

  const statsData = [
    { title: "Total Books", value: "2,847", icon: BookOpen, color: "blue" },
    {
      title: "Available Books",
      value: "2,156",
      icon: CheckCircle,
      color: "green",
    },
    { title: "Borrowed Books", value: "691", icon: Clock, color: "orange" },
    { title: "Total Users", value: "1,234", icon: Users, color: "purple" },
  ];

  return (
    <div className="space-y-8 max-w-[1800px] mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Dashboard Overview</h1>
            <p className="text-blue-100 text-lg">
              Welcome back! Here's what's happening today.
            </p>
          </div>
          <div className="text-right">
            <div className="text-blue-100 text-sm mb-1">Last updated</div>
            <div className="text-white font-medium">
              {new Date().toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div
                className={`p-4 rounded-2xl bg-gradient-to-br from-${stat.color}-100 to-${stat.color}-200`}
              >
                <stat.icon className={`h-8 w-8 text-${stat.color}-600`} />
              </div>
            </div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>+12% from last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Monthly Activity
            </h2>
            <p className="text-gray-600">Borrowing and return trends</p>
          </div>
        </div>
        <div className="h-80 flex items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center justify-center w-full h-full">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
              <span className="text-gray-500">Loading chart...</span>
            </div>
          ) : (
            <Line data={chartData} options={chartOptions} />
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button className="flex items-center justify-center space-x-3 p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105">
            <BookOpen className="h-6 w-6" />
            <span className="font-semibold">Add New Book</span>
          </button>
          <button className="flex items-center justify-center space-x-3 p-6 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105">
            <Users className="h-6 w-6" />
            <span className="font-semibold">Manage Users</span>
          </button>
          <button className="flex items-center justify-center space-x-3 p-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
            <BarChart3 className="h-6 w-6" />
            <span className="font-semibold">View Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
