import React, { useState, useEffect } from 'react'
import { 
  Form, 
  Button, 
  Row, 
  Col, 
  Table, 
  Card, 
  Container,
  InputGroup,
  Dropdown
} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { listProducts, deleteProduct } from '../actions/productActions'
import { LinkContainer } from 'react-router-bootstrap'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { updateUser, getUserDetails } from '../actions/userActions'
import { USER_UPDATE_RESET, USER_DETAILS_RESET } from '../types/userConstants'

const UserUpdateScreen = ({ history, match }) => {
  const userId = match.params.id
  let i = 1

  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [phone_no, setPhone_no] = useState('')
  const [message, setMessage] = useState(null)

  const dispatch = useDispatch()
  const userLogin = useSelector((state) => state.userLogin)
  const { userData } = userLogin
  const userUpdate = useSelector((state) => state.userUpdate)
  const { success, loading, error } = userUpdate
  const userDetails = useSelector((state) => state.userDetails)
  const { user, loading: loadingDetails } = userDetails
  const productList = useSelector((state) => state.productList)
  const { products, loading: loadinglist } = productList
  const productDelete = useSelector((state) => state.productDelete)
  const { success: successDelete } = productDelete

  useEffect(() => {
    dispatch(listProducts())
    if (!userData || success) {
      dispatch({ type: USER_UPDATE_RESET })
      dispatch({ type: USER_DETAILS_RESET })
      if (userData && userData.isAdmin) {
        history.push('/admin/userlist')
      } else {
        history.push('/')
      }
    } else {
      if (!user?.name) {
        dispatch(getUserDetails(userId))
      } else {
        setName(user.name)
        setAddress(user.address)
        setPhone_no(user?.contact?.phone_no)
        setEmail(user.email)
      }
    }
  }, [history, userData, user, success, dispatch, userId, successDelete])

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(id))
    }
  }

  const submitHandler = (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
      setTimeout(() => setMessage(null), 3000)
    } else {
      dispatch(updateUser({
        _id: userId,
        name,
        email,
        password,
        address,
        phone_no,
      }))
    }
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm border-0 mb-4">
            <Card.Header className="bg-primary text-white py-3">
              <h3 className="mb-0">Update Profile</h3>
            </Card.Header>
            <Card.Body className="p-4">
              {loadingDetails && <Loader />}
              {message && <Message variant='danger'>{message}</Message>}
              {error && <Message variant='danger'>{error}</Message>}
              {success && <Message variant='success'>Profile updated successfully</Message>}

              <Form onSubmit={submitHandler}>
                <Form.Group className="mb-3" controlId='name'>
                  <Form.Label>Name</Form.Label>
                  <InputGroup>
                    <InputGroup.Text><i className="fas fa-user"></i></InputGroup.Text>
                    <Form.Control
                      type='text'
                      placeholder='Enter Name'
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3" controlId='email'>
                  <Form.Label>Email Address</Form.Label>
                  <InputGroup>
                    <InputGroup.Text><i className="fas fa-envelope"></i></InputGroup.Text>
                    <Form.Control
                      type='email'
                      placeholder='Enter Email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </InputGroup>
                  <Form.Text className="text-muted">
                    Enter a valid email address
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId='address'>
                  <Form.Label>Address</Form.Label>
                  <InputGroup>
                    <InputGroup.Text><i className="fas fa-map-marker-alt"></i></InputGroup.Text>
                    <Form.Control
                      type='text'
                      placeholder='Enter Address'
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3" controlId='phone_no'>
                  <Form.Label>Mobile Number</Form.Label>
                  <InputGroup>
                    <InputGroup.Text><i className="fas fa-phone"></i></InputGroup.Text>
                    <Form.Control
                      type='tel'
                      placeholder='Enter Mobile No'
                      value={phone_no}
                      onChange={(e) => setPhone_no(e.target.value)}
                    />
                  </InputGroup>
                  <Form.Text className="text-muted">
                    Enter a 10-digit number starting with 9
                  </Form.Text>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId='password'>
                      <Form.Label>Password</Form.Label>
                      <InputGroup>
                        <InputGroup.Text><i className="fas fa-lock"></i></InputGroup.Text>
                        <Form.Control
                          type='password'
                          placeholder='Enter password'
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId='confirmPassword'>
                      <Form.Label>Confirm Password</Form.Label>
                      <InputGroup>
                        <InputGroup.Text><i className="fas fa-lock"></i></InputGroup.Text>
                        <Form.Control
                          type='password'
                          placeholder='Confirm Password'
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>

                <Button 
                  type='submit' 
                  variant='primary' 
                  className="w-100 rounded-pill py-2 mt-3"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Updating...
                    </>
                  ) : (
                    'Update Profile'
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Card className="shadow-sm border-0">
            <Card.Header className="bg-light py-3">
              <h4 className="mb-0">My Uploads</h4>
            </Card.Header>
            <Card.Body className="p-4">
              {loadinglist ? (
                <Loader />
              ) : (
                <div className="table-responsive">
                  <Table hover className="align-middle">
                    <thead className="text-muted">
                      <tr>
                        <th>#</th>
                        <th>Product Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Negotiable</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userData && products && products.length !== 0 && products.map(
                        (product) => product && product.user === userData._id && (
                          <tr key={product._id}>
                            <td>{i++}</td>
                            <td>{product.name}</td>
                            <td>{product.category}</td>
                            <td>₹{product?.Cost.price}</td>
                            <td>
                              <span className={`badge ${product?.Cost.negotiable ? 'bg-success' : 'bg-danger'}`}>
                                {product?.Cost.negotiable ? 'Yes' : 'No'}
                              </span>
                            </td>
                            <td>
                              <Dropdown>
                                <Dropdown.Toggle 
                                  variant="light" 
                                  size="sm" 
                                  className="rounded-pill"
                                >
                                  <i className="fas fa-ellipsis-h"></i>
                                </Dropdown.Toggle>
                                <Dropdown.Menu align="end">
                                  <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                    <Dropdown.Item>
                                      <i className="fas fa-edit me-2"></i> Edit
                                    </Dropdown.Item>
                                  </LinkContainer>
                                  <Dropdown.Item 
                                    onClick={() => deleteHandler(product._id)}
                                    className="text-danger"
                                  >
                                    <i className="fas fa-trash me-2"></i> Delete
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default UserUpdateScreen