# Loan Eligibility Checker

A web application that allows users to check their loan eligibility based on their mutual fund holdings.

## Features

- User authentication (login/register)
- PAN-based mutual fund holdings retrieval
- Loan eligibility calculation (50% of total mutual fund value)
- History of eligibility checks
- Responsive UI with Material-UI components

## Tech Stack

### Frontend
- React with TypeScript
- Material-UI for components
- React Router for navigation
- Axios for API calls

### Backend
- Node.js with Express
- MongoDB for database
- JWT for authentication
- Bcrypt for password hashing

## Project Structure

```
.
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context
│   │   ├── pages/         # Page components
│   │   └── App.tsx        # Main app component
│   └── package.json
├── server/                 # Node.js backend
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Express middleware
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
   npm start
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
   npm start
   ```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user

### Mutual Fund Holdings
- GET `/api/mf/holdings?pan={pan}` - Get mutual fund holdings by PAN

### Loan Eligibility
- POST `/api/eligibility/check` - Check loan eligibility
- GET `/api/eligibility/history` - Get eligibility check history

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Protected API routes
- Input validation
- Error handling

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request 