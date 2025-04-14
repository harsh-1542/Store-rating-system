import React, { useState, useEffect } from 'react';
import { getStoreOwnerDashboardData } from '../../api/stores';
import RatingsList from './RatingsList';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    storeName: '',
    averageRating: 0,
    totalRatings: 0,
    ratingsByValue: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // useEffect(() => {
  //   const fetchDashboardData = async () => {
  //     try {
  //       const data = await getStoreOwnerDashboardData();
  //       setDashboardData(data);
  //       setLoading(false);
  //     } catch (error) {
  //       console.error('Error fetching dashboard data:', error);
  //       setError('Failed to load dashboard data');
  //       setLoading(false);
  //     }
  //   };

  //   fetchDashboardData();
  // }, []);

  if (loading) {
    return <div className="text-center py-10">Loading dashboard data...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Store Dashboard</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">{dashboardData.storeName}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800">Average Rating</h3>
            <div className="flex items-center mt-2">
              <span className="text-3xl font-bold">{dashboardData.averageRating.toFixed(1)}</span>
              <span className="text-yellow-500 text-3xl ml-2">★</span>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800">Total Ratings</h3>
            <div className="text-3xl font-bold mt-2">{dashboardData.totalRatings}</div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-800">Customer Sentiment</h3>
            <div className="text-3xl font-bold mt-2">
              {dashboardData.averageRating >= 4 ? 'Positive' : 
               dashboardData.averageRating >= 3 ? 'Neutral' : 'Needs Improvement'}
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">Rating Distribution</h3>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(rating => {
              const count = dashboardData.ratingsByValue[rating] || 0;
              const percentage = dashboardData.totalRatings > 0 
                ? Math.round((count / dashboardData.totalRatings) * 100) 
                : 0;
              
              return (
                <div key={rating} className="flex items-center">
                  <div className="w-8 text-lg font-medium">{rating}★</div>
                  <div className="flex-1 mx-2">
                    <div className="bg-gray-200 rounded-full h-4">
                      <div 
                        className="bg-yellow-500 h-4 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-16 text-right">{count} ({percentage}%)</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Recent Ratings</h2>
        {/* <RatingsList limit={5} /> */}
      </div>
    </div>
  );
};

export default Dashboard;