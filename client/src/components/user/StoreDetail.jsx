import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStoreById } from '../../api/stores';
import { getUserRating, createRating, updateRating } from '../../api/ratings';
import RatingInput from '../common/RatingInput';

const StoreDetail = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchStoreDetails = async () => {
      try {
        const storeData = await getStoreById(storeId);
        setStore(storeData);
        
        // Get user's rating for this store
        const rating = await getUserRating(storeId);
        if (rating) {
          setUserRating(rating.rating);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching store details:', error);
        setLoading(false);
        setError('Failed to load store details');
      }
    };

    fetchStoreDetails();
  }, [storeId]);

  const handleRatingSubmit = async () => {
    setError('');
    setSuccess('');
    setSubmitting(true);
    
    try {
      let response;
      
      if (userRating > 0) {
        if (store.userHasRated) {
          // Update existing rating
          response = await updateRating(storeId, userRating);
        } else {
          // Submit new rating
          response = await createRating(storeId, userRating);
        }
        
        setSuccess('Rating submitted successfully!');
        // Update store data with new average rating
        setStore({
          ...store,
          averageRating: response.newAverageRating,
          userHasRated: true
        });
      } else {
        setError('Please select a rating');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      setError('Failed to submit rating. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/stores');
  };

  if (loading) {
    return <div className="text-center py-10">Loading store details...</div>;
  }

  if (!store) {
    return <div className="text-center py-10">Store not found</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <button 
        onClick={handleBack}
        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        &larr; Back to Stores
      </button>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-2">{store.name}</h1>
        <p className="text-gray-600 mb-4">{store.address}</p>
        
        <div className="mb-6">
          <span className="font-semibold">Average Rating:</span> 
          <span className="text-xl ml-2">
            {store.averageRating ? store.averageRating.toFixed(1) : 'No ratings yet'}
          </span>
          <span className="text-yellow-500 ml-2">★</span>
        </div>
        
        <div className="border-t pt-6">
          <h3 className="text-xl font-semibold mb-4">Your Rating</h3>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}
          
          <div className="mb-4">
            <RatingInput 
              currentRating={userRating} 
              onChange={setUserRating}
            />
          </div>
          
          <button
            onClick={handleRatingSubmit}
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {submitting ? 'Submitting...' : userRating > 0 && store.userHasRated ? 'Update Rating' : 'Submit Rating'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreDetail;