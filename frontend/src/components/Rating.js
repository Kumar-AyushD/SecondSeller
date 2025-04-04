import React from 'react';
import PropTypes from 'prop-types';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const Rating = ({ value, text }) => {
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star}>
          {value >= star ? (
            <FaStar className="text-yellow-500" />
          ) : value >= star - 0.5 ? (
            <FaStarHalfAlt className="text-yellow-500" />
          ) : (
            <FaRegStar className="text-gray-400" />
          )}
        </span>
      ))}
      {text && <span className="ml-2 text-gray-600">{text}</span>}
    </div>
  );
};

Rating.propTypes = {
  value: PropTypes.number.isRequired,
  text: PropTypes.string,
};

export default Rating;
