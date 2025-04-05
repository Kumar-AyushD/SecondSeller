import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { createProduct } from "../actions/productActions";
import { PRODUCT_CREATE_RESET } from "../types/productConstants";
import { Link } from "react-router-dom";

const ProductCreateScreen = ({ history }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [price, setPrice] = useState("");
  const [negotiable, setNegotiable] = useState(false);
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch();
  const productCreate = useSelector((state) => state.productCreate);
  const { loading, error, success } = productCreate;

  useEffect(() => {
    if (success) {
      dispatch({ type: PRODUCT_CREATE_RESET });
      history.push("/");
    }
  }, [dispatch, history, success]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      createProduct({
        name,
        description,
        category,
        condition,
        Cost: { price, negotiable },
        image1,
        image2,
        image3,
        contact: { phone, email },
        address,
      })
    );
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Link to="/" className="btn btn-outline-primary mb-4">
            <i className="fas fa-arrow-left me-2 p-2"></i>Back to Home
          </Link>

          <Card className="shadow-lg border-0">
            <Card.Header className="bg-gradient">
              <h2 className="text-white mb-0">List Your Item</h2>
            </Card.Header>
            <Card.Body className="p-4">
              {loading && <Loader />}
              {error && <Message variant="danger">{error}</Message>}

              <Form onSubmit={submitHandler}>
                <div className="form-section mb-4">
                  <h4 className="section-title mb-3">
                    <i className="fas fa-info-circle me-2 text-primary"></i>
                    Basic Information
                  </h4>
                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label className="text-light">
                          Product Name
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter product name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label className="text-light">
                          Description
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={4}
                          placeholder="Describe your product"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="text-light">Category</Form.Label>
                        <Form.Control
                          as="select"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                        >
                          <option value="">Select Category</option>
                          <option value="Electronics">Electronics</option>
                          <option value="Books">Books</option>
                          <option value="Fashion">Fashion</option>
                          <option value="Home">Home & Living</option>
                          <option value="Sports">Sports</option>
                          <option value="Other">Other</option>
                        </Form.Control>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="text-light">
                          Condition
                        </Form.Label>
                        <Form.Control
                          as="select"
                          value={condition}
                          onChange={(e) => setCondition(e.target.value)}
                        >
                          <option value="">Select Condition</option>
                          <option value="New">New</option>
                          <option value="Like New">Like New</option>
                          <option value="Good">Good</option>
                          <option value="Fair">Fair</option>
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                </div>

                <div className="form-section mb-4">
                  <h4 className="section-title mb-3">
                    <i className="fas fa-tag me-2 text-success"></i>
                    Pricing
                  </h4>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="text-light">
                          Price (₹)
                        </Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Enter price"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6} className="d-flex align-items-center">
                      <Form.Group className="mb-3">
                        <Form.Check
                          type="checkbox"
                          label="Price is negotiable"
                          checked={negotiable}
                          onChange={(e) => setNegotiable(e.target.checked)}
                          className="text-light"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>

                <div className="form-section mb-4">
                  <h4 className="section-title mb-3">
                    <i className="fas fa-camera me-2 text-info"></i>
                    Images
                  </h4>
                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label className="text-light">
                          Primary Image URL
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter image URL"
                          value={image1}
                          onChange={(e) => setImage1(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="text-light">
                          Additional Image URL (Optional)
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter image URL"
                          value={image2}
                          onChange={(e) => setImage2(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="text-light">
                          Additional Image URL (Optional)
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter image URL"
                          value={image3}
                          onChange={(e) => setImage3(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>

                <div className="form-section mb-4">
                  <h4 className="section-title mb-3">
                    <i className="fas fa-address-card me-2 text-warning"></i>
                    Contact Information
                  </h4>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="text-light">
                          Phone Number
                        </Form.Label>
                        <Form.Control
                          type="tel"
                          placeholder="Enter phone number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="text-light">Email</Form.Label>
                        <Form.Control
                          type="email"
                          placeholder="Enter email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label className="text-light">Address</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter your address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-100 py-3 mt-4"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Creating...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-plus-circle me-2 p-2"></i>
                      List Item
                    </>
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductCreateScreen;
