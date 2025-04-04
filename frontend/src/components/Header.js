import React from 'react'
import { Route } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { logout } from '../actions/userActions'
import { useDispatch, useSelector } from 'react-redux'
import SearchBox from './SearchBox'
import { Navbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap'

const Header = () => {
  const dispatch = useDispatch()
  const userLogin = useSelector((state) => state.userLogin)
  const { userData } = userLogin

  const logoutHandler = () => {
    dispatch(logout())
  }

  return (
    <header>
      <Navbar 
        bg='dark' 
        variant='dark' 
        expand='lg' 
        collapseOnSelect 
        className="shadow-sm py-3 px-4"
        sticky="top"
      >
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand className="fw-bold d-flex align-items-center">
              <i className="fas fa-shopping-bag me-3"></i>
              <span className="ms-2">SecondHandSell</span>
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />

          <Navbar.Collapse id='basic-navbar-nav' className="justify-content-between">
            <Route render={({ history }) => <SearchBox history={history} />} />
            
            <Nav className='align-items-center ms-auto'>
              {userData ? (
                <NavDropdown
                  title={
                    <span>
                      <i className="fas fa-user-circle me-2"></i>
                      {userData.name}
                      {userData.isAdmin && (
                        <Badge bg="success" className="ms-2">Admin</Badge>
                      )}
                    </span>
                  }
                  id='username'
                  className="dropdown-custom"
                >
                  <LinkContainer to={`/admin/users/${userData._id}/edit`}>
                    <NavDropdown.Item>
                      <i className="fas fa-user-edit me-2"></i>Profile
                    </NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    <i className="fas fa-sign-out-alt me-2"></i>Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to='/login'>
                  <Nav.Link className="nav-link-custom">
                    <i className='fas fa-user me-2'></i>Sign In
                  </Nav.Link>
                </LinkContainer>
              )}

              {userData && userData.isAdmin && (
                <NavDropdown 
                  title={
                    <span>
                      <i className="fas fa-cog me-2"></i>Admin
                    </span>
                  } 
                  id='adminmenu'
                  className="dropdown-custom"
                >
                  <LinkContainer to='/admin/userlist'>
                    <NavDropdown.Item>
                      <i className="fas fa-users me-2"></i>Users
                    </NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/productlist'>
                    <NavDropdown.Item>
                      <i className="fas fa-box-open me-2"></i>Products
                    </NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
              
              <LinkContainer to='/about'>
                <Nav.Link className="nav-link-custom ms-4">
                  <i className="fas fa-info-circle me-2"></i>About Us
                </Nav.Link>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header