import React, { useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "./Header.scss";

function Header() {
  const [header, setHeader] = useState(false);

  // if (window.pageYOffset) {
  //   setHeader(true);
  // }

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
            <span style={{ color: "orange" }}>Rent Me</span>
          </NavLink>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/streamhub">
                <NavLink to="/streamhub" className="nav__item">
                  StreamHub
                </NavLink>
              </Nav.Link>
              <Nav.Link>
                <NavLink to="/news" className="nav__item">
                  News
                </NavLink>
              </Nav.Link>
              <Nav.Link>
                <NavLink to="/playerdou" className="nav__item">
                  Thuê người chơi
                </NavLink>
              </Nav.Link>
              <Nav.Link>
                <NavLink to="/bxh" className="nav__item">
                  BXH
                </NavLink>
              </Nav.Link>
            </Nav>
            <div className="justify-content-end">
              <button className="button__login">Log in</button>
              <button
                style={{ marginLeft: "12px" }}
                className="button__signup"
              >
                Sign up
              </button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;
