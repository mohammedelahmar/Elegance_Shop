import React from 'react';
import { Footer, Navbar } from "../components";

const AboutPage = () => {
  return (
    <>
      <Navbar />
      
      {/* Hero Banner */}
      <div className="about-hero">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="about-hero-content">
                <h1 className="about-heading">Our Story</h1>
                <div className="heading-underline"></div>
                <p className="about-lead">
                  Founded in 2020, ShopIt WearIt began with a simple mission: to provide high-quality, 
                  stylish clothing that empowers individuals to express their unique identity.
                </p>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="about-image-container">
                <img 
                  src="https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                  alt="Our Store" 
                  className="about-image" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="about-content">
        <div className="container">
          {/* Our Philosophy */}
          <div className="about-section">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <div className="about-image-container">
                  <img 
                    src="https://images.unsplash.com/photo-1543322748-33df6d3db806?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80" 
                    alt="Our Philosophy" 
                    className="about-image" 
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="about-text-content">
                  <h2 className="section-heading">Our Philosophy</h2>
                  <div className="heading-underline"></div>
                  <p>
                    At ShopIt WearIt, we believe that fashion is more than just clothing—it's a form of self-expression, 
                    confidence, and personal identity. We curate collections that combine timeless elegance with 
                    contemporary trends, ensuring our customers always find pieces that resonate with their unique style.
                  </p>
                  <p>
                    Our dedication to quality materials, ethical production, and customer satisfaction drives 
                    everything we do. We partner with responsible manufacturers who share our values of 
                    sustainability and fair labor practices.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="values-section">
            <h2 className="section-heading text-center">Our Core Values</h2>
            <div className="heading-underline mx-auto"></div>
            
            <div className="row values-row">
              <div className="col-md-4">
                <div className="value-card">
                  <div className="value-icon">
                    <i className="fas fa-leaf"></i>
                  </div>
                  <h3>Sustainability</h3>
                  <p>We're committed to reducing our environmental footprint through responsible sourcing and production methods.</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="value-card">
                  <div className="value-icon">
                    <i className="fas fa-heart"></i>
                  </div>
                  <h3>Quality</h3>
                  <p>We never compromise on quality, ensuring every item meets our high standards for materials and craftsmanship.</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="value-card">
                  <div className="value-icon">
                    <i className="fas fa-users"></i>
                  </div>
                  <h3>Community</h3>
                  <p>We celebrate diversity and create an inclusive community where everyone can express their authentic style.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="about-section">
            <h2 className="section-heading text-center">Our Collections</h2>
            <div className="heading-underline mx-auto"></div>
            <p className="text-center collection-description">
              Discover our diverse range of products designed for the modern lifestyle.
            </p>
            
            <div className="row product-categories">
              <div className="col-md-6 col-lg-4">
                <div className="category-card">
                  <div className="category-image">
                    <img src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80" alt="Men's Collection" />
                  </div>
                  <div className="category-overlay"></div>
                  <div className="category-content">
                    <h3>Men's Collection</h3>
                    <p>Modern essentials for every gentleman</p>
                  </div>
                </div>
              </div>
              
              <div className="col-md-6 col-lg-4">
                <div className="category-card">
                  <div className="category-image">
                    <img src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" alt="Women's Collection" />
                  </div>
                  <div className="category-overlay"></div>
                  <div className="category-content">
                    <h3>Women's Collection</h3>
                    <p>Effortless style for the modern woman</p>
                  </div>
                </div>
              </div>
              
              <div className="col-md-6 col-lg-4">
                <div className="category-card">
                  <div className="category-image">
                    <img src="https://images.unsplash.com/photo-1555529771-122e5d9f2341?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1073&q=80" alt="Activewear" />
                  </div>
                  <div className="category-overlay"></div>
                  <div className="category-content">
                    <h3>Activewear</h3>
                    <p>Style meets performance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="team-section">
            <h2 className="section-heading text-center">Meet Our Team</h2>
            <div className="heading-underline mx-auto"></div>
            <p className="text-center team-description">
              The passionate individuals behind our brand.
            </p>
            
            <div className="row team-row">

            <div className="col-md-4">
                <div className="team-member">
                  <div className="team-member-icon">
                    <i className="fas fa-paint-brush"></i>
                  </div>
                  <h4>Boudir Mohammed Mehdi</h4>
                  <p className="member-role">Front-End Designer</p>
                  <div className="member-social">
                    <a href="https://github.com/mohammedmehdio" target="_blank" rel="noreferrer">
                      <i className="fab fa-github"></i>
                    </a>
                    <a href="https://www.linkedin.com/in/mehdlin/" target="_blank" rel="noreferrer">
                      <i className="fab fa-linkedin"></i>
                    </a>
                    <a href="https://www.facebook.com/medmehdi.boudir/" target="_blank" rel="noreferrer">
                      <i className="fab fa-facebook"></i>
                    </a>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="team-member">
                  <div className="team-member-icon">
                    <i className="fas fa-user"></i>
                  </div>
                  <h4>Al Ahmar Mohammed</h4>
                  <p className="member-role">Backend Developper</p>
                  <div className="member-social">
                    <a href="https://github.com/ahmedmehdi" target="_blank" rel="noreferrer">
                      <i className="fab fa-github"></i>
                    </a>
                    <a href="https://linkedin.com/in/ahmedmehdi" target="_blank" rel="noreferrer">
                      <i className="fab fa-linkedin"></i>
                    </a>
                    <a href="https://facebook.com/ahmedmehdi" target="_blank" rel="noreferrer">
                      <i className="fab fa-facebook"></i>
                    </a>
                  </div>
                </div>
              </div>

               <div className="col-md-4">
                <div className="team-member">
                  <div className="team-member-icon">
                    <i className="fas fa-user-edit"></i>
                  </div>
                  <h4>Amiri Yasser</h4>
                  <p className="member-role">Rapport Maker</p>
                  <div className="member-social">
                    <a href="https://github.com/sarahlahmar" target="_blank" rel="noreferrer">
                      <i className="fab fa-github"></i>
                    </a>
                    <a href="https://linkedin.com/in/sarahlahmar" target="_blank" rel="noreferrer">
                      <i className="fab fa-linkedin"></i>
                    </a>
                    <a href="https://facebook.com/sarahlahmar" target="_blank" rel="noreferrer">
                      <i className="fab fa-facebook"></i>
                    </a>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        /* Hero Section */
        .about-hero {
          background-color: #f8fafc;
          padding: 5rem 0;
          position: relative;
          overflow: hidden;
        }

        .about-heading {
          font-size: 3rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 1rem;
          position: relative;
        }

        .heading-underline {
          width: 80px;
          height: 4px;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          margin-bottom: 2rem;
        }

        
        .about-lead {
          font-size: 1.2rem;
          line-height: 1.8;
          color: #64748b;
          margin-bottom: 2rem;
        }

        .about-image-container {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          height: 400px;
        }

        .about-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .about-image:hover {
          transform: scale(1.05);
        }

        /* Content Section */
        .about-content {
          padding: 5rem 0;
        }

        .about-section {
          margin-bottom: 6rem;
        }

        .section-heading {
          font-size: 2.2rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 1rem;
          position: relative;
        }

        .about-text-content p {
          font-size: 1.1rem;
          line-height: 1.8;
          color: #475569;
          margin-bottom: 1.5rem;
        }

        /* Values */
        .values-section {
          margin-bottom: 6rem;
        }

        .values-row {
          margin-top: 3rem;
        }

        .value-card {
          background: white;
          border-radius: 12px;
          padding: 2.5rem 1.5rem;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          height: 100%;
        }

        .value-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
        }

        .value-icon {
          font-size: 2.5rem;
          margin-bottom: 1.5rem;
          display: inline-block;
          width: 80px;
          height: 80px;
          line-height: 80px;
          text-align: center;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
        }

        .value-card h3 {
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #0f172a;
        }

        .value-card p {
          color: #64748b;
          font-size: 1rem;
          line-height: 1.6;
        }

        /* Products Section */
        .collection-description {
          max-width: 600px;
          margin: 0 auto 3rem;
          font-size: 1.1rem;
          color: #64748b;
        }

        .product-categories {
          margin-top: 3rem;
        }

        .category-card {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 1.5rem;
          height: 320px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .category-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
        }

        .category-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .category-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .category-card:hover .category-image img {
          transform: scale(1.1);
        }

        .category-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to top, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.3));
          z-index: 2;
        }

        .category-content {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          padding: 1.5rem;
          z-index: 3;
          color: white;
        }

        .category-content h3 {
          font-size: 1.4rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .category-content p {
          font-size: 0.95rem;
          opacity: 0.9;
        }

        /* Team Section */
        .team-section {
          margin-bottom: 3rem;
        }

        .team-description {
          max-width: 600px;
          margin: 0 auto 3rem;
          font-size: 1.1rem;
          color: #64748b;
        }

        .team-row {
          margin-top: 3rem;
        }

        .team-member {
          text-align: center;
          margin-bottom: 3rem;
          padding: 2rem;
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .team-member:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
        }

        .team-member-icon {
          font-size: 2.5rem;
          margin-bottom: 1.5rem;
          display: inline-block;
          width: 90px;
          height: 90px;
          line-height: 90px;
          text-align: center;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
        }

        .team-member h4 {
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 0.3rem;
          color: #0f172a;
        }

        .member-role {
          color: #64748b;
          font-size: 0.95rem;
          margin-bottom: 1.5rem;
        }

        .member-social {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }

        .member-social a {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #f1f5f9;
          color: #64748b;
          font-size: 1.2rem;
          transition: all 0.3s ease;
        }

        .member-social a:hover {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          transform: translateY(-3px);
        }

        /* Responsive */
        @media (max-width: 992px) {
          .about-hero {
            padding: 4rem 0;
          }
          
          .about-heading {
            font-size: 2.5rem;
          }
          
          .about-image-container {
            margin-top: 3rem;
            height: 350px;
          }
        }

        @media (max-width: 768px) {
          .about-heading {
            font-size: 2rem;
          }
          
          .section-heading {
            font-size: 1.8rem;
          }
          
          .about-hero {
            padding: 3rem 0;
          }
          
          .about-content {
            padding: 3rem 0;
          }
          
          .about-section {
            margin-bottom: 4rem;
          }
          
          .values-section, .team-section {
            margin-bottom: 4rem;
          }
          
          .about-image-container {
            height: 300px;
          }
        }
      `}</style>
      
      <Footer />
    </>
  );
};

export default AboutPage;