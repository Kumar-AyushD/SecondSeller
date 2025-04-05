import React, { useState, useEffect } from "react";
import Meta from "../components/Meta";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
  Badge,
  Container,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  listProductDetails,
  createProductReview,
} from "../actions/productActions";
import { sendEmail } from "../actions/userActions";
import { PRODUCT_REVIEW_RESET } from "../types/productConstants";

const ProductScreen = ({ match, history }) => {
  const [text, setText] = useState("");
  const [comment, setComment] = useState("");
  const [sendMail, setSendMail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const dispatch = useDispatch();
  const emailReducer = useSelector((state) => state.emailReducer);
  const {
    loading: loadingEmail,
    error: errorEmail,
    data: dataEmail,
  } = emailReducer;
  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const {
    loading: loadingReview,
    error: errorReview,
    success: successReview,
  } = productReviewCreate;
  const userLogin = useSelector((state) => state.userLogin);
  const { userData } = userLogin;
  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  useEffect(() => {
    if (successReview) {
      setComment("");
      dispatch({ type: PRODUCT_REVIEW_RESET });
    }
    dispatch(listProductDetails(match.params.id));
  }, [match.params.id, dispatch, successReview]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(createProductReview(match.params.id, comment));
  };

  const emailSubmit = (e) => {
    e.preventDefault();
    setEmailSent(true);
    dispatch(
      sendEmail(
        product?.seller?.selleremail,
        text,
        userData?.name,
        userData?.address,
        product?.name,
        userData?.email,
        userData?.contact?.phone_no
      )
    );
    setText("");
    setSendMail(false);
    setTimeout(() => setEmailSent(false), 10000);
  };

  return (
    <Container className="py-4">
      <Link className="btn btn-outline-primary mb-4" to="/">
        <i className="fas fa-arrow-left me-2 p-2"></i>Back to Home
      </Link>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : product ? (
        <>
          <Meta title={product.name} />
          <Row>
            <Col md={6} className="mb-4 mb-md-0">
              <Card className="shadow-lg border-0 overflow-hidden">
                <div className="product-image-container">
                  {product.images && product.images[0] && (
                    <Image
                      src={product.images[0].image1}
                      alt={product.name}
                      className="product-main-image"
                    />
                  )}
                </div>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="shadow-lg border-0 h-100">
                <Card.Body>
                  <h2 className="product-title mb-4">{product.name}</h2>

                  <ListGroup variant="flush">
                    <ListGroup.Item className="bg-transparent px-0">
                      <div className="d-flex align-items-center mb-2">
                        <h3 className="price mb-0">
                          ₹
                          {product?.Cost?.price?.toLocaleString() ||
                            "Price not available"}
                        </h3>
                        {product?.Cost?.negotiable && (
                          <Badge bg="success" className="ms-3 px-3 py-2">
                            Negotiable
                          </Badge>
                        )}
                      </div>
                    </ListGroup.Item>

                    <ListGroup.Item className="bg-transparent px-0">
                      <h4 className="section-title">
                        <i className="fas fa-info-circle me-2 text-primary p-2"></i>
                        Description
                      </h4>
                      <p className="text-secondary mb-0">
                        {product.description || "No description available"}
                      </p>
                    </ListGroup.Item>

                    <ListGroup.Item className="bg-transparent px-0">
                      <h4 className="section-title">
                        <i className="fas fa-star me-2 text-warning p-2"></i>
                        Condition
                      </h4>
                      <Badge
                        bg={product.condition === "New" ? "info" : "secondary"}
                        className="condition-badge px-3 py-2"
                      >
                        {product.condition || "Used"}
                      </Badge>
                    </ListGroup.Item>

                    <ListGroup.Item className="bg-transparent px-0">
                      <h4 className="section-title">
                        <i className="fas fa-address-card me-2 text-success p-2"></i>
                        Contact Information
                      </h4>
                      <div className="contact-info">
                        {product?.contact?.phone_no && (
                          <div className="contact-item">
                            <i className="fas fa-phone text-primary"></i>
                            <span>{product.contact.phone_no}</span>
                          </div>
                        )}
                        {product?.contact?.email && (
                          <div className="contact-item">
                            <i className="fas fa-envelope text-primary"></i>
                            <span>{product.contact.email}</span>
                          </div>
                        )}
                      </div>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      ) : (
        <Message variant="info">Product not found</Message>
      )}
    </Container>
  );
};

export default ProductScreen;
