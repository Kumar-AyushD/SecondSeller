import React, { useState, useEffect } from 'react'
import Meta from '../components/Meta'
import { Row, Col, Image, ListGroup, Card, Button, Form, Badge } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Carousel from 'react-bootstrap/Carousel'
import {
  listProductDetails,
  createProductReview,
} from '../actions/productActions'
import { sendEmail } from '../actions/userActions'
import { PRODUCT_REVIEW_RESET } from '../types/productConstants'

const ProductScreen = ({ match, history }) => {
  const [text, setText] = useState('')
  const [comment, setComment] = useState('')
  const [sendMail, setSendMail] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const dispatch = useDispatch()
  const emailReducer = useSelector((state) => state.emailReducer)
  const { loading: loadingEmail, error: errorEmail, data: dataEmail } = emailReducer
  const productReviewCreate = useSelector((state) => state.productReviewCreate)
  const { loading: loadingReview, error: errorReview, success: successReview } = productReviewCreate
  const userLogin = useSelector((state) => state.userLogin)
  const { userData } = userLogin
  const productDetails = useSelector((state) => state.productDetails)
  const { loading, error, product } = productDetails

  useEffect(() => {
    if (successReview) {
      setComment('')
      dispatch({ type: PRODUCT_REVIEW_RESET })
    }
    dispatch(listProductDetails(match.params.id))
  }, [match.params.id, dispatch, successReview])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(createProductReview(match.params.id, comment))
  }

  const emailSubmit = (e) => {
    e.preventDefault()
    setEmailSent(true)
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
    )
    setText('')
    setSendMail(false)
    setTimeout(() => setEmailSent(false), 10000)
  }

  return (
    <div className="py-4">
      <Row className="mb-4">
        <Col>
          <Link to="/" className="btn btn-outline-success rounded-pill">
            <i className="fas fa-arrow-left me-2"></i>Go Back
          </Link>
          {userData && userData._id === product.user && (
            <Link
              to={`/admin/product/${match.params.id}/edit`}
              className="btn btn-outline-primary rounded-pill ms-3"
            >
              <i className="fas fa-edit me-2"></i>Edit Product
            </Link>
          )}
        </Col>
      </Row>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Meta title={product.name} />
          <Row className="g-4">
            <Col md={6}>
              <Card className="shadow-sm border-0">
                <Carousel className="rounded product-carousel">
                  {product.images.map((image) => (
                    <Carousel.Item key={image._id}>
                      <Image
                        src={image?.image1}
                        alt={product.name}
                        className="rounded w-100"
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="shadow-sm h-100">
                <Card.Body>
                  <Card.Title className="mb-3">
                    <h2 className="fw-bold">{product.name}</h2>
                  </Card.Title>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <Row>
                        <Col className="text-muted">Product ID:</Col>
                        <Col>{product._id}</Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col className="text-muted">Posted On:</Col>
                        <Col>{product?.createdAt?.substring(0, 10)}</Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col className="text-muted">Expires On:</Col>
                        <Col>{product?.expiresOn?.substring(0, 10)}</Col>
                      </Row>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Email Form */}
          {sendMail && userData && (
            <Row className="mt-4">
              <Col md={8} className="mx-auto">
                <Card className="shadow-sm">
                  <Card.Header className="bg-primary text-white">
                    <h5 className="mb-0">
                      Contact {product?.seller?.sellername}
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <Form onSubmit={emailSubmit}>
                      <ListGroup variant="flush" className="mb-3">
                        <ListGroup.Item>
                          <Row>
                            <Col md={3}>Name:</Col>
                            <Col>{userData.name}</Col>
                          </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <Row>
                            <Col md={3}>Email:</Col>
                            <Col>{userData.email}</Col>
                          </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <Row>
                            <Col md={3}>Phone:</Col>
                            <Col>{userData?.contact?.phone_no}</Col>
                          </Row>
                        </ListGroup.Item>
                      </ListGroup>
                      <Form.Group className="mb-3">
                        <Form.Control
                          as="textarea"
                          rows={4}
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                          placeholder="Type your message here..."
                          required
                        />
                      </Form.Group>
                      <div className="d-flex justify-content-end gap-2">
                        <Button variant="outline-secondary" onClick={() => setSendMail(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" variant="primary">
                          Send Message
                        </Button>
                      </div>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {/* Seller Details */}
          <Row className="mt-4">
            <Col md={8} className="mx-auto">
              <Card className="shadow-sm">
                <Card.Header className="bg-light">
                  <h5 className="mb-0">Seller Information</h5>
                </Card.Header>
                <Card.Body>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <Row>
                        <Col md={3} className="text-muted">Name:</Col>
                        <Col>{product?.seller?.sellername}</Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col md={3} className="text-muted">Email:</Col>
                        <Col>
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => setSendMail(true)}
                          >
                            Contact Seller
                          </Button>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col md={3} className="text-muted">Address:</Col>
                        <Col>{product?.seller?.selleraddress}</Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col md={3} className="text-muted">Phone:</Col>
                        <Col>
                          {product?.seller?.phoneNo?.mobile}{' '}
                          {product?.seller?.phoneNo?.isVerified ? (
                            <Badge bg="success">Verified</Badge>
                          ) : (
                            <Badge bg="warning">Unverified</Badge>
                          )}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Pricing and Delivery */}
          <Row className="mt-4">
            <Col md={8} className="mx-auto">
              <Card className="shadow-sm">
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <h5 className="mb-3">Pricing</h5>
                      <ListGroup variant="flush">
                        <ListGroup.Item>
                          <Row>
                            <Col>Total Price:</Col>
                            <Col>Rs {product?.Cost?.price}</Col>
                          </Row>
                        </ListGroup.Item>
                        {product?.Cost?.negotiable && (
                          <ListGroup.Item>
                            <Row>
                              <Col>Negotiable:</Col>
                              <Col>Yes</Col>
                            </Row>
                          </ListGroup.Item>
                        )}
                      </ListGroup>
                    </Col>
                    <Col md={6}>
                      <h5 className="mb-3">Delivery</h5>
                      <ListGroup variant="flush">
                        <ListGroup.Item>
                          <Row>
                            <Col>Area:</Col>
                            <Col>{product?.shippingAddress?.address}</Col>
                          </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <Row>
                            <Col>Charge:</Col>
                            <Col>Rs {product?.shippingAddress?.shippingCharge}</Col>
                          </Row>
                        </ListGroup.Item>
                      </ListGroup>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Description */}
          <Row className="mt-4">
            <Col md={8} className="mx-auto">
              <Card className="shadow-sm">
                <Card.Header className="bg-light">
                  <h5 className="mb-0">Description</h5>
                </Card.Header>
                <Card.Body>
                  <p>{product.description}</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Reviews */}
          <Row className="mt-4">
            <Col md={8} className="mx-auto">
              <Card className="shadow-sm">
                <Card.Header className="bg-light">
                  <h5 className="mb-0">Buyer Reviews</h5>
                </Card.Header>
                <Card.Body>
                  {product.reviews.length === 0 && (
                    <Message variant="info">No reviews yet</Message>
                  )}
                  <ListGroup variant="flush">
                    {product.reviews.map((review) => (
                      <ListGroup.Item key={review._id}>
                        <div className="d-flex justify-content-between">
                          <strong>{review.name}</strong>
                          <small className="text-muted">
                            {review.createdAt.substring(0, 10)}
                          </small>
                        </div>
                        <p className="mt-2 mb-0">{review.comment}</p>
                      </ListGroup.Item>
                    ))}
                    <ListGroup.Item>
                      <h6>Write a Review</h6>
                      {userData ? (
                        <Form onSubmit={submitHandler}>
                          <Form.Group className="mb-3">
                            <Form.Control
                              as="textarea"
                              rows={3}
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              placeholder="Share your thoughts..."
                            />
                          </Form.Group>
                          <Button
                            type="submit"
                            variant="primary"
                            disabled={loadingReview}
                          >
                            {loadingReview ? 'Posting...' : 'Post Review'}
                          </Button>
                        </Form>
                      ) : (
                        <Message variant="info">
                          Please <Link to="/login">login</Link> to write a review
                        </Message>
                      )}
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  )
}

export default ProductScreen