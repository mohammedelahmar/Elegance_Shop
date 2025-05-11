import React, { useState, useEffect } from 'react';
import { Image, Row, Col } from 'react-bootstrap';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import PropTypes from 'prop-types';
import './ProductImageGallery.css';

const ProductImageGallery = ({ product }) => {
  const [images, setImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  useEffect(() => {
    if (!product) return;
    
    let allImages = [];
    
    // Always include main image_url as the primary image
    if (product.image_url) {
      allImages.push({
        url: product.image_url,
        alt: product.name,
        isMain: true
      });
    }
    
    // Add any additional images from the images array
    if (product.images?.length > 0) {
      // Make sure we're getting the correct property from your image objects
      const additionalImages = product.images.map(img => ({
        // If your images are objects with a url property
        url: img.url || img, // Handle both object format and direct string format
        alt: img.alt || product.name,
        isMain: false
      }));
      
      // Add additional images that don't match the main image
      additionalImages.forEach(img => {
        // Only add images that aren't duplicates of the main image
        if (img.url !== product.image_url) {
          allImages.push(img);
        }
      });
    }
    
    // Only show navigation if we actually have multiple images
    console.log(`Product Gallery: Found ${allImages.length} images`);
    
    setImages(allImages);
    setSelectedImageIndex(0);
  }, [product]);
  
  const goToPrevious = () => {
    setSelectedImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };
  
  const goToNext = () => {
    setSelectedImageIndex((prevIndex) => 
      (prevIndex + 1) % images.length
    );
  };
  
  const goToImage = (index) => {
    setSelectedImageIndex(index);
  };
  
  useEffect(() => {
    console.log('Product Gallery Images:', {
      totalImages: images.length,
      mainImageUrl: product?.image_url,
      additionalImages: product?.images?.length || 0
    });
  }, [images, product]);
  
  if (images.length === 0) {
    return (
      <div className="product-image-placeholder">
        <div className="no-image">No image available</div>
      </div>
    );
  }
  
  return (
    <div className="product-gallery-container">
      <div className="main-image-container">
        <Image 
          src={images[selectedImageIndex]?.url} 
          alt={images[selectedImageIndex]?.alt || product.name}
          className="product-detail-image"
          fluid
          onError={(e) => {
            console.error('Image failed to load:', images[selectedImageIndex]?.url);
            e.target.src = 'https://via.placeholder.com/400x400?text=Image+Not+Found';
          }}
        />
        
        {images.length > 1 && (
          <>
            <button 
              className="gallery-nav-button prev-button" 
              onClick={goToPrevious}
              aria-label="Previous image"
            >
              <FaChevronLeft />
            </button>
            
            <button 
              className="gallery-nav-button next-button" 
              onClick={goToNext}
              aria-label="Next image"
            >
              <FaChevronRight />
            </button>
            
            <div className="image-counter">
              {selectedImageIndex + 1}/{images.length}
            </div>
          </>
        )}
      </div>
      
      {/* Thumbnails */}
      {images.length > 1 && (
        <Row className="thumbnail-container mt-3">
          {images.map((image, index) => (
            <Col xs={3} key={index}>
              <div 
                className={`thumbnail ${selectedImageIndex === index ? 'active' : ''}`}
                onClick={() => goToImage(index)}
              >
                <Image 
                  src={image.url} 
                  alt={`Thumbnail ${index + 1}`} 
                  fluid 
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/100x100?text=Not+Found';
                  }}
                />
              </div>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

ProductImageGallery.propTypes = {
  product: PropTypes.object.isRequired
};

export default ProductImageGallery;