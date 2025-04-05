import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { createProduct } from "../actions/productActions";
import { PRODUCT_CREATE_RESET } from "../types/productConstants";
import { Link } from "react-router-dom";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const ProductCreateScreen = ({ history }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [negotiable, setNegotiable] = useState(false);
  const [image, setImage] = useState("");
  const [expiresOn, setExpiresOn] = useState(""); // Added
  const [address, setAddress] = useState("");
  const [shippingCharge, setShippingCharge] = useState(""); // Added
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  const dispatch = useDispatch();
  const productCreate = useSelector((state) => state.productCreate);
  const { loading, error, success } = productCreate;

  useEffect(() => {
    if (success) {
      dispatch({ type: PRODUCT_CREATE_RESET });
      history.push("/");
    }
  }, [dispatch, history, success]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setUploadError('Please select an image');
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const storage = getStorage(app);
      const fileName = `${new Date().getTime()}-${file.name}`;
      const storageRef = ref(storage, `images/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setUploadError('Image upload failed');
          setUploadProgress(null);
          setUploading(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImage(downloadURL);
            setUploadProgress(null);
            setUploading(false);
          });
        }
      );
    } catch (err) {
      setUploadError('Image upload failed');
      setUploadProgress(null);
      setUploading(false);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      createProduct(
        name,
        image, // Changed to match backend param name
        description,
        category,
        expiresOn,
        address,
        shippingCharge,
        price,
        negotiable
      )
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
              {uploadError && <Message variant="danger">{uploadError}</Message>}

              <Form onSubmit={submitHandler}>
                <div className="form-section mb-4">
                  <h4 className="section-title mb-3">
                    <i className="fas fa-info-circle me-2 text-primary"></i>
                    Basic Information
                  </h4>
                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label className="text-light">Product Name</Form.Label>
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
                        <Form.Label className="text-light">Description</Form.Label>
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
                          <option value="Home & Living">Home & Living</option>
                          <option value="Sports">Sports</option>
                          <option value="Other">Other</option>
                        </Form.Control>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="text-light">Expires On</Form.Label>
                        <Form.Control
                          type="date"
                          value={expiresOn}
                          onChange={(e) => setExpiresOn(e.target.value)}
                        />
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
                        <Form.Label className="text-light">Price (₹)</Form.Label>
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
                    Image
                  </h4>
                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label className="text-light">Product Image</Form.Label>
                        <Form.Control
                          type="file"
                          onChange={uploadFileHandler}
                          disabled={uploading}
                        />
                        {uploading && uploadProgress && (
                          <div className="d-flex justify-content-center my-3">
                            <div style={{ width: '60px', height: '60px' }}>
                              <CircularProgressbar
                                value={uploadProgress || 0}
                                text={`${uploadProgress || 0}%`}
                              />
                            </div>
                          </div>
                        )}
                        {image && !uploading && (
                          <img src={image} alt="Preview" className="mt-2" style={{ maxHeight: '150px' }} />
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                </div>

                <div className="form-section mb-4">
                  <h4 className="section-title mb-3">
                    <i className="fas fa-address-card me-2 text-warning"></i>
                    Shipping Information
                  </h4>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="text-light">Shipping Address</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter shipping address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="text-light">Shipping Charge (₹)</Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Enter shipping charge"
                          value={shippingCharge}
                          onChange={(e) => setShippingCharge(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-100 py-3 mt-4"
                  disabled={loading || uploading}
                >
                  {loading || uploading ? (
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