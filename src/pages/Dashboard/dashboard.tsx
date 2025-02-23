// src/Components/Dashboard.tsx
import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { fetchRecords } from "../../firebaseServices"; // Import your Firebase service
import { BorrowRecord } from "../../firebaseServices"; // Import the interface

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard: React.FC = () => {
  const [borrowRecords, setBorrowRecords] = useState<BorrowRecord[]>([]);
  const [statusCounts, setStatusCounts] = useState<{ [key: string]: number }>({
    Borrowed: 0,
    Returned: 0,
    Overdue: 0,
  });
  const [mostBorrowedItem, setMostBorrowedItem] = useState<string>("");
  const [mostActiveUser, setMostActiveUser] = useState<string>("");

  // Fetch data from Firebase
  useEffect(() => {
    const loadData = async () => {
      try {
        const records = await fetchRecords();
        setBorrowRecords(records);

        // Calculate status counts
        const counts = records.reduce(
          (acc, record) => {
            acc[record.status] = (acc[record.status] || 0) + 1;
            return acc;
          },
          { Borrowed: 0, Returned: 0, Overdue: 0 }
        );
        setStatusCounts(counts);

        // Calculate most borrowed item
        const itemCounts = records.reduce((acc, record) => {
          acc[record.itemName] = (acc[record.itemName] || 0) + 1;
          return acc;
        }, {} as { [key: string]: number });
        const mostBorrowed = Object.keys(itemCounts).reduce((a, b) =>
          itemCounts[a] > itemCounts[b] ? a : b
        );
        setMostBorrowedItem(mostBorrowed);

        // Calculate most active user
        const userCounts = records.reduce((acc, record) => {
          acc[record.fullName] = (acc[record.fullName] || 0) + 1;
          return acc;
        }, {} as { [key: string]: number });
        const mostActive = Object.keys(userCounts).reduce((a, b) =>
          userCounts[a] > userCounts[b] ? a : b
        );
        setMostActiveUser(mostActive);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    loadData();
  }, []);

  // Data for the pie chart
  const pieChartData = {
    labels: ["Borrowed", "Returned", "Overdue"],
    datasets: [
      {
        data: [statusCounts.Borrowed, statusCounts.Returned, statusCounts.Overdue],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-100 h-screen w-screen">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">Borrowed</h2>
          <p className="text-3xl font-bold text-yellow-600">{statusCounts.Borrowed}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">Returned</h2>
          <p className="text-3xl font-bold text-green-600">{statusCounts.Returned}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">Overdue</h2>
          <p className="text-3xl font-bold text-red-600">{statusCounts.Overdue}</p>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Status Distribution</h2>
        <div className="w-screen md:w-1/2 mx-auto">
          <Doughnut data={pieChartData} />
        </div>
      </div>

      {/* Most Borrowed Item and Most Active User */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">Most Borrowed Item</h2>
          <p className="text-xl font-bold text-blue-600">{mostBorrowedItem}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">Most Active User</h2>
          <p className="text-xl font-bold text-purple-600">{mostActiveUser}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;