import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import StoreList from '../components/user/StoreList';
import UpdatePasswordForm from '../components/user/UpdatePasswordForm';
import { getRatingsByUser } from '../api/ratings';
// import { getUserRatings } from '../api/ratings';

// import Link from "next/link"
// import {
//   CalendarDays,
//   CreditCard,
//   LayoutDashboard,
//   LogOut,
//   Settings,
//   ShoppingBag,
//   Star,
//   Store,
//   User,
// } from "lucide-react"

// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Skeleton } from "@/components/ui/skeleton"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"




export default function UserDashboard() {
  const { currentUser } = useContext(AuthContext);
  const [recentRatings, setRecentRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  

  // // Mock data - in a real app, this would come from API calls
  // const [loading, setLoading] = useState(false)
  // const [user, setUser] = useState({
  //   name: "Sarah Johnson",
  //   email: "sarah.johnson@example.com",
  //   role: "User",
  //   avatarUrl: "/placeholder.svg?height=40&width=40",
  // })

  // const [recentRatings, setRecentRatings] = useState([
  //   { id: 1, storeId: 101, storeName: "Coffee Haven", rating: 4.5, createdAt: "2023-04-10T10:30:00Z" },
  //   { id: 2, storeId: 102, storeName: "Bookworm Paradise", rating: 5, createdAt: "2023-04-05T14:20:00Z" },
  //   { id: 3, storeId: 103, storeName: "Tech Emporium", rating: 3.5, createdAt: "2023-03-28T09:15:00Z" },
  // ])

  // const [popularStores, setPopularStores] = useState([
  //   { id: 101, name: "Coffee Haven", rating: 4.8, category: "Café", visits: 1243 },
  //   { id: 104, name: "Green Grocers", rating: 4.7, category: "Grocery", visits: 987 },
  //   { id: 105, name: "Fashion Forward", rating: 4.6, category: "Clothing", visits: 876 },
  // ])

  // useEffect(() => {
  //   const fetchRecentRatings = async () => {
  //     try {
  //       // Get only 5 recent ratings
  //       // const user = JSON.parse(localStorage.getItem('user'));
        
  //       const response = await getRatingsByUser(currentUser.id);
  //       setRecentRatings(response);
  //       setLoading(false);
  //     } catch (error) {
  //       console.error('Error fetching recent ratings:', error.message);
  //       setLoading(false);
  //     }
  //   };

  //   fetchRecentRatings();
  // }, []);

 
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome, {currentUser?.name || 'User'}</h1>
      
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-6 ${
                activeTab === 'dashboard'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('stores')}
              className={`py-4 px-6 ${
                activeTab === 'stores'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Browse Stores
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`py-4 px-6 ${
                activeTab === 'password'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Update Password
            </button>
          </nav>
        </div>
      </div>
      
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Your Recent Ratings</h2>
              
              {loading ? (
                <div className="text-center py-4">Loading recent ratings...</div>
              ) : recentRatings.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-500">You haven't rated any stores yet.</p>
                  <Link 
                    to="/stores" 
                    className="mt-2 inline-block text-blue-600 hover:underline"
                  >
                    Browse stores to rate
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Store
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rating
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentRatings.map(rating => (
                        <tr key={rating.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{rating.storeName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="text-xl font-bold mr-2">{rating.rating}</span>
                              <span className="text-yellow-500">★</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(rating.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link
                              to={`/stores/${rating.storeId}`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View Store
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Popular Stores</h2>
              {/* This would be a simplified version of the StoreList component, showing top-rated stores */}
              <Link 
                to="/stores" 
                className="inline-block mt-4 text-blue-600 hover:underline"
              >
                View all stores
              </Link>
            </div>
          </div>
          
          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-2">Account Information</h2>
              <div className="space-y-2">
                <div>
                  <span className="text-gray-600">Name:</span>
                  <div className="font-medium">{currentUser?.name || 'Not provided'}</div>
                </div>
                <div>
                  <span className="text-gray-600">Email:</span>
                  <div className="font-medium">{currentUser?.email}</div>
                </div>
                <div>
                  <span className="text-gray-600">Role:</span>
                  <div className="font-medium">User</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-2">Quick Actions</h2>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => setActiveTab('stores')}
                    className="block w-full text-left px-4 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                  >
                    Browse Stores
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('password')}
                    className="block w-full text-left px-4 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                  >
                    Update Password
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'stores' && (
        <div>
          <StoreList />
        </div>
      )}
      
      {activeTab === 'password' && (
        <div className="max-w-lg mx-auto">
          <UpdatePasswordForm />
        </div>
      )}
    </div>
  );
};

