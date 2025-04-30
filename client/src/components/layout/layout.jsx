import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './Header';
import Footer from './Footer';
import Modal from '../UI/Modal'; // Import for potential global modal usage

const Layout = () => {
  // Example state for a global notification modal
  // const [showNotification, setShowNotification] = useState(false);
  // const [notification, setNotification] = useState({ title: '', message: '' });

  return (
    <>
      <Header />
      <main className="py-3">
        <Container>
          <Outlet />
        </Container>
      </main>
      <Footer />
      
      {/* Example of how you might use the Modal component for global notifications
      <Modal
        show={showNotification}
        onHide={() => setShowNotification(false)}
        title={notification.title}
        showFooter={false}
      >
        {notification.message}
      </Modal> 
      */}
    </>
  );
};

export default Layout;