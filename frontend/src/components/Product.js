import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const Product = ({ product }) => {
  return (
    <Card className="product-card h-100">
      <Link to={`/product/${product._id}`}>
        <div className="card-image-wrapper">
          <Card.Img
            className="card-image"
            src={product.images[0].image1}
            alt={product.name}
          />
          <div className="card-overlay">
            <span className="view-details">View Details</span>
          </div>
        </div>
      </Link>
      <Card.Body className="d-flex flex-column">
        <Link to={`/product/${product._id}`}>
          <div className="mb-3">
            <span className="name-label">{product.name}</span>
          </div>
        </Link>
        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center">
            <Card.Text as="h3" className="price mb-0">
              Rs {product.Cost.price.toLocaleString()}
            </Card.Text>
            <span className="condition-badge">
              {product.condition || "Used"}
            </span>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Product;
