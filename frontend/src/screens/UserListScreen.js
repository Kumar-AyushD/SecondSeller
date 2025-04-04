import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { 
  Table, 
  Button, 
  Card, 
  Container, 
  Row, 
  Col,
  Dropdown,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listUsers, deleteUser } from '../actions/userActions'

const UserListScreen = ({ history }) => {
  const dispatch = useDispatch()
  const usersList = useSelector((state) => state.usersList)
  const { users, loading, error } = usersList
  const userLogin = useSelector((state) => state.userLogin)
  const { userData } = userLogin
  const userDelete = useSelector((state) => state.userDelete)
  const {
    success: successDelete,
    loading: loadingDelete,
    error: errorDelete,
  } = userDelete

  let i = 1

  useEffect(() => {
    if (userData && userData.isAdmin) {
      dispatch(listUsers())
    } else {
      history.push('/login')
    }
  }, [dispatch, history, successDelete, userData])

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(id))
    }
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4">
              <Row className="align-items-center">
                <Col md={6}>
                  <h2 className="mb-0 fw-bold">User Management</h2>
                  <small className="text-muted">
                    Total Users: {users?.length || 0}
                  </small>
                </Col>
                <Col md={6} className="text-end">
                  <Button 
                    variant="primary" 
                    size="sm" 
                    className="rounded-pill px-3"
                  >
                    <i className="fas fa-plus me-2"></i>
                    Add New User
                  </Button>
                </Col>
              </Row>

              {loadingDelete && <Loader />}
              {errorDelete && <Message variant='danger'>{errorDelete}</Message>}

              {loading ? (
                <Loader />
              ) : error ? (
                <Message variant='danger'>{error}</Message>
              ) : (
                <div className="table-responsive mt-4">
                  <div>Products</div>
                  <Table hover className="table-align-middle">
                    <thead className="text-muted">
                      <tr>
                        <th>#</th>
                        <th>User Info</th>
                        <th>Contact</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user._id} className="align-middle">
                          <td>{i++}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div>
                                <strong>{user.name}</strong>
                                <br />
                                <small className="text-muted">
                                  ID: {user._id.substring(0, 8)}...
                                </small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div>
                              <a href={`mailto:${user.email}`} className="text-decoration-none">
                                {user.email}
                              </a>
                              <br />
                              <small>{user.contact.phone_no}</small>
                            </div>
                            <small>{user.address}</small>
                          </td>
                          <td>
                            <span 
                              className={`badge rounded-pill ${
                                user.isAdmin ? 'bg-success' : 'bg-secondary'
                              }`}
                            >
                              {user.isAdmin ? 'Admin' : 'User'}
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
                                <LinkContainer to={`/admin/users/${user._id}/edit`}>
                                  <Dropdown.Item>
                                    <i className="fas fa-edit me-2"></i> Edit
                                  </Dropdown.Item>
                                </LinkContainer>
                                <Dropdown.Item 
                                  onClick={() => deleteHandler(user._id)}
                                  className="text-danger"
                                >
                                  <i className="fas fa-trash me-2"></i> Delete
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </td>
                        </tr>
                      ))}
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

export default UserListScreen