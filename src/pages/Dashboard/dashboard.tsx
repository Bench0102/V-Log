import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { fetchRecords } from "../../firebaseServices"; // Import your Firebase service

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard: React.FC = () => {
  const [statusCounts, setStatusCounts] = useState<{ [key: string]: number }>({
    Borrowed: 0,
    Returned: 0,
    Overdue: 0,
  });
  const [mostBorrowedItems, setMostBorrowedItems] = useState<{ itemName: string; count: number }[]>([]);
  const [mostActiveUsers, setMostActiveUsers] = useState<{ fullName: string; count: number }[]>([]);

  // Fetch data from Firebase
  useEffect(() => {
    const loadData = async () => {
      try {
        const records = await fetchRecords();

        // Calculate status counts
        const counts = records.reduce(
          (acc, record) => {
            acc[record.status] = (acc[record.status] || 0) + 1;
            return acc;
          },
          { Borrowed: 0, Returned: 0, Overdue: 0 }
        );
        setStatusCounts(counts);

        // Calculate most borrowed items
        const itemCounts = records.reduce((acc, record) => {
          acc[record.itemName] = (acc[record.itemName] || 0) + 1;
          return acc;
        }, {} as { [key: string]: number });

        const sortedItems = Object.entries(itemCounts)
          .map(([itemName, count]) => ({ itemName, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 3); // Get top 3
        setMostBorrowedItems(sortedItems);

        // Calculate most active users
        const userCounts = records.reduce((acc, record) => {
          acc[record.fullName] = (acc[record.fullName] || 0) + 1;
          return acc;
        }, {} as { [key: string]: number });

        const sortedUsers = Object.entries(userCounts)
          .map(([fullName, count]) => ({ fullName, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 3); // Get top 3
        setMostActiveUsers(sortedUsers);
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
    <div className="p-6 bg-gray-100 flex-grow min-h-screen w-full">
      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-bold text-black-700">Borrowed</h2>
          <p className="text-3xl font-bold text-yellow-600">{statusCounts.Borrowed}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-bold text-black-700">Returned</h2>
          <p className="text-3xl font-bold text-green-600">{statusCounts.Returned}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-bold text-black-700">Overdue</h2>
          <p className="text-3xl font-bold text-red-600">{statusCounts.Overdue}</p>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-lg font-bold text-black-700 mb-4 text-left">Status Distribution</h2>
        <div className="w-full h-64 sm:h-80 md:w-2/3 lg:w-1/3 mx-auto">
          <Doughnut
            data={pieChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        </div>
      </div>

      {/* Top 3 Most Borrowed Items & Top 3 Most Active Users */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Top 3 Most Borrowed Items */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-bold text-black-700 mb-4 text-left">Top 3 Most Borrowed Items</h2>
          <div className="space-y-2">
            {mostBorrowedItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-700">{index + 1}. {item.itemName}</span>
                <span className="text-lg font-bold text-blue-600">{item.count} borrows</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top 3 Most Active Users */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-bold text-black-700 mb-4 text-left">Top 3 Most Active Users</h2>
          <div className="space-y-2">
            {mostActiveUsers.map((user, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-700">{index + 1}. {user.fullName}</span>
                <span className="text-lg font-bold text-purple-600">{user.count} borrows</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;