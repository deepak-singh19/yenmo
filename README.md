
# Loan Eligibility Checker

A web application that allows users to check their loan eligibility based on their mutual fund holdings.

## Features

- User authentication (login/register) with JWT
- PAN-based mutual fund holdings retrieval
- Loan eligibility calculation (50% of total mutual fund value)
- History of eligibility checks
- Indexes added in MongoDB for faster queries
- Centralized error handling with `AppError` and `asyncHandler`
- Auth context (`AuthContext`) to manage authentication state in frontend
- Token persisted in `localStorage`
- Service-based API calls (`api.ts`)
- Responsive UI with Material-UI (MUI) components
- Automatic dummy Mutual Fund Holdings added for new users on registration

## Tech Stack

### Frontend
- React with TypeScript
- Material-UI (MUI) for UI components
- React Router for navigation
- Axios for API calls (via centralized `api.ts`)
- React Context API for Authentication

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Centralized error handling (AppError, asyncHandler)
- MongoDB Indexes for optimized queries

## Project Structure

```
.
├── client/                 # React frontend
│   ├── src/ 
│   │   ├── context/       # AuthContext
│   │   ├── pages/         # Dashboard, Login, Register pages
│   │   ├── services/      # api.ts (centralized API calls)
│   │   └── App.tsx        # Main app component
│   └── package.json
├── server/                 # Node.js backend
│   ├── config/            # Database connection and environment config
│   ├── controllers/       # Controller logic
│   ├── middleware/        # AppError, asyncHandler, protect (JWT middleware)
│   ├── models/            # MongoDB models (User, Holding, Loan)
│   ├── routes/            # API routes (authRoutes, mfRoutes, loanRoutes)
│   ├── utils/             # Utility functions (e.g., generateToken, createDummyHoldings)
│   └── server.js          # Main server file
└── README.md
```

## Setup and Installation

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/loan_eligibility
   JWT_SECRET=your_jwt_secret_key_here
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

Base URL: `/api`

### Authentication
- POST `/auth/register` – Register a new user (adds fake holdings)
- POST `/auth/login` – Login user

### Mutual Fund Holdings
- GET `/mf/holdings?pan={pan}` – Get mutual fund holdings by PAN

### Loan Eligibility
- POST `/loans/check` – Check loan eligibility
- GET `/loans/history` – Get eligibility check history

## Security and Optimization Features

- Password hashing with bcrypt
- JWT-based authentication
- Protected API routes with middleware
- Centralized async error handling
- MongoDB indexes for query optimization
- Input validation and sanitization

## How Registration Works

- On registering a new user, random dummy Mutual Fund Holdings data is automatically created and linked with the user's PAN.
- This allows users to immediately test loan eligibility without manually adding holdings.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/awesome-feature`)
3. Commit your changes (`git commit -m 'Add some awesome feature'`)
4. Push to the branch (`git push origin feature/awesome-feature`)
5. Open a Pull Request