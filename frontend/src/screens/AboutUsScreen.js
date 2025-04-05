import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import Meta from "../components/Meta";

const AboutUsScreen = () => {
  return (
    <Container className="py-5">
      <Meta title="About Us" />

      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-gradient mb-4">
          About SecondSeller
        </h1>
        <p className="lead text-secondary mb-0">
          Your trusted marketplace for premium second-hand items
        </p>
      </div>

      <Row className="g-4 mb-5">
        <Col md={4}>
          <Card className="feature-card h-100 border-0 shadow-lg">
            <Card.Body className="p-4 text-center">
              <div className="feature-icon-wrapper mb-4">
                <i className="fas fa-handshake"></i>
              </div>
              <h3 className="h4 mb-3">Our Mission</h3>
              <p className="text-secondary mb-0">
                To create a trusted community marketplace where quality meets
                affordability
              </p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="feature-card h-100 border-0 shadow-lg">
            <Card.Body className="p-4 text-center">
              <div className="feature-icon-wrapper mb-4">
                <i className="fas fa-bullseye"></i>
              </div>
              <h3 className="h4 mb-3">Our Vision</h3>
              <p className="text-secondary mb-0">
                To revolutionize the way people buy and sell second-hand items
              </p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="feature-card h-100 border-0 shadow-lg">
            <Card.Body className="p-4 text-center">
              <div className="feature-icon-wrapper mb-4">
                <i className="fas fa-heart"></i>
              </div>
              <h3 className="h4 mb-3">Our Values</h3>
              <p className="text-secondary mb-0">
                Trust, Quality, and Customer Satisfaction drive everything we do
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="align-items-center g-5">
        <Col lg={6}>
          <div className="about-content">
            <h2 className="section-title mb-4">
              <i className="fas fa-users me-3 text-primary"></i>
              Who We Are
            </h2>
            <p className="text-secondary mb-4">
              SecondSeller is a premier online marketplace dedicated to
              connecting buyers and sellers of high-quality second-hand items.
              We believe in giving products a second life while helping our
              users find great deals.
            </p>
            {/* <div className="stats-grid">
              <div className="stat-item">
                <h3 className="stat-number text-primary">1000+</h3>
                <p className="stat-label">Active Users</p>
              </div>
              <div className="stat-item">
                <h3 className="stat-number text-primary">5000+</h3>
                <p className="stat-label">Items Listed</p>
              </div>
              <div className="stat-item">
                <h3 className="stat-number text-primary">98%</h3>
                <p className="stat-label">Satisfaction Rate</p>
              </div>
            </div> */}
          </div>
        </Col>

        <Col lg={6}>
          <Card className="border-0 shadow-lg overflow-hidden">
            <Card.Body className="p-4">
              <h2 className="section-title mb-4">
                <i className="fas fa-shield-alt me-3 text-success"></i>
                Our Guarantee
              </h2>
              <div className="guarantee-list">
                <div className="guarantee-item">
                  <i className="fas fa-check-circle text-success"></i>
                  <span>Verified Sellers</span>
                </div>
                <div className="guarantee-item">
                  <i className="fas fa-check-circle text-success"></i>
                  <span>Quality Assurance</span>
                </div>
                <div className="guarantee-item">
                  <i className="fas fa-check-circle text-success"></i>
                  <span>Secure Transactions</span>
                </div>
                <div className="guarantee-item">
                  <i className="fas fa-check-circle text-success"></i>
                  <span>24/7 Support</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AboutUsScreen;
