import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link, useParams } from "react-router-dom";
import Marquee from "react-fast-marquee";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";
import { Footer, Navbar } from "../components";
import { getProductById, getProducts } from "../services/api";

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");

  const dispatch = useDispatch();

  const addProduct = (product) => {
    dispatch(addCart({ ...product, quantity: quantity, size: selectedSize }));
  };

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  useEffect(() => {
    const getProduct = async () => {
      setLoading(true);
      setLoading2(true);  
      try {
        // Fetch single product from local API
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        const data = await response.json();
        setProduct(data);
        setLoading(false);

        // Fetch all products for similar items and filter by category (excluding current product)
        const response2 = await fetch("http://localhost:5000/api/products");
        const data2 = await response2.json();
        setSimilarProducts(
          data2.filter((p) => p.category === data.category && p._id !== data._id)
        );
        setLoading2(false);
      } catch (error) {
        console.error("Error fetching product data:", error);
        setLoading(false);
        setLoading2(false);
      }
    };
    getProduct();
    setQuantity(1);
  }, [id]);

  const Loading = () => {
    return (
      <div className="product-detail-skeleton">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-12">
              <div className="product-image-skeleton">
                <Skeleton height="100%" />
              </div>
            </div>
            <div className="col-lg-6 col-md-12">
              <div className="product-info-skeleton">
                <Skeleton width={120} height={24} />
                <Skeleton
                  width={300}
                  height={40}
                  style={{ marginTop: "20px" }}
                />
                <Skeleton
                  width={100}
                  height={24}
                  style={{ marginTop: "15px" }}
                />
                <Skeleton
                  width={120}
                  height={36}
                  style={{ marginTop: "20px" }}
                />
                <Skeleton count={3} style={{ marginTop: "20px" }} />
                <div className="button-skeleton" style={{ marginTop: "30px" }}>
                  <Skeleton width={150} height={48} />
                  <Skeleton
                    width={150}
                    height={48}
                    style={{ marginLeft: "15px" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SimilarProductSkeleton = () => {
    return (
      <div className="similar-products-skeleton">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="similar-product-skeleton">
            <Skeleton height={200} width="100%" />
            <Skeleton
              height={20}
              width="80%"
              style={{ marginTop: "10px" }}
            />
            <Skeleton
              height={20}
              width="50%"
              style={{ marginTop: "10px" }}
            />
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <Skeleton height={36} width="48%" />
              <Skeleton height={36} width="48%" />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const ShowProduct = () => {
    return (
      <div className="product-detail-container">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-12">
              <div className="product-image-wrapper">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="product-image"
                />
              </div>
            </div>
            <div className="col-lg-6 col-md-12">
              <div className="product-info">
                <div className="product-category">{product.category}</div>
                <h1 className="product-title">{product.name}</h1>
                <div className="product-price">${product.price}</div>
                <div className="product-description">
                  <p>{product.description}</p>
                </div>

                {/* Size Selector */}
                <div className="product-size">
                  <span className="size-label">Size:</span>
                  <div className="size-options">
                    {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                      <button
                        key={size}
                        className={`size-option ${
                          selectedSize === size ? "selected" : ""
                        }`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="product-quantity">
                  <span className="quantity-label">Quantity:</span>
                  <div className="quantity-selector">
                    <button
                      className="quantity-btn minus"
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                    >
                      <i className="fas fa-minus"></i>
                    </button>
                    <span className="quantity-value">{quantity}</span>
                    <button
                      className="quantity-btn plus"
                      onClick={incrementQuantity}
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                  </div>
                </div>

                {/* Add to Cart Buttons */}
                <div className="product-actions">
                  <button
                    className="btn-add-cart"
                    onClick={() => addProduct(product)}
                  >
                    <i className="fas fa-shopping-cart"></i>
                    Add to Cart
                  </button>
                  <Link to="/cart" className="btn-view-cart">
                    <i className="fas fa-eye"></i>
                    View Cart
                  </Link>
                </div>

                {/* Product Meta */}
                <div className="product-meta">
                  <div className="meta-item">
                    <i className="fas fa-shield-alt"></i>
                    <span>Secure payment</span>
                  </div>
                  <div className="meta-item">
                    <i className="fas fa-truck"></i>
                    <span>Fast delivery</span>
                  </div>
                  <div className="meta-item">
                    <i className="fas fa-exchange-alt"></i>
                    <span>Easy returns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ShowSimilarProducts = () => {
    return (
      <div className="similar-products">
        {similarProducts.map((item) => (
          <div key={item._id} className="similar-product-card">
            <Link to={`/product/${item._id}`} className="product-image-link">
              <img
                src={item.image_url}
                alt={item.name}
                className="similar-product-image"
              />
            </Link>
            <div className="similar-product-info">
              <h3 className="similar-product-title">
                {item.name.length > 18
                  ? `${item.name.substring(0, 18)}...`
                  : item.name}
              </h3>
              <div className="similar-product-price">${item.price}</div>
              <div className="similar-product-actions">
                <Link to={`/product/${item._id}`} className="similar-view-btn">
                  Details
                </Link>
                <button
                  className="similar-cart-btn"
                  onClick={() => addProduct(item)}
                >
                  <i className="fas fa-cart-plus"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await getProductById(id);
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
      }
    };
    
    const fetchSimilarProducts = async () => {
      setLoading2(true);
      try {
        // Get products in the same category if the product has loaded
        if (product && product.category) {
          const data = await getProducts({ category: product.category });
          // Filter out the current product and limit to 8 similar products
          const filtered = data.filter(p => p._id !== id).slice(0, 8);
          setSimilarProducts(filtered);
        } else {
          // If no category yet, just get some products
          const data = await getProducts({ limit: 8 });
          setSimilarProducts(data);
        }
        setLoading2(false);
      } catch (error) {
        console.error("Error fetching similar products:", error);
        setLoading2(false);
      }
    };

    fetchProduct();
    fetchSimilarProducts();
  }, [id, product?.category]);

  return (
    <>
      <Navbar />
      <style>{`
        /* Product Detail Styles */
        .product-detail-container {
          padding: 4rem 0;
        }
        .product-image-wrapper {
          background: #f8fafc;
          border-radius: 12px;
          padding: 2rem;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 450px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }
        .product-image {
          max-height: 100%;
          max-width: 100%;
          object-fit: contain;
          transition: transform 0.3s ease;
        }
        .product-image-wrapper:hover .product-image {
          transform: scale(1.05);
        }
        .product-info {
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 1rem 0 1rem 2rem;
        }
        .product-category {
          text-transform: uppercase;
          font-size: 0.85rem;
          font-weight: 500;
          color: #64748b;
          letter-spacing: 1.5px;
          margin-bottom: 0.5rem;
          background: #f1f5f9;
          display: inline-block;
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
        }
        .product-title {
          font-size: 2.2rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 1rem;
          line-height: 1.2;
        }
        .product-price {
          font-size: 1.8rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          position: relative;
        }
        .product-price:before {
          content: '';
          position: absolute;
          bottom: -0.8rem;
          left: 0;
          width: 60px;
          height: 3px;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
        }
        .product-description {
          margin-bottom: 1.5rem;
          color: #475569;
          font-size: 1rem;
          line-height: 1.7;
        }
        /* Size selector styles */
        .product-size {
          display: flex;
          flex-direction: column;
          margin-bottom: 1.5rem;
        }
        .size-label {
          font-size: 1rem;
          color: #475569;
          margin-bottom: 0.8rem;
        }
        .size-options {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .size-option {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: transparent;
          color: #64748b;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .size-option:hover {
          border-color: #94a3b8;
          color: #0f172a;
          transform: translateY(-2px);
        }
        .size-option.selected {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          border-color: transparent;
          box-shadow: 0 2px 10px rgba(59, 130, 246, 0.3);
        }
        .product-quantity {
          display: flex;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .quantity-label {
          font-size: 1rem;
          color: #475569;
          margin-right: 1rem;
        }
        .quantity-selector {
          display: flex;
          align-items: center;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
        }
        .quantity-btn {
          background: #f8fafc;
          border: none;
          height: 36px;
          width: 36px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
        }
        .quantity-btn:hover {
          background: #e2e8f0;
          color: #0f172a;
        }
        .quantity-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .quantity-value {
          width: 40px;
          text-align: center;
          font-size: 1rem;
          font-weight: 500;
          color: #0f172a;
        }
        .product-actions {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .btn-add-cart, .btn-view-cart {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.8rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          cursor: pointer;
          gap: 0.5rem;
        }
        .btn-add-cart {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          border: none;
          flex-grow: 1;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }
        .btn-add-cart:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
        }
        .btn-view-cart {
          background: transparent;
          color: #0f172a;
          border: 1px solid #e2e8f0;
        }
        .btn-view-cart:hover {
          background: #f8fafc;
          transform: translateY(-3px);
        }
        .product-meta {
          display: flex;
          justify-content: space-between;
          padding-top: 1.5rem;
          border-top: 1px solid #e2e8f0;
        }
        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #64748b;
          font-size: 0.85rem;
        }
        .meta-item i {
          color: #3b82f6;
        }
        /* Similar Products Styles */
        .similar-products-section {
          padding: 4rem 0;
          background-color: #f8fafc;
        }
        .section-title {
          margin-bottom: 2.5rem;
          position: relative;
          display: inline-block;
        }
        .section-title h2 {
          font-size: 1.8rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 0.5rem;
        }
        .section-title::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 0;
          width: 60px;
          height: 3px;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
        }
        .similar-products {
          display: flex;
          gap: 1.5rem;
        }
        .similar-product-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          min-width: 250px;
          max-width: 250px;
        }
        .similar-product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        .product-image-link {
          position: relative;
          display: block;
          height: 200px;
          background: #f8fafc;
        }
        .similar-product-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 1rem;
          transition: transform 0.3s ease;
        }
        .quick-view {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.7);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 500;
          opacity: 0;
          transition: all 0.3s ease;
          gap: 0.5rem;
          font-size: 0.9rem;
        }
        .quick-view i {
          font-size: 1.5rem;
        }
        .product-image-link:hover .similar-product-image {
          transform: scale(1.05);
        }
        .product-image-link:hover .quick-view {
          opacity: 1;
        }
        .similar-product-info {
          padding: 1.2rem;
        }
        .similar-product-title {
          font-size: 1rem;
          font-weight: 500;
          color: #0f172a;
          margin-bottom: 0.5rem;
          line-height: 1.4;
          height: 2.8rem;
        }
        .similar-product-price {
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 1rem;
        }
        .similar-product-actions {
          display: flex;
          gap: 0.8rem;
        }
        .similar-view-btn {
          flex-grow: 1;
          background: #f1f5f9;
          color: #0f172a;
          border: none;
          padding: 0.6rem 0.8rem;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 500;
          text-decoration: none;
          text-align: center;
          transition: all 0.2s ease;
        }
        .similar-view-btn:hover {
          background: #e2e8f0;
        }
        .similar-cart-btn {
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .similar-cart-btn:hover {
          opacity: 0.9;
          transform: translateY(-2px);
        }
        /* Responsive styles */
        @media (max-width: 992px) {
          .product-info {
            padding: 2rem 0 0 0;
          }
          .product-image-wrapper {
            height: 350px;
          }
        }
        @media (max-width: 768px) {
          .product-title {
            font-size: 1.8rem;
          }
          .product-meta {
            flex-direction: column;
            gap: 1rem;
          }
          .section-title h2 {
            font-size: 1.5rem;
          }
        }
        @media (max-width: 576px) {
          .product-actions {
            flex-direction: column;
          }
          .btn-add-cart, .btn-view-cart {
            width: 100%;
          }
          .product-image-wrapper {
            height: 280px;
          }
        }
        /* Skeleton styles */
        .product-detail-skeleton {
          padding: 4rem 0;
        }
        .product-image-skeleton {
          height: 450px;
          border-radius: 12px;
          overflow: hidden;
        }
        .product-info-skeleton {
          padding: 1rem 0 1rem 2rem;
        }
        .button-skeleton {
          display: flex;
        }
        .similar-products-skeleton {
          display: flex;
          gap: 1.5rem;
        }
        .similar-product-skeleton {
          min-width: 250px;
          max-width: 250px;
          background: white;
          padding: 1rem;
          border-radius: 12px;
        }
        @media (max-width: 992px) {
          .product-info-skeleton {
            padding: 2rem 0 0 0;
          }
          .product-image-skeleton {
            height: 350px;
          }
        }
      `}</style>

      {/* Product Detail Section */}
      {loading ? <Loading /> : <ShowProduct />}

      {/* Similar Products Section */}
      <div className="similar-products-section">
        <div className="container">
          <div className="section-title">
            <h2>You May Also Like</h2>
          </div>
          <Marquee
            pauseOnHover={true}
            pauseOnClick={true}
            speed={40}
            gradientWidth={50}
          >
            {loading2 ? <SimilarProductSkeleton /> : <ShowSimilarProducts />}
          </Marquee>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Product;
