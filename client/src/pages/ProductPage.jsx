import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Alert, Form } from 'react-bootstrap';
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaTruck,
  FaShieldAlt,
  FaUndoAlt,
  FaCreditCard
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { getProductById } from '../api/product';
import { getVariantsByProduct } from '../api/variant';
import { getProductReviews, createReview } from '../api/review';
import ProductDetail from '../components/Product/ProductDetail';
import RecentlyViewed from '../components/Product/RecentlyViewed';
import useRecentlyViewed from '../hooks/useRecentlyViewed';
import LoadingAnimation from '../components/common/LoadingAnimation';

import './ProductPage.css';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewState, setReviewState] = useState({
    rating: 0,
    comment: '',
    image: null,
    imagePreview: null,
    isSubmitting: false,
    error: null,
    success: false
  });
  const [activeTab, setActiveTab] = useState('reviews');
  const reviewSectionRef = useRef(null);

  const { addProduct } = useRecentlyViewed();

  const serviceHighlights = [
    {
      Icon: FaTruck,
      title: 'Free Shipping',
      description: 'Complimentary delivery on orders over $50'
    },
    {
      Icon: FaCreditCard,
      title: 'Secure Payment',
      description: '256-bit encrypted checkout and wallets'
    },
    {
      Icon: FaUndoAlt,
      title: 'Easy Returns',
      description: '30-day hassle-free exchanges and returns'
    },
    {
      Icon: FaShieldAlt,
      title: 'Quality Guarantee',
      description: 'Expertly inspected before it leaves our atelier'
    }
  ];

  const formatPrice = (price) => {
    if (!price) return '0.00';
    if (typeof price === 'object' && price.$numberDecimal) {
      return parseFloat(price.$numberDecimal).toFixed(2);
    }
    return parseFloat(price).toFixed(2);
  };

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      setError(null);

      try {
        const productData = await getProductById(id);
        setProduct(productData);

        const [variantsData, reviewsData] = await Promise.allSettled([
          getVariantsByProduct(id),
          getProductReviews(id)
        ]);

        if (variantsData.status === 'fulfilled') {
          setVariants(variantsData.value.data || []);
        }

        if (reviewsData.status === 'fulfilled') {
          setReviews(reviewsData.value.data || []);
        }
      } catch (err) {
        setError('Failed to load product. It may have been removed or is unavailable.');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  useEffect(() => {
    if (product && Object.keys(product).length > 0) {
      addProduct({
        _id: product._id,
        name: product.name,
        price: product.price,
        image_url: product.image_url
      });
    }
  }, [product, id, addProduct]);

  const calculateAverageRating = () => {
    if (!reviews || !Array.isArray(reviews) || reviews.length === 0) return 0;

    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return totalRating / reviews.length;
  };

  const averageRating = calculateAverageRating();

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedImage = e.target.files[0];
      setReviewState((prev) => ({
        ...prev,
        image: selectedImage,
        imagePreview: URL.createObjectURL(selectedImage)
      }));
    }
  };

  const handleRemoveImage = () => {
    if (reviewState.imagePreview) {
      URL.revokeObjectURL(reviewState.imagePreview);
    }
    setReviewState((prev) => ({
      ...prev,
      image: null,
      imagePreview: null
    }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewState((prev) => ({ ...prev, isSubmitting: true, error: null, success: false }));

    if (!isAuthenticated) {
      setReviewState((prev) => ({ ...prev, isSubmitting: false }));
      navigate('/login');
      return;
    }

    try {
      await createReview({
        product_id: id,
        rating: reviewState.rating,
        commentaire: reviewState.comment
      });
      const reviewsData = await getProductReviews(id);
      setReviews(reviewsData.data || []);
      setReviewState({
        rating: 0,
        comment: '',
        image: null,
        imagePreview: null,
        isSubmitting: false,
        error: null,
        success: true
      });
    } catch (err) {
      console.error('Review submission error:', err);
      setReviewState((prev) => ({
        ...prev,
        isSubmitting: false,
        error: err.response?.data?.message || 'Failed to submit review. Please try again.'
      }));
    }
  };

  const handleAddToCart = () => {
    navigate('/cart');
  };

  const renderStarRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="rating-icon filled" />);
    }

    if (halfStar) {
      stars.push(<FaStarHalfAlt key="half" className="rating-icon filled" />);
    }

    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="rating-icon" />);
    }

    return stars;
  };

  const handleScrollToReviews = () => {
    setActiveTab('reviews');
    requestAnimationFrame(() => {
      if (reviewSectionRef.current) {
        reviewSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  };

  if (loading) {
    return (
      <div className="product-page loading-state">
        <LoadingAnimation size="large" text="Preparing your product experience..." />
        <p className="loading-copy">Hang tight while we style everything for you.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-page">
        <div className="product-page__inner">
          <div className="product-feedback-card">
            <h2>Product unavailable</h2>
            <p>{error}</p>
            <Link to="/products" className="primary-link">Back to catalog</Link>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-page">
        <div className="product-page__inner">
          <div className="product-feedback-card">
            <h2>Product not found</h2>
            <p>The item you are looking for does not exist anymore.</p>
            <Link to="/products" className="primary-link">Browse other products</Link>
          </div>
        </div>
      </div>
    );
  }

  const stockQuantity = product.stock_quantity ?? 0;
  const stockStatusLabel = stockQuantity > 0 ? 'In Stock' : 'Out of Stock';
  const stockBadgeType = stockQuantity > 0 ? 'positive' : 'negative';
  const sku = product._id ? product._id.slice(-6).toUpperCase() : '—';
  const descriptionParagraphs =
    product.description && product.description.trim().length > 0
      ? product.description.split('\n').filter(Boolean)
      : ['This item is crafted with premium materials and tailored for everyday elegance.'];
  const heroParagraph = descriptionParagraphs[0];
  const ratingSummary = reviews.length
    ? `${averageRating.toFixed(1)} / 5 • ${reviews.length} ${reviews.length === 1 ? 'review' : 'reviews'}`
    : 'No reviews yet';
  const highlightBullets = [
    {
      title: 'Availability',
      copy: stockQuantity > 0 ? `${stockQuantity} pieces ready to ship` : 'Currently on backorder'
    },
    { title: 'Delivery', copy: 'Express shipping in 2-4 business days' },
    { title: 'Support', copy: 'Dedicated stylists for sizing & care guidance' }
  ];
  const metaGrid = [
    { label: 'SKU', value: sku },
    { label: 'Category', value: product.category?.name || 'Uncategorized' },
    { label: 'Inventory', value: stockStatusLabel },
    { label: 'Updated', value: product.updatedAt ? new Date(product.updatedAt).toLocaleDateString() : '—' }
  ];

  return (
    <div className="product-page">
      <div className="product-page__inner">
        <nav className="hero-breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/products">Products</Link>
          <span>/</span>
          <span>{product.name}</span>
        </nav>

        <section className="product-hero-card">
          <div className="product-visual-panel">
            <div className="product-media-frame">
              <img
                src={product.image_url || 'https://via.placeholder.com/500x500?text=No+Image'}
                alt={product.name}
                className="product-media"
              />
            </div>
            <div className="media-caption">Tap image to enlarge</div>
          </div>

          <div className="product-summary-panel">
            <p className="eyebrow-pill">{product.category?.name || 'Signature Capsule'}</p>
            <h1 className="product-title">{product.name}</h1>
            <div className="rating-row">
              <div className="rating-stars">{renderStarRating(averageRating)}</div>
              <span className="rating-text">{ratingSummary}</span>
              <button type="button" className="link-cta" onClick={handleScrollToReviews}>
                Write a review
              </button>
            </div>
            <p className="product-lede">{heroParagraph}</p>
            <div className="price-block">
              <span className="price-tag">${formatPrice(product.price)}</span>
              <span className={`stock-chip ${stockBadgeType}`}>{stockStatusLabel}</span>
            </div>
            <div className="product-category-chip">{product.category?.name || 'Uncategorized'}</div>
            <ul className="product-highlight-list">
              {highlightBullets.map((item) => (
                <li key={item.title}>
                  <span>{item.title}</span>
                  <p>{item.copy}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="product-config-panel">
            <div className="config-card">
              <ProductDetail
                product={product}
                variants={variants}
                onAddToCart={handleAddToCart}
                hideMainInfo
              />
            </div>
            <div className="service-highlights-grid">
              {serviceHighlights.map(({ Icon, title, description }) => (
                <div className="service-card" key={title}>
                  <Icon />
                  <div>
                    <h4>{title}</h4>
                    <p>{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="product-tabs-card">
          <div className="product-tabs">
            <button
              type="button"
              className={`tab-trigger ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button
              type="button"
              className={`tab-trigger ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews ({reviews.length})
            </button>
          </div>
          <div className="tab-panel">
            {activeTab === 'description' ? (
              <div className="description-tab">
                <div className="description-rich-text">
                  {descriptionParagraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
                <div className="product-meta-grid">
                  {metaGrid.map((meta) => (
                    <div className="meta-card" key={meta.label}>
                      <span>{meta.label}</span>
                      <strong>{meta.value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="reviews-tab" ref={reviewSectionRef}>
                <div className="review-layout">
                  <div className="review-form-shell">
                    {isAuthenticated ? (
                      <>
                        <h4>Write a review</h4>
                        {reviewState.success && (
                          <Alert
                            variant="success"
                            className="elevated-alert"
                            dismissible
                            onClose={() => setReviewState((prev) => ({ ...prev, success: false }))}
                          >
                            Your review has been submitted successfully!
                          </Alert>
                        )}
                        {reviewState.error && (
                          <Alert
                            variant="danger"
                            className="elevated-alert"
                            dismissible
                            onClose={() => setReviewState((prev) => ({ ...prev, error: null }))}
                          >
                            {reviewState.error}
                          </Alert>
                        )}
                        <Form onSubmit={handleSubmitReview} className="modern-review-form">
                          <Form.Group className="mb-3">
                            <Form.Label>Rating</Form.Label>
                            <div className="rating-picker">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar
                                  key={star}
                                  onClick={() => setReviewState((prev) => ({ ...prev, rating: star }))}
                                  className={star <= reviewState.rating ? 'filled' : ''}
                                />
                              ))}
                            </div>
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label>Comment</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={4}
                              value={reviewState.comment}
                              onChange={(e) =>
                                setReviewState((prev) => ({
                                  ...prev,
                                  comment: e.target.value
                                }))
                              }
                              required
                            />
                          </Form.Group>
                          <Form.Group className="mb-4">
                            <Form.Label>Add photo (optional)</Form.Label>
                            {reviewState.imagePreview ? (
                              <div className="selected-image-preview">
                                <img src={reviewState.imagePreview} alt="Preview" />
                                <button type="button" className="ghost-button" onClick={handleRemoveImage}>
                                  Remove image
                                </button>
                              </div>
                            ) : (
                              <div className="file-upload-row">
                                <label htmlFor="review-photo" className="file-trigger">
                                  Choose file
                                </label>
                                <Form.Control
                                  type="file"
                                  id="review-photo"
                                  accept="image/*"
                                  onChange={handleImageChange}
                                  style={{ display: 'none' }}
                                />
                                <span className="file-name">
                                  {reviewState.image ? reviewState.image.name : 'No file chosen'}
                                </span>
                              </div>
                            )}
                            <Form.Text muted>Share a glimpse of how you styled it.</Form.Text>
                          </Form.Group>
                          <button type="submit" className="primary-button" disabled={reviewState.isSubmitting}>
                            {reviewState.isSubmitting ? 'Submitting...' : 'Submit Review'}
                          </button>
                        </Form>
                      </>
                    ) : (
                      <Alert variant="info" className="elevated-alert login-alert">
                        Please <Link to="/login">login</Link> to share your experience.
                      </Alert>
                    )}
                  </div>
                  <div className="review-list-shell">
                    <div className="review-list-header">
                      <h4>Customer reviews</h4>
                      <p>
                        {reviews.length
                          ? `${reviews.length} people shared their thoughts`
                          : 'No reviews yet. Be the first!'}
                      </p>
                    </div>
                    {reviews.length === 0 ? (
                      <div className="empty-state-card">
                        <p>No reviews yet. Be the first to review this product!</p>
                      </div>
                    ) : (
                      reviews.map((review) => (
                        <div key={review._id} className="review-card">
                          <div className="review-card-header">
                            <div className="review-avatar-chip">
                              {review.user_id?.Firstname
                                ? review.user_id.Firstname[0]
                                : review.user?.Firstname
                                  ? review.user.Firstname[0]
                                  : 'A'}
                            </div>
                            <div className="reviewer-meta">
                              <span className="reviewer-name">
                                {review.user_id?.Firstname || review.user?.Firstname || 'Anonymous'}
                              </span>
                              <span className="review-date">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="review-rating">{renderStarRating(review.rating)}</div>
                          </div>
                          <p className="review-copy">{review.commentaire || review.comment}</p>
                          {review.imageUrl && (
                            <div className="review-image-container">
                              <img
                                src={review.imageUrl}
                                alt="Customer upload"
                                onClick={() => window.open(review.imageUrl, '_blank')}
                              />
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <div className="product-related-section">
          <RecentlyViewed />
        </div>
      </div>
    </div>
  );
};

export default ProductPage;