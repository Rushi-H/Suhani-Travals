# 🚌 Cab Booking Admin System

A full-stack MERN application for managing cab bookings with real-time seat updates, admin dashboard, and customer booking interface.

![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)

## ✨ Features

### 🔐 Authentication
- **Separate login** for customers and admins
- JWT-based authentication with 7-day token expiry
- Password hashing with bcrypt
- Protected routes with role-based access control

### 👥 Customer Features
- User registration and login
- Search available trips by date and route
- Interactive seat selection with real-time updates
- Book multiple seats in a single transaction
- View booking confirmation

### 🎛️ Admin Features
- Admin dashboard with live statistics
- **Create and manage trips** with vehicle and driver assignment
- **Driver management** - Add, edit, and assign drivers to vehicles
- Approve/reject booking requests
- Manual seat booking for walk-in customers
- Real-time fleet status monitoring
- Revenue analytics and occupancy tracking
- Trip status management (Scheduled, Boarding, Departed, etc.)

### 🚗 Fleet Management
- Vehicle inventory management
- Driver profiles with license tracking
- Assign drivers to specific vehicles
- Track driver availability and experience

### 🔄 Real-time Updates
- Socket.io integration for live seat availability
- Instant booking notifications
- Real-time dashboard updates

## 🛠️ Tech Stack

**Frontend:**
- React 18 with Vite
- Material-UI (MUI) for components
- React Router for navigation
- Socket.io-client for real-time updates
- Axios for API calls
- React Toastify for notifications

**Backend:**
- Node.js & Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- bcryptjs for password hashing
- Socket.io for WebSocket connections
- Nodemon for development

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

Created with ❤️ by revan

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## ⭐ Show your support

Give a ⭐️ if this project helped you!
