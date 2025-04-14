import React from 'react';
import { Link } from 'react-router-dom';
import RatingInput from './RatingInput';

const StoreCard = ({ store, userRating, onRatingChange, readOnly = false }) => {
  const renderRatingStars = (rating) => {
    return (
      <div className="flex items-center">
        <span className="text-xl font-bold mr-1">{rating?.toFixed(1) || 'N/A'}</span>
        <span className="text-yellow-500">★</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{store.name}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{store.address}</p>
        
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-gray-500 text-sm">Average Rating</span>
            {renderRatingStars(store.averageRating)}
          </div>
          
          {userRating !== undefined && (
            <div className="text-right">
              <span className="text-gray-500 text-sm">Your Rating</span>
              {readOnly ? (
                renderRatingStars(userRating)
              ) : (
                <RatingInput 
                  currentRating={userRating} 
                  onChange={onRatingChange} 
                  size="sm"
                />
              )}
            </div>
          )}
        </div>
        
        <Link 
          to={`/stores/${store.id}`}
          className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default StoreCard;