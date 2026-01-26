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

## 🚀 Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd Suhani
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 4. Environment Setup

Create a `.env` file in the `backend` folder:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB (choose one)
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/cab-booking-admin

# OR MongoDB Atlas
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/cab-booking-admin?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_change_this

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Email Configuration (Optional - for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Twilio Configuration (Optional - for WhatsApp)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

### 5. Database Setup

**Option A: Local MongoDB**

1. Install MongoDB Community Edition
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```

**Option B: MongoDB Atlas**

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string and update `.env`

### 6. Seed the Database

```bash
cd backend

# Create default admin user
npm run seed:admin
# Username: admin
# Password: admin123

# Seed sample vehicles (backend must be running)
# Visit: http://localhost:5000/api/admin/vehicles/seed
# Or run:
curl -X POST http://localhost:5000/api/admin/vehicles/seed
```

## 🎮 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Server runs on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
App runs on `http://localhost:5173`

### Production Build

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## 📱 Usage

### Admin Access
1. Navigate to `http://localhost:5173`
2. Click "Admin Dashboard"
3. Login with:
   - **Username:** `admin`
   - **Password:** `admin123`
4. Features:
   - View pending booking requests
   - Create new trips with vehicle/driver assignment
   - Manage drivers and vehicles
   - Monitor fleet status
   - View revenue analytics

### Customer Access
1. Navigate to `http://localhost:5173`
2. Click "Book a Ride"
3. Sign up for a new account or login
4. Search for available trips
5. Select seats and complete booking

## 🗂️ Project Structure

```
Suhani/
├── backend/
│   ├── controllers/      # Request handlers
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── driverController.js
│   │   ├── tripController.js
│   │   └── vehicleController.js
│   ├── models/          # Mongoose schemas
│   │   ├── Admin.js
│   │   ├── Booking.js
│   │   ├── Driver.js
│   │   ├── Trip.js
│   │   ├── User.js
│   │   └── Vehicle.js
│   ├── routes/          # API routes
│   │   ├── admin.routes.js
│   │   ├── auth.routes.js
│   │   └── trip.routes.js
│   ├── middleware/      # Custom middleware
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── services/        # Business logic
│   │   ├── notificationService.js
│   │   └── socketService.js
│   ├── .env            # Environment variables
│   ├── server.js       # Entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── BookingForm.jsx
│   │   │   ├── BookingTable.jsx
│   │   │   ├── CreateTripDialog.jsx
│   │   │   ├── FleetCard.jsx
│   │   │   ├── ManageDriverDialog.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── RevenueChart.jsx
│   │   │   └── SeatMap.jsx
│   │   ├── context/        # React context
│   │   │   └── AuthContext.jsx
│   │   ├── pages/          # Page components
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── CustomerBooking.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   ├── services/       # API & Socket services
│   │   │   ├── api.js
│   │   │   └── socket.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/customer/signup` - Customer registration
- `POST /api/auth/customer/login` - Customer login
- `POST /api/auth/admin/login` - Admin login
- `GET /api/auth/verify` - Verify JWT token

### Trips
- `GET /api/trips` - Get available trips
- `GET /api/trips/:id` - Get trip details
- `POST /api/trips/book` - Create booking (requires auth)

### Admin (Protected)
- `GET /api/admin/bookings` - Get all bookings
- `PUT /api/admin/bookings/:id/status` - Update booking status
- `GET /api/admin/trips` - Get all trips
- `POST /api/admin/trips` - Create new trip
- `PATCH /api/admin/trips/:id/status` - Update trip status
- `GET /api/admin/drivers` - Get all drivers
- `POST /api/admin/drivers` - Create driver
- `PUT /api/admin/drivers/:id` - Update driver
- `DELETE /api/admin/drivers/:id` - Delete driver
- `GET /api/admin/vehicles` - Get all vehicles
- `POST /api/admin/vehicles` - Create vehicle
- `GET /api/admin/dashboard/stats` - Get dashboard statistics

### Public
- `POST /api/admin/vehicles/seed` - Seed sample vehicles

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt (10 salt rounds)
- Protected API routes with middleware
- Role-based access control (Customer/Admin)
- CORS configuration
- Input validation
- Secure HTTP headers

## 🎨 UI Features

- Modern Material-UI design
- Responsive layout for all devices
- Real-time seat availability visualization
- Interactive seat selection
- Toast notifications for user feedback
- Loading states and error handling
- Gradient backgrounds and smooth animations

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB service is running
- Check connection string in `.env`
- For Atlas: Verify IP whitelist and credentials

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

### Dependencies Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Created with ❤️ by [Your Name]

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## ⭐ Show your support

Give a ⭐️ if this project helped you!
