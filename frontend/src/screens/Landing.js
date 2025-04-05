import React, { useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Button, Container } from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Product from "../components/Product";
import Paginate from "../components/Paginate";
import Meta from "../components/Meta";
import { listProducts } from "../actions/productActions";
import { PRODUCT_CREATE_RESET } from "../types/productConstants";

const Landing = ({ match }) => {
  const keyword = match.params.keyword;
  const pageNumber = match.params.pageNumber || 1;
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages } = productList;
  const userLogin = useSelector((state) => state.userLogin);
  const { userData } = userLogin;

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET });
    dispatch(listProducts(keyword, pageNumber));
  }, [dispatch, keyword, pageNumber]);

  return (
    <Container>
      <Meta />
      <div className="landing-header animate-fadeInUp">
        {keyword ? (
          <Link className="btn btn-outline-primary mb-4" to="/">
            <i className="fas fa-arrow-left me-2"></i>Back to Home
          </Link>
        ) : (
          <div className="hero-section text-center mb-5">
            <h1 className="hero-title mb-4">
              Discover Premium Second-Hand Items
              <span className="accent-dot">.</span>
            </h1>
            <p className="hero-subtitle mb-4">
              Find unique pieces at amazing prices, carefully curated for you
            </p>
            <div className="features-grid mb-5">
              <div className="feature-item">
                <i className="fas fa-shield-alt feature-icon"></i>
                <h4>Trusted Sellers</h4>
                <p>Verified profiles and secure transactions</p>
              </div>
              <div className="feature-item">
                <i className="fas fa-tags feature-icon"></i>
                <h4>Best Prices</h4>
                <p>Negotiate directly with sellers</p>
              </div>
              <div className="feature-item">
                <i className="fas fa-box-open feature-icon"></i>
                <h4>Quality Items</h4>
                <p>Carefully inspected products</p>
              </div>
            </div>
          </div>
        )}

        <Row className="align-items-center mb-4">
          <Col lg={6}>
            <div className="section-header">
              <h3 className="section-title mb-0">
                <i className="fas fa-fire me-2 text-accent"></i>
                Latest Items On Sale
              </h3>
              <div className="section-line"></div>
            </div>
          </Col>
          <Col lg={6} className="text-lg-end mt-3 mt-lg-0">
            <LinkContainer to={userData ? "/createproduct" : "/login"}>
              <Button className="btn-primary btn-hover-effect">
                <i className="fas fa-plus me-2 p-2"></i>
                List Your Item
              </Button>
            </LinkContainer>
          </Col>
        </Row>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row className="g-4">
            {products.map((product) => (
              <Col
                key={product._id}
                sm={12}
                md={6}
                lg={4}
                className="animate-fadeInUp"
                style={{
                  animationDelay: `${products.indexOf(product) * 0.1}s`,
                }}
              >
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <div className="mt-5">
            <Paginate
              className="paginate"
              pages={pages}
              page={page}
              keyword={keyword ? keyword : ""}
            />
          </div>
        </>
      )}
    </Container>
  );
};

export default Landing;
