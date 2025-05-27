import React , { useState } from 'react';
import { Modal, Table } from 'react-bootstrap';
import PropTypes from 'prop-types';
import './SizeGuide.css';

const SizeGuide = ({ show, onHide, sizeType = 'clothing' }) => {
  const [activeSizeType, setActiveSizeType] = useState(sizeType);
  
  const renderSizeTable = () => {
    switch (activeSizeType) {
      case 'numeric':
        return (
          <table className="size-guide-table">
            <thead>
              <tr>
                <th>Size</th>
                <th>Waist (cm)</th>
                <th>Waist (inches)</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>36</td><td>88-90</td><td>34.6-35.4</td></tr>
              <tr><td>38</td><td>91-93</td><td>35.8-36.6</td></tr>
              <tr><td>40</td><td>94-96</td><td>37.0-37.8</td></tr>
              <tr><td>42</td><td>97-99</td><td>38.2-39.0</td></tr>
              <tr><td>44</td><td>100-102</td><td>39.4-40.2</td></tr>
              <tr><td>46</td><td>103-106</td><td>40.5-41.7</td></tr>
            </tbody>
          </table>
        );
      case 'shoe':
        return (
          <table className="size-guide-table">
            <thead>
              <tr>
                <th>EU</th>
                <th>US (Men)</th>
                <th>UK</th>
                <th>Foot Length (cm)</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>38</td><td>6</td><td>5.5</td><td>24</td></tr>
              <tr><td>39</td><td>7</td><td>6.5</td><td>24.6</td></tr>
              <tr><td>40</td><td>8</td><td>7.5</td><td>25.2</td></tr>
              <tr><td>41</td><td>9</td><td>8.5</td><td>25.8</td></tr>
              <tr><td>42</td><td>10</td><td>9.5</td><td>26.4</td></tr>
              <tr><td>43</td><td>11</td><td>10.5</td><td>27.0</td></tr>
              <tr><td>44</td><td>12</td><td>11.5</td><td>27.6</td></tr>
              <tr><td>45</td><td>13</td><td>12.5</td><td>28.2</td></tr>
            </tbody>
          </table>
        );
      case 'clothing':
      default:
        return (
          <table className="size-guide-table">
            <thead>
              <tr>
                <th>Size</th>
                <th>Chest (cm)</th>
                <th>Chest (inches)</th>
                <th>Shoulder (cm)</th>
                <th>Length (cm)</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>XS</td><td>88-92</td><td>34.6-36.2</td><td>42-44</td><td>67-69</td></tr>
              <tr><td>S</td><td>93-97</td><td>36.6-38.2</td><td>45-47</td><td>70-72</td></tr>
              <tr><td>M</td><td>98-102</td><td>38.6-40.2</td><td>48-50</td><td>73-75</td></tr>
              <tr><td>L</td><td>103-107</td><td>40.6-42.2</td><td>51-53</td><td>76-78</td></tr>
              <tr><td>XL</td><td>108-112</td><td>42.5-44.1</td><td>54-56</td><td>79-81</td></tr>
              <tr><td>XXL</td><td>113-117</td><td>44.5-46.1</td><td>57-59</td><td>82-84</td></tr>
              <tr><td>3XL</td><td>118-122</td><td>46.5-48.0</td><td>60-62</td><td>85-87</td></tr>
            </tbody>
          </table>
        );
    }
  };

  const getIllustrationImage = () => {
    switch (activeSizeType) {
      case 'numeric':
        return "https://i.imgur.com/IjGqTFt.png"; // Pants measurement illustration
      case 'shoe':
        return "https://i.imgur.com/rUGpNL7.png"; // Shoe measurement illustration
      case 'clothing':
      default:
        return "https://i.imgur.com/oBZAW3G.png"; // Shirt measurement illustration
    }
  };

  return (
    <Modal 
      size="lg" 
      show={show} 
      onHide={onHide} 
      centered
      contentClassName="size-guide-modal"
      backdrop={true} // Changed from "static" to true
      dialogClassName="size-guide-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Size Guide</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="guide-description">
          Find your perfect fit with our detailed size chart. Take your measurements and compare with the sizes below for the best fit.
        </p>
        
        <div className="size-type-nav">
          <button 
            className={`size-type-btn ${activeSizeType === 'clothing' ? 'active' : ''}`}
            onClick={() => setActiveSizeType('clothing')}
          >
            Clothing Sizes
          </button>
          <button 
            className={`size-type-btn ${activeSizeType === 'numeric' ? 'active' : ''}`}
            onClick={() => setActiveSizeType('numeric')}
          >
            Numeric Sizes
          </button>
          <button 
            className={`size-type-btn ${activeSizeType === 'shoe' ? 'active' : ''}`}
            onClick={() => setActiveSizeType('shoe')}
          >
            Shoe Sizes
          </button>
        </div>
        
        {renderSizeTable()}
        
        <div className="size-guide-illustration">
          <img src={getIllustrationImage()} alt="Measurement guide" />
        </div>
        
        <div className="measure-guide">
          <h5 className="measure-guide-title">How to Measure</h5>
          <ul className="measure-list">
            <li>
              <strong>Chest:</strong> 
              Measure around the fullest part of your chest, keeping the tape horizontal.
            </li>
            <li>
              <strong>Waist:</strong> 
              Measure around your natural waistline, keeping the tape comfortably loose.
            </li>
            <li>
              <strong>Shoulders:</strong> 
              Measure from the edge of one shoulder across to the other edge.
            </li>
            <li>
              <strong>Length:</strong> 
              For tops, measure from the highest point of the shoulder to the desired length.
            </li>
            <li>
              <strong>Foot Length:</strong> 
              Measure from the heel to the tip of your longest toe while standing.
            </li>
          </ul>
        </div>
      </Modal.Body>
    </Modal>
  );
};

SizeGuide.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  sizeType: PropTypes.oneOf(['clothing', 'numeric', 'shoe'])
};

export default SizeGuide;