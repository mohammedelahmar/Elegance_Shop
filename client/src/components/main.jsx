import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <style>{`
        .hero-section {
          position: relative;
          height: 90vh;
          overflow: hidden;
        }
        
        .hero-image-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }
        
        .hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.8);
          transform: scale(1.05);
          animation: subtle-zoom 30s infinite alternate;
        }
        
        @keyframes subtle-zoom {
          0% { transform: scale(1.05); }
          100% { transform: scale(1.15); }
        }
        
        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.7) 0%, rgba(15, 23, 42, 0.4) 100%);
          z-index: 2;
        }
        
        .hero-content {
          position: relative;
          z-index: 3;
          height: 100%;
          display: flex;
          align-items: center;
          padding: 0 1rem;
        }
        
        .hero-content-inner {
          max-width: 700px;
        }
        
        .hero-tagline {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1.1rem;
          text-transform: uppercase;
          letter-spacing: 4px;
          font-weight: 500;
          margin-bottom: 1.5rem;
          opacity: 0;
          transform: translateY(20px);
          animation: fade-in 0.8s ease forwards 0.2s;
        }
        
        .hero-title {
          color: white;
          font-size: 3.5rem;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 1.5rem;
          opacity: 0;
          transform: translateY(20px);
          animation: fade-in 0.8s ease forwards 0.5s;
        }
        
        .hero-title span {
          position: relative;
          display: inline-block;
        }
        
        .hero-title span::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 10px;
          width: 100%;
          height: 8px;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          z-index: -1;
          opacity: 0.6;
        }
        
        .hero-description {
          color: rgba(255, 255, 255, 0.85);
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 2.5rem;
          opacity: 0;
          transform: translateY(20px);
          animation: fade-in 0.8s ease forwards 0.8s;
        }
        
        .hero-buttons {
          display: flex;
          gap: 1rem;
          opacity: 0;
          transform: translateY(20px);
          animation: fade-in 0.8s ease forwards 1.1s;
        }
        
        @keyframes fade-in {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .btn-shop {
          padding: 1rem 2.5rem;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          color: white;
          font-weight: 600;
          border-radius: 8px;
          text-decoration: none;
          transition: all 0.3s ease;
          border: none;
          text-transform: uppercase;
          letter-spacing: 1px;
          box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3);
        }
        
        .btn-shop:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 25px rgba(59, 130, 246, 0.4);
        }
        
        .btn-learn {
          padding: 1rem 2.5rem;
          background: transparent;
          color: white;
          font-weight: 600;
          border-radius: 8px;
          text-decoration: none;
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.3);
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .btn-learn:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-3px);
        }
        
        /* Responsive */
        @media (max-width: 992px) {
          .hero-title {
            font-size: 3rem;
          }
        }
        
        @media (max-width: 768px) {
          .hero-section {
            height: 80vh;
          }
          
          .hero-title {
            font-size: 2.5rem;
          }
          
          .hero-buttons {
            flex-direction: column;
          }
        }
        
        @media (max-width: 576px) {
          .hero-title {
            font-size: 2rem;
          }
          
          .hero-tagline {
            font-size: 0.9rem;
            letter-spacing: 2px;
          }
        }
      `}</style>

      <section className="hero-section">
        <div className="hero-image-container">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1950&q=80" 
            alt="Fashion Collection" 
            className="hero-image"
          />
        </div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="container">
            <div className="hero-content-inner">
              <div className="hero-tagline">Spring Summer 2025</div>
              <h1 className="hero-title">Discover Your <span>Signature</span> Style</h1>
              <p className="hero-description">
                Explore our exclusive collection of premium fashion pieces designed for the modern individual. 
                Elevate your wardrobe with timeless elegance and contemporary design.
              </p>
              <div className="hero-buttons">
                <Link to="/product" className="btn-shop">
                  Shop Collection
                </Link>
                <Link to="/about" className="btn-learn">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;