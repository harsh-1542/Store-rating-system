import React from 'react';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Dashboard from '../components/storeOwner/Dashboard';
import UpdatePasswordForm from '../components/storeOwner/UpdatePasswordForm';

const StoreOwnerDashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user?.name || 'Store Owner'}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-9">
          <Dashboard />
        </div>
        
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-xl font-bold mb-2">Quick Actions</h2>
            <ul className="space-y-2">
              <li>
                <a 
                  href="#update-password" 
                  className="block px-4 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                >
                  Update Password
                </a>
              </li>
              <li>
                <a 
                  href="#view-ratings" 
                  className="block px-4 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                >
                  View All Ratings
                </a>
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-bold mb-2">Account Information</h2>
            <div className="space-y-2">
              <div>
                <span className="text-gray-600">Email:</span>
                <div className="font-medium">{user?.email}</div>
              </div>
              <div>
                <span className="text-gray-600">Role:</span>
                <div className="font-medium">Store Owner</div>
              </div>
              <div>
                <span className="text-gray-600">Store:</span>
                <div className="font-medium">{user?.store?.name || 'Not assigned'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div id="update-password" className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Update Password</h2>
        <UpdatePasswordForm />
      </div>
      
      <div id="view-ratings" className="mt-12">
        <h2 className="text-2xl font-bold mb-6">All Ratings</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Import and use RatingsList with no limit */}
          {/* {React.createElement(require('../components/storeOwner/RatingsList').default)} */}
        </div>
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;