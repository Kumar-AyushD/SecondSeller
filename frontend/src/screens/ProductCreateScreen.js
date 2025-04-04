import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { createProduct } from '../actions/productActions';
import FormContainer from '../components/FormContainer';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const ProductCreateScreen = ({ history }) => {
  const [name, setName] = useState('');
  const [images, setImages] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [expiresOn, setExpiresOn] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingCharge, setShippingCharge] = useState('');
  const [price, setPrice] = useState(0);
  const [negotiable, setNegotiable] = useState(false);

  const dispatch = useDispatch();
  const productCreate = useSelector((state) => state.productCreate);
  const { loading, error, success } = productCreate;
  const userLogin = useSelector((state) => state.userLogin);
  const { userData } = userLogin;

  useEffect(() => {
    if (success || !userData) {
      history.push('/');
    }
  }, [history, success, userData]);

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
            setImages(downloadURL);
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
        images,
        description,
        category,
        expiresOn,
        shippingAddress,
        shippingCharge,
        price,
        negotiable
      )
    );
  };

  return (
    <FormContainer>
      <h1 className="text-center mb-4">Upload Your Property</h1>
      {loading ? (
        <Loader />
      ) : (
        <Card className="p-4 shadow-sm">
          <Form onSubmit={submitHandler}>
            <Row>
              <Col md={6}>
                <Form.Group controlId="name" className="mb-3">
                  <Form.Label className="fw-bold">Property Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your product name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="rounded"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="category" className="mb-3">
                  <Form.Label className="fw-bold">Category</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., Electronics, Books, Furniture"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="rounded"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group controlId="images" className="mb-3">
              <Form.Label className="fw-bold">
                Image <small className="text-muted">*Upload image only</small>
              </Form.Label>
              <Form.File
                id="image-file"
                label="Choose File"
                custom
                onChange={uploadFileHandler}
                disabled={uploading}
                className="mb-2"
              />
              {uploading && (
                <div className="d-flex justify-content-center my-3">
                  <div style={{ width: '60px', height: '60px' }}>
                    <CircularProgressbar
                      value={uploadProgress || 0}
                      text={`${uploadProgress || 0}%`}
                    />
                  </div>
                </div>
              )}
              {uploadError && <Message variant="danger">{uploadError}</Message>}
              {images && !uploading && (
                <Card className="mt-3 p-2 text-center">
                  <img
                    src={images}
                    alt="Uploaded preview"
                    style={{ maxHeight: '150px', objectFit: 'cover' }}
                    className="rounded"
                  />
                </Card>
              )}
            </Form.Group>

            <Form.Group controlId="description" className="mb-3">
              <Form.Label className="fw-bold">Description</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Describe your property"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="rounded"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group controlId="price" className="mb-3">
                  <Form.Label className="fw-bold">Price</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    className="rounded"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="expiresOn" className="mb-3">
                  <Form.Label className="fw-bold">Available Until</Form.Label>
                  <Form.Control
                    type="date"
                    value={expiresOn}
                    onChange={(e) => setExpiresOn(e.target.value)}
                    required
                    className="rounded"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group controlId="negotiable" className="mb-3">
              <Form.Check
                type="checkbox"
                label="Is the price negotiable?"
                checked={negotiable}
                onChange={(e) => setNegotiable(e.target.checked)}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group controlId="shippingAddress" className="mb-3">
                  <Form.Label className="fw-bold">Shipping Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Where can you deliver?"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    required
                    className="rounded"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="shippingCharge" className="mb-3">
                  <Form.Label className="fw-bold">Shipping Charge</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Shipping cost"
                    value={shippingCharge}
                    onChange={(e) => setShippingCharge(e.target.value)}
                    required
                    className="rounded"
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end mt-4">
              <Button
                type="submit"
                variant="primary"
                disabled={uploading}
                className="px-4 py-2 rounded"
              >
                Upload Property
              </Button>
            </div>
            {error && <Message variant="danger" className="mt-3">{error}</Message>}
          </Form>
        </Card>
      )}
    </FormContainer>
  );
};

export default ProductCreateScreen;