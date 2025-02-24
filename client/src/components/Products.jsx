import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { Link } from "react-router-dom";

const Products = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState(data);
  const [loading, setLoading] = useState(false);
  const componentMounted = useRef(true); // Refactor to useRef

  const dispatch = useDispatch();

  const addProduct = (product) => {
    dispatch(addCart(product));
  };

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      try {
        // Fetch both categories in parallel
        const [womenResponse, menResponse] = await Promise.all([
          fetch("https://fakestoreapi.com/products/category/men's%20clothing"),
          fetch("https://fakestoreapi.com/products/category/women's%20clothing")
        ]);

        // Parse both responses
        const womenData = await womenResponse.json();
        const menData = await menResponse.json();

        // Combine the results
        const combinedData = [...womenData, ...menData];

        if (componentMounted.current) {
          setData(combinedData);
          setFilter(combinedData);
          setLoading(false);
        }
      } catch (error) {
        if (componentMounted.current) {
          setLoading(false);
        }
        // Handle error appropriately
        console.error("Error fetching products:", error);
      }
    };

    getProducts();
  }, []);

  const filterProduct = (category) => {
    const updatedList = data.filter((product) => product.category === category);
    setFilter(updatedList);
  };

  const Loading = () => {
    return (
      <div className="skeleton-grid">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="skeleton-card">
            <Skeleton className="skeleton-image" />
            <div className="skeleton-content">
              <Skeleton count={3} />
              <div className="skeleton-footer">
                <Skeleton width={70} />
                <Skeleton width={100} height={35} />
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
        <div className="filter-container">
          <button className="filter-btn" onClick={() => setFilter(data)}>
            All
          </button>
          <button className="filter-btn" onClick={() => filterProduct("men's clothing")}>
            Men's
          </button>
          <button className="filter-btn" onClick={() => filterProduct("women's clothing")}>
            Women's
          </button>
        </div>

        <div className="product-grid">
          {filter.map((product) => (
            <div className="product-card" key={product.id}>
              <div className="card-inner">
                <div className="product-image">
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="hover-zoom"
                  />
                  <div className="card-overlay">
                    <Link to={`/product/${product.id}`} className="preview-btn">
                      <i className="fas fa-expand"></i>
                    </Link>
                  </div>
                </div>
                <div className="product-details">
                  <h3 className="product-title">{product.title.substring(0, 40)}</h3>
                  <p className="product-description">{product.description.substring(0, 90)}...</p>
                  <div className="product-footer">
                    <span className="product-price">${product.price}</span>
                    <div className="product-actions">
                      <Link to={`/product/${product.id}`} className="buy-btn">
                        BUY NOW
                      </Link>
                      <button 
                        className="cart-btn"
                        onClick={() => addProduct(product)}
                        id={`add-${product.id}`}
                      >
                        <i className="fas fa-cart-plus"></i>
                      </button>
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
        .container.my-3.py-3 {
          padding: 0 !important;
          min-height: 100vh;
          background: linear-gradient(145deg, #2c3e50, #3498db);
          width: 100vw;
          margin-left: calc(-50vw + 50%);
          margin-right: calc(-50vw + 50%);
          max-width: 100vw;
        }

        h2.display-5 {
          color: #fff;
          font-size: 2.5rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          padding-top: 3rem;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .filter-container {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          padding: 2rem 0;
          background: rgba(255,255,255,0.1);
          margin: 2rem 0;
        }

        .filter-btn {
          padding: 0.8rem 2rem;
          border: none;
          background: linear-gradient(145deg, #3498db, #2c3e50);
          color: white;
          border-radius: 30px;
          cursor: pointer;
          transition: all 0.3s;
          text-transform: uppercase;
          font-weight: bold;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .filter-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.3);
          background: linear-gradient(145deg, #2c3e50, #3498db);
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          padding: 0 2rem;
          width: 100%;
          max-width: 100vw;
        }

        .product-card {
          background: rgba(255,255,255,0.95);
          border-radius: 15px;
          overflow: hidden;
          transition: all 0.3s;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.2);
        }

        .product-image {
          height: 300px;
          background: #f8f9fa;
          position: relative;
          overflow: hidden;
        }

        .hover-zoom {
          width: 100%;
          height: 100%;
          object-fit: contain;
          transition: transform 0.3s;
        }

        .product-card:hover .hover-zoom {
          transform: scale(1.05);
        }

        .card-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(44, 62, 80, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .product-card:hover .card-overlay {
          opacity: 1;
        }

        .preview-btn {
          color: white;
          font-size: 2rem;
          transition: transform 0.3s;
        }

        .preview-btn:hover {
          transform: scale(1.2);
          color: #3498db;
        }

        .product-details {
          padding: 1.5rem;
          color: #2c3e50;
        }

        .product-title {
          font-size: 1.2rem;
          margin-bottom: 1rem;
          font-weight: 600;
        }

        .product-description {
          font-size: 0.9rem;
          color: #6c757d;
          margin-bottom: 1.5rem;
          line-height: 1.5;
        }

        .product-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .product-price {
          font-size: 1.5rem;
          color: #e74c3c;
          font-weight: bold;
        }

        .product-actions {
          display: flex;
          gap: 1rem;
        }

        .buy-btn {
          padding: 0.8rem 1.5rem;
          background: #2c3e50;
          color: white;
          border-radius: 30px;
          text-decoration: none;
          transition: all 0.3s;
          font-weight: 500;
        }

        .buy-btn:hover {
          background: #3498db;
          transform: translateY(-2px);
        }

        .cart-btn {
          width: 45px;
          height: 45px;
          border: none;
          background: #3498db;
          color: white;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cart-btn:hover {
          background: #2c3e50;
          transform: scale(1.1);
        }

        .skeleton-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          padding: 0 2rem;
        }

        .skeleton-card {
          background: rgba(255,255,255,0.9);
          border-radius: 15px;
          overflow: hidden;
          height: 400px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .skeleton-image {
          height: 250px;
          background: #dee2e6;
        }

        .react-loading-skeleton {
          background-color: #dee2e6;
          background-image: linear-gradient(
            90deg,
            #dee2e6,
            #e9ecef,
            #dee2e6
          );
        }
      `}</style>

      <div className="container my-3 py-3">
        <div className="row">
          <div className="col-12">
            <h2 className="display-5 text-center">Our Collection</h2>
          </div>
        </div>
        <div className="row justify-content-center mx-0">
          {loading ? <Loading /> : <ShowProducts />}
        </div>
      </div>
    </>
  );
};

export default Products;