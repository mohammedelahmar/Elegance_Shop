import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './Header'; 
import Footer from './Footer';
import './Layout.css';

const Layout = () => {
  return (
    <>
      <Header />
      <main className="main-content">
        <Container>
          <Outlet />
        </Container>
      </main>
      <Footer />
    </>
  );
};

export default Layout;