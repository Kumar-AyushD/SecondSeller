import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Form, Button, Card, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listProductDetails, updateProduct } from '../actions/productActions'
import FormContainer from '../components/FormContainer'
import { PRODUCT_UPDATE_RESET } from '../types/productConstants'
const ProductEditScreen = ({ match, history }) => {
  const productId = match.params.id
  const [name, setName] = useState('')

  const [images, setImages] = useState('')

  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [expiresOn, setExpiresOn] = useState('')
  const [shippingAddress, setShippingAddress] = useState('')
  const [shippingCharge, setShippingCharge] = useState('0')

  const [price, setPrice] = useState(0)
  const [negotiable, setNegotiable] = useState(false)
  const [uploading, setUploading] = useState(false)

  const dispatch = useDispatch()
  const productDetails = useSelector((state) => state.productDetails)
  const { loading, error, product } = productDetails
  const productUpdate = useSelector((state) => state.productUpdate)
  const userLogin = useSelector((state) => state.userLogin)
  const { userData } = userLogin
  const {
    loading: loadingUpdate,
    error: errorUpdate,

    success: successUpdate,
  } = productUpdate
  useEffect(() => {
    dispatch({
      type: PRODUCT_UPDATE_RESET,
    })
    if (!userData || successUpdate) {
      history.push('/')
    }
    if (successUpdate && userData.isAdmin) {
      history.push('/admin/productlist')
    }
    if (!product.name || product._id !== productId) {
      dispatch(listProductDetails(productId))
    } else {
      setName(product.name)
      setImages(product.images.map((image) => image.image1).toString())

      setDescription(product.description)
      setCategory(product.category)
      setExpiresOn(product.expiresOn.substring(0, 10))
      setShippingAddress(product?.shippingAddress?.address)
      setShippingCharge(product?.shippingAddress?.shippingCharge)

      setPrice(product?.Cost?.price)
      setNegotiable(product?.Cost?.negotiable)
    }
  }, [history, dispatch, productId, product, successUpdate, userData])
  const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dh3bp7vbd/upload'
  const CLOUDINARY_UPLOAD_PRESET = 'qwdzopo4'
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
    setUploading(true)
    await axios({
      url: CLOUDINARY_URL,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: formData,
    })
      .then(function (res) {
        setImages(res.data.url)
      })
      .catch(function (err) {
        console.error(err)
      })
    setUploading(false)
  }

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(
      updateProduct(
        productId,
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
    )
  }
  return (
    <FormContainer>
      <Card className="p-4 shadow-sm">
        <h2 className="mb-4 text-center">Edit Product</h2>
        {loading && <Loader />}
        {error && <Message variant="danger">{error}</Message>}
        <Form onSubmit={submitHandler}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="name">
                <Form.Label>Property Name</Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  placeholder="Enter product name"
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="category">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  value={category}
                  placeholder="e.g., Electronics, Furniture"
                  onChange={(e) => setCategory(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group controlId="description" className="mb-4">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              placeholder="Describe your product..."
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
          <Row>
            <Col md={6}>
              <Form.Group controlId="expiresOn" className="mb-4">
                <Form.Label>Expiry Date</Form.Label>
                <Form.Control
                  type="date"
                  value={expiresOn}
                  onChange={(e) => setExpiresOn(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="price" className="mb-4">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  value={price}
                  placeholder="Enter price"
                  onChange={(e) => setPrice(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group controlId="images" className="mb-4">
            <Form.Label>Upload Image</Form.Label>
            <div className="custom-file">
              <input
                type="file"
                className="custom-file-input"
                id="image-file"
                onChange={uploadFileHandler}
              />
              <label className="custom-file-label" htmlFor="image-file">
                Choose file
              </label>
            </div>
            {images && (
              <div className="mt-3">
                <img src={images} alt="Uploaded" className="img-thumbnail" />
              </div>
            )}
          </Form.Group>
          <Form.Group controlId="negotiable" className="mb-4">
            <Form.Check
              type="checkbox"
              label="Price Negotiable"
              checked={negotiable}
              onChange={(e) => setNegotiable(e.target.checked)}
            />
          </Form.Group>
          <Button type="submit" variant="primary" className="w-100">
            Update Product
          </Button>
        </Form>
      </Card>
    </FormContainer>
  );
}  
export default ProductEditScreen
