import React from 'react';
import { Modal, Table } from 'react-bootstrap';
import PropTypes from 'prop-types';

const SizeGuide = ({ show, onHide, sizeType = 'clothing' }) => {
  const renderSizeTable = () => {
    switch (sizeType) {
      case 'numeric':
        return (
          <Table striped bordered hover>
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
          </Table>
        );
      case 'shoe':
        return (
          <Table striped bordered hover>
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
          </Table>
        );
      case 'clothing':
      default:
        return (
          <Table striped bordered hover>
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
          </Table>
        );
    }
  };

  return (
    <Modal size="lg" show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Size Guide</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="mb-3">Use this size chart to find your perfect fit. Measure yourself and compare with the sizes below.</p>
        {renderSizeTable()}
        <div className="mt-3">
          <h5>How to Measure</h5>
          <ul className="mt-2">
            <li><strong>Chest:</strong> Measure around the fullest part of your chest, keeping the measuring tape horizontal.</li>
            <li><strong>Shoulder:</strong> Measure from the edge of one shoulder to the other, across the back.</li>
            <li><strong>Length:</strong> Measure from the highest point of the shoulder to the desired length.</li>
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