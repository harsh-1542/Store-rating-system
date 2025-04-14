import React, { useState, useEffect } from 'react';
import { getAllStores } from '../../api/stores';
import StoreCard from '../common/StoreCard';
import { getUserRating } from '../../api/ratings';

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [userRatings, setUserRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('name'); // 'name' or 'address'

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const storesData = await getAllStores();
        setStores(storesData);
        
        // Get user ratings for all stores
        const ratings = await getUserRating();
        const ratingsMap = {};
        ratings.forEach(rating => {
          ratingsMap[rating.storeId] = rating.rating;
        });
        
        setUserRatings(ratingsMap);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stores:', error);
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  const filteredStores = stores.filter(store => {
    if (searchBy === 'name') {
      return store.name.toLowerCase().includes(searchTerm.toLowerCase());
    } else {
      return store.address.toLowerCase().includes(searchTerm.toLowerCase());
    }
  });

  if (loading) {
    return <div className="text-center py-10">Loading stores...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Available Stores</h2>
      
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder={`Search by ${searchBy}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <span>Search by:</span>
          <select 
            value={searchBy} 
            onChange={(e) => setSearchBy(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="name">Name</option>
            <option value="address">Address</option>
          </select>
        </div>
      </div>

      {filteredStores.length === 0 ? (
        <div className="text-center py-10">No stores found matching your search.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.map(store => (
            <StoreCard 
              key={store.id} 
              store={store} 
              userRating={userRatings[store.id] || 0}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StoreList;