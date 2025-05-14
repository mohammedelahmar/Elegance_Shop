# 🛍️ Elegance Shop

**Elegance Shop** is a full-featured web application built with the **MERN Stack** (MongoDB, Express.js, React, Node.js), offering users a seamless shopping experience. It includes a dynamic shop interface, wishlist management, secure checkout (PayPal, credit card, bank transfer, and cash on delivery), and an admin panel for product, user, and order management.

## 👥 Team Roles

* **Mohammed El Ahmar** — Full Stack Developer (Backend & Frontend)
* **Mohammed Mehdi Boudir** — UI/UX & Styling
* **Yasser Amiri** — Documentation & Reports

---

## 🚀 Features

* 🔐 User Authentication & Authorization (JWT)
* 🛒 Product Browsing & Detailed Pages
* 🧾 Shopping Cart & Wishlist
* 💳 Multiple Payment Methods

  * PayPal
  * Credit Card
  * Bank Transfer
  * Cash on Delivery
* 📦 Order Tracking
* 🧑‍💻 Admin Panel

  * Manage Products, Users, and Orders
* 🌐 Responsive Design
* 📬 Contact Page

---

## 📸 Screenshots

> Include here some screenshots if possible of the shop, product detail, cart, checkout, and admin dashboard.

---

## 🛠️ Tech Stack

* **Frontend**: React.js, Redux Toolkit, Tailwind CSS / styled-components
* **Backend**: Node.js, Express.js, Mongoose
* **Database**: MongoDB Atlas
* **Payment**: PayPal REST API, Custom Credit Card / Bank Transfer Integration
* **Authentication**: JWT & bcrypt

---

## 📦 Installation & Setup

```bash
# 1. Clone the repo
$ git clone https://github.com/your-username/elegance-shop.git
$ cd elegance-shop

# 2. Install backend dependencies
$ cd backend
$ npm install

# 3. Set up environment variables in backend/.env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
PAYPAL_CLIENT_ID=your_paypal_client_id

# 4. Start the backend server
$ npm run dev

# 5. Install frontend dependencies
$ cd ../frontend
$ npm install

# 6. Start the frontend app
$ npm start
```

Make sure MongoDB is running locally or use MongoDB Atlas.

---

## 📁 Project Structure

```
root
├── backend
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── config
│   └── ...
├── frontend
│   ├── components
│   ├── pages
│   ├── redux
│   └── ...
```

---

## 💡 Future Improvements

* Add product reviews and ratings
* Improve dashboard analytics
* Add product filter by price, brand, and categories
* Multi-language support

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙌 Acknowledgments

Thanks to everyone who contributed to open source projects that inspired this one.

> Built with ❤️ by **Mohammed El Ahmar**, **Mohammed Mehdi Boudir**, and **Yasser Amiri**
