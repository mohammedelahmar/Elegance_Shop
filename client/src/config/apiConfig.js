const config = {
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  CLOUDINARY_URL: process.env.REACT_APP_CLOUDINARY_URL || 'https://api.cloudinary.com/v1_1/your-cloud-name/upload',
  ITEMS_PER_PAGE: 12
};

export default config;