# Cab Booking Admin Dashboard

A comprehensive MERN stack admin dashboard for managing cab/bus bookings between Akluj and Pune. Features real-time seat management, booking approval workflow, and automated notifications via email and WhatsApp.

## 🚀 Features

### Core Functionality
- **Booking Management**: View and manage all incoming booking requests with Accept/Reject actions
- **Real-time Seat Management**: Interactive seat map with manual override for offline bookings
- **Trip Status Control**: Manage trip lifecycle (Scheduled → Boarding → Full → Departed)
- **Automated Notifications**: Email (Nodemailer) and WhatsApp (Twilio) notifications on booking approval/rejection
- **Live Dashboard**: Real-time updates via Socket.io across all connected clients
- **Revenue Analytics**: Daily revenue tracking and occupancy statistics

### Vehicle Support
- Maruti Suzuki Ertiga (7 seats)
- Tata Winger 12-seater (12 seats)
- BharatBenz 1017 (20 seats)

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local or MongoDB Atlas)
- **Gmail Account** (for email notifications)
- **Twilio Account** (for WhatsApp notifications)

## 🛠️ Installation

### 1. Clone or Navigate to Project Directory
```bash
cd d:/projects/Suhani
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/cab-booking-admin

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
EMAIL_FROM=Cab Booking Service <your-email@gmail.com>

# Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

**Important Notes:**
- For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833) instead of your regular password
- For Twilio WhatsApp, you need to activate the [Twilio Sandbox](https://www.twilio.com/docs/whatsapp/sandbox)

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

### 4. Seed Database (Optional but Recommended)

```bash
cd ../backend
npm run seed
```

This will create:
- 3 vehicles (Ertiga, Winger, BharatBenz)
- Sample trips for today with different departure times

## 🚀 Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
```

Backend will run on `http://localhost:5000`

### Start Frontend Development Server

Open a new terminal:

```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:5173`

## 📡 API Endpoints

### Admin Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/bookings` | Fetch all bookings (with filters) |
| PUT | `/api/admin/bookings/:id/status` | Accept/Reject booking |
| GET | `/api/admin/trips` | Fetch all trips |
| PATCH | `/api/admin/trips/:tripId/seats` | Manual seat override |
| PATCH | `/api/admin/trips/:tripId/status` | Update trip status |
| GET | `/api/admin/dashboard/stats` | Dashboard statistics |

### Trip Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/trips` | Fetch available trips (customer view) |
| POST | `/api/trips` | Create new trip (admin) |
| GET | `/api/trips/:id` | Get trip details |
| POST | `/api/trips/:id/bookings` | Create booking (customer) |

### Authentication

For development, generate an admin token:

```bash
GET http://localhost:5000/api/admin/generate-token
```

Use the returned token in the `Authorization` header:
```
Authorization: Bearer <token>
```

## 🎨 Dashboard Features

### 1. Pending Requests Section
- View all pending bookings in a table
- Customer details (name, phone, email)
- Trip information and seat numbers
- Accept/Reject buttons with notification triggers

### 2. Live Fleet Status
- Real-time vehicle occupancy visualization
- Trip status dropdown (Scheduled, Boarding, Full, Departed)
- Revenue tracking per vehicle
- Interactive seat map access

### 3. Seat Map
- Color-coded seats:
  - 🟢 **Green**: Vacant (available for booking)
  - 🔴 **Red**: Manual Booking (offline/phone booking)
  - 🔵 **Blue**: Online Booking (confirmed)
- Click to toggle seat status (Full ↔ Vacant)
- Real-time updates across all clients

### 4. Daily Revenue Analytics
- Bar chart showing revenue by vehicle
- Total revenue, bookings count, and occupancy rate
- Auto-updates with new bookings

## 🔄 Real-time Features (Socket.io)

The dashboard automatically updates when:
- New booking is created
- Booking status changes (Accept/Reject)
- Seat status is manually updated
- Trip status changes
- Any trip data is modified

## 🧪 Testing the Application

### 1. Create a Test Booking

```bash
curl -X POST http://localhost:5000/api/trips/<trip-id>/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "user": {
      "name": "Test User",
      "email": "test@example.com",
      "phone": "+919876543210"
    },
    "seatNumbers": [1, 2],
    "pickupLocation": "Akluj Bus Stand",
    "payment": {
      "method": "Online",
      "status": "Completed",
      "transactionId": "TEST123"
    }
  }'
```

### 2. Accept a Booking

```bash
curl -X PUT http://localhost:5000/api/admin/bookings/<booking-id>/status \
  -H "Content-Type: application/json" \
  -d '{"status": "Accepted"}'
```

### 3. Manual Seat Override

```bash
curl -X PATCH http://localhost:5000/api/admin/trips/<trip-id>/seats \
  -H "Content-Type: application/json" \
  -d '{
    "seatNumber": 5,
    "isBooked": true,
    "bookedBy": "Offline-Admin"
  }'
```

## 📱 Notification System

### Email Notifications
- Sent via Nodemailer using Gmail SMTP
- Beautiful HTML templates with booking details
- Triggered on Accept/Reject actions

### WhatsApp Notifications
- Sent via Twilio WhatsApp API
- Formatted messages with trip details
- Requires Twilio Sandbox setup for testing

## 🏗️ Project Structure

```
Suhani/
├── backend/
│   ├── controllers/
│   │   ├── adminController.js
│   │   └── tripController.js
│   ├── models/
│   │   ├── Booking.js
│   │   ├── Trip.js
│   │   └── Vehicle.js
│   ├── routes/
│   │   ├── admin.routes.js
│   │   └── trip.routes.js
│   ├── services/
│   │   ├── notificationService.js
│   │   └── socketService.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── server.js
│   ├── seedDatabase.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BookingTable.jsx
│   │   │   ├── FleetCard.jsx
│   │   │   ├── RevenueChart.jsx
│   │   │   └── SeatMap.jsx
│   │   ├── pages/
│   │   │   └── AdminDashboard.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── socket.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod` or check MongoDB Atlas connection
- Verify `MONGODB_URI` in `.env` file

### Email Not Sending
- Use Gmail App Password, not regular password
- Enable "Less secure app access" (if using older Gmail)
- Check EMAIL_USER and EMAIL_PASSWORD in `.env`

### WhatsApp Not Sending
- Join Twilio Sandbox: Send "join <sandbox-keyword>" to Twilio WhatsApp number
- Verify TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN
- Check phone number format: +91XXXXXXXXXX

### Socket.io Not Connecting
- Ensure backend is running on port 5000
- Check browser console for connection errors
- Verify CORS settings in backend

## 📝 License

ISC

## 👨‍💻 Author

Built with ❤️ for Akluj-Pune cab booking service
