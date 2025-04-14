import React from 'react';

const RatingInput = ({ currentRating = 0, onChange, size = 'md', readOnly = false }) => {
  const starSize = size === 'sm' ? 'text-xl' : 'text-3xl';
  
  const handleRatingClick = (rating) => {
    if (!readOnly && onChange) {
      onChange(rating);
    }
  };

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          key={rating}
          type="button"
          onClick={() => handleRatingClick(rating)}
          disabled={readOnly}
          className={`${starSize} focus:outline-none ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
        >
          <span 
            className={`${
              rating <= currentRating ? 'text-yellow-500' : 'text-gray-300'
            } hover:text-yellow-400`}
          >
            ★
          </span>
        </button>
      ))}
    </div>
  );
};

export default RatingInput;