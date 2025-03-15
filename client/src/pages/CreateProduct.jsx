import React, { useState, useEffect } from 'react'; // Added missing hooks import

const CreateProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    image_url: '',
    category: ''
  });
  const [message, setMessage] = useState('');
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/categories');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message);
        }

        setCategories(data);
      } catch (error) {
        setError(error.message);
        console.error('Error:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create product');
      }

      setFormData({
        name: '',
        description: '',
        price: '',
        stock_quantity: '',
        image_url: '',
        category: ''
      });

      setMessage('Product created successfully!');
      setTimeout(() => setMessage(''), 3000);

    } catch (error) {
      setError(error.message);
      console.error('Error:', error);
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card p-4 shadow-sm" style={{ maxWidth: '600px', width: '100%' }}>
        <h2 className="mb-4 text-center">Create New Product</h2>
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}> {/* Added onSubmit handler */}
          <div className="mb-3">
            <label className="form-label">Product Name:</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Description:</label>
            <textarea
              name="description"
              className="form-control"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Price:</label>
            <input
              type="number"
              name="price"
              step="0.01"
              className="form-control"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Stock Quantity:</label>
            <input
              type="number"
              name="stock_quantity"
              min="0"
              className="form-control"
              value={formData.stock_quantity}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Image URL:</label>
            <input
              type="text"
              name="image_url"
              className="form-control"
              value={formData.image_url}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Category:</label>
            <select
              name="category"
              className="form-select"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Create Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;