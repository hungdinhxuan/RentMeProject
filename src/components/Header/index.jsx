import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import "./Header.scss";
import { NavLink } from "react-router-dom";

function Header() {
  return (
    <header>
      <Navbar expand="lg">
        <Container>
          <NavLink to="/" className="header__nav">
            <img
              alt="Logo Home"
              src="/player-dou-a.jpg"
              width="50"
              height="50"
              className="d-inline-block align-top"
            />{" "}
            <span>Rent Me</span>
          </NavLink>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#link">Link</Nav.Link>
            </Nav>
            <div className="justify-content-end">
              <button className="btn btn-success button__login">Log in</button>
              <button style={{marginLeft: "12px"}} className="btn btn-warning button__signup">Sign up</button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;
