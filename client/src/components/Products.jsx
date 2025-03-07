import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";

const Products = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const componentMounted = useRef(true);

  const dispatch = useDispatch();

  const addProduct = (product) => {
    dispatch(addCart(product));
  };

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      try {
        // Fetch both categories in parallel
        const [menResponse, womenResponse] = await Promise.all([
          fetch("https://fakestoreapi.com/products/category/men's%20clothing"),
          fetch("https://fakestoreapi.com/products/category/women's%20clothing")
        ]);

        // Parse responses
        const menData = await menResponse.json();
        const womenData = await womenResponse.json();

        // Combine results
        const combinedData = [...menData, ...womenData];

        if (componentMounted.current) {
          setData(combinedData);
          setFilter(combinedData);
          setLoading(false);
        }
      } catch (error) {
        if (componentMounted.current) {
          setLoading(false);
        }
        console.error("Error fetching products:", error);
      }
    };

    getProducts();

    return () => {
      // Clean up
      componentMounted.current = false;
    };
  }, []);

  const filterProduct = (category) => {
    setActiveCategory(category);
    
    if (category === "all") {
      setFilter(data);
      return;
    }
    
    const updatedList = data.filter((product) => product.category === category);
    setFilter(updatedList);
  };

  const Loading = () => {
    return (
      <div className="skeleton-grid">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="skeleton-card">
            <div className="skeleton-image">
              <Skeleton height="100%" />
            </div>
            <div className="skeleton-content">
              <Skeleton height={20} width="70%" style={{ marginBottom: "10px" }} />
              <Skeleton height={15} count={2} style={{ marginBottom: "15px" }} />
              <div className="skeleton-footer">
                <Skeleton height={24} width={80} />
                <div style={{ display: "flex", gap: "10px" }}>
                  <Skeleton height={38} width={90} />
                  <Skeleton height={38} width={38} borderRadius="50%" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const ShowProducts = () => {
    return (
      <>
        <div className="filter-section">
          <div className="filter-heading">
            <h3>Browse by category</h3>
            <div className="underline"></div>
          </div>
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${activeCategory === 'all' ? 'active' : ''}`} 
              onClick={() => filterProduct("all")}
            >
              All Products
            </button>
            <button 
              className={`filter-btn ${activeCategory === "men's clothing" ? 'active' : ''}`}  
              onClick={() => filterProduct("men's clothing")}
            >
              Men's Collection
            </button>
            <button 
              className={`filter-btn ${activeCategory === "women's clothing" ? 'active' : ''}`}  
              onClick={() => filterProduct("women's clothing")}
            >
              Women's Collection
            </button>
          </div>
        </div>

        <div className="products-count">
          <p>Showing {filter.length} products</p>
        </div>

        <div className="product-grid">
          {filter.map((product) => (
            <div className="product-card" key={product.id}>
              <div className="card-inner">
                <div className="product-image">
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="product-img"
                  />
                  <div className="card-overlay">
                    <div className="overlay-buttons">
                    <Link 
                        to={`/product/${product.id}`} 
                        className="overlay-btn view-btn"
                        onClick={() => {
                          // This ensures immediate scroll to top when clicking the link
                          window.scrollTo(0, 0);
                        }}
                      >
                        <i className="fas fa-eye"></i>
                        <span>Quick View</span>
                      </Link>
                      <button 
                        className="overlay-btn cart-btn"
                        onClick={() => addProduct(product)}
                      >
                        <i className="fas fa-shopping-cart"></i>
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="product-details">
                  <h3 className="product-title">{product.title.substring(0, 40)}{product.title.length > 40 ? '...' : ''}</h3>
                  <div className="product-category">
                    <span>{product.category}</span>
                  </div>
                  <div className="product-footer">
                    <div className="product-price">${product.price.toFixed(2)}</div>
                    <div className="product-rating">
                      <i className="fas fa-star"></i>
                      <span>{product.rating?.rate || '4.0'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <>
      <style>{`
        .products-container {
          padding: 5rem 0;
          background-color: #f8f9fa;
          min-height: 100vh;
        }
        
        .section-title {
          margin-bottom: 4rem;
          text-align: center;
          position: relative;
        }
        
        .section-title h2 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 1rem;
          letter-spacing: -0.5px;
        }
        
        .section-title p {
          max-width: 600px;
          margin: 0 auto;
          color: #64748b;
        }
        
        .filter-section {
          margin-bottom: 3rem;
        }
        
        .filter-heading {
          margin-bottom: 1.5rem;
          text-align: center;
        }
        
        .filter-heading h3 {
          font-size: 1.2rem;
          color: #64748b;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 0.5rem;
        }
        
        .underline {
          height: 3px;
          width: 50px;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          margin: 0 auto;
        }
        
        .filter-buttons {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        
        .filter-btn {
          padding: 0.8rem 1.8rem;
          background-color: white;
          color: #334155;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }
        
        .filter-btn:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transform: translateY(-2px);
        }
        
        .filter-btn.active {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          border-color: transparent;
        }
        
        .products-count {
          display: flex;
          justify-content: flex-start;
          margin-bottom: 2rem;
        }
        
        .products-count p {
          color: #64748b;
          font-size: 0.9rem;
          font-weight: 500;
        }
        
        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
        }
        
        .product-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        }
        
        .product-image {
          height: 280px;
          position: relative;
          background: #f8fafc;
          overflow: hidden;
        }
        
        .product-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 1.5rem;
          transition: transform 0.5s ease;
        }
        
        .product-card:hover .product-img {
          transform: scale(1.05);
        }
        
        .card-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
          padding: 1.5rem;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.3s ease;
        }
        
        .product-card:hover .card-overlay {
          opacity: 1;
          transform: translateY(0);
        }
        
        .overlay-buttons {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }
        
        .overlay-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.7rem 1.2rem;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s ease;
          border: none;
          cursor: pointer;
        }
        
        .view-btn {
          background-color: #fff;
          color: #0f172a;
        }
        
        .view-btn:hover {
          background-color: #f1f5f9;
          transform: translateY(-2px);
        }
        
        .cart-btn {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          border: none;
        }
        
        .cart-btn:hover {
          opacity: 0.9;
          transform: translateY(-2px);
        }
        
        .product-details {
          padding: 1.5rem;
        }
        
        .product-title {
          color: #0f172a;
          font-size: 1rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
          line-height: 1.4;
          height: 2.8rem;
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
        
        .product-category {
          margin-bottom: 1rem;
        }
        
        .product-category span {
          display: inline-block;
          padding: 0.3rem 0.8rem;
          background-color: #f1f5f9;
          color: #64748b;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .product-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .product-price {
          font-size: 1.2rem;
          font-weight: 700;
          color: #0f172a;
        }
        
        .product-rating {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          color: #64748b;
          font-size: 0.9rem;
        }
        
        .product-rating i {
          color: #f59e0b;
        }
        
        /* Skeleton styles */
        .skeleton-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
        }
        
        .skeleton-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }
        
        .skeleton-image {
          height: 280px;
          background: #f8fafc;
        }
        
        .skeleton-content {
          padding: 1.5rem;
        }
        
        .skeleton-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1.5rem;
        }
        
        /* Responsive adjustments */
        @media (max-width: 576px) {
          .filter-btn {
            padding: 0.6rem 1.2rem;
            font-size: 0.9rem;
          }
          
          .product-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 1.5rem;
          }
          
          .product-image {
            height: 220px;
          }
        }
      `}</style>

      <div className="products-container">
        <div className="container">
          <div className="section-title">
            <h2>Explore Our Collection</h2>
            <p>Discover our carefully curated selection of high-quality clothing designed for comfort and style.</p>
          </div>

          {loading ? <Loading /> : <ShowProducts />}
        </div>
      </div>
    </>
  );
};

export default Products;