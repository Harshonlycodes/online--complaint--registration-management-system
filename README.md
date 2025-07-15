# Online Complaint Registration and Management System

A full-stack MERN application for managing complaints with user authentication, role-based access control, and administrative features.

## Features

### User Features
- **Authentication**: Secure registration and login with JWT tokens
- **Complaint Management**: Submit, view, and track complaints
- **File Upload**: Attach documents/images to complaints
- **Dashboard**: Personal dashboard with complaint statistics
- **Status Tracking**: Real-time complaint status updates

### Admin Features
- **Admin Dashboard**: Comprehensive overview of all complaints
- **Complaint Management**: Update status, assign handlers, add comments
- **User Management**: View user information and complaint history
- **Statistics**: Visual representation of complaint data
- **Search & Filter**: Advanced filtering and search capabilities

### Technical Features
- **Responsive Design**: Works on all devices
- **Real-time Updates**: Live status updates
- **Secure API**: JWT-based authentication
- **File Upload**: Multer integration for attachments
- **Role-based Access**: Different permissions for users and admins

## Technology Stack

### Frontend
- **React 18**: Modern React with hooks
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first styling
- **Axios**: HTTP client for API calls
- **Lucide React**: Beautiful icons

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **JWT**: Authentication tokens
- **bcryptjs**: Password hashing
- **Multer**: File upload handling
- **fs-extra**: File system operations

### Database
- **JSON File System**: Lightweight data storage (easily replaceable with MongoDB)
- **UUID**: Unique identifiers for records

## Project Structure

```
complaint-management-system/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React context providers
│   │   ├── pages/          # Page components
│   │   └── App.jsx         # Main App component
│   ├── package.json
│   └── vite.config.js
├── server/                 # Express backend
│   ├── data/              # JSON data files
│   ├── middleware/        # Custom middleware
│   ├── models/           # Data models
│   ├── routes/           # API routes
│   ├── uploads/          # File uploads
│   └── server.js         # Main server file
├── package.json
└── README.md
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd complaint-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd client && npm install
   cd ..
   ```

3. **Environment Setup**
   Create a `.env` file in the server directory:
   ```env
   PORT=5000
   JWT_SECRET=your-secret-key-here
   NODE_ENV=development
   ```

4. **Start the application**
   ```bash
   npm run dev
   ```

This will start both the backend server (port 5000) and frontend development server (port 3000).

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Complaints
- `GET /api/complaints/my` - Get user's complaints
- `GET /api/complaints/all` - Get all complaints (admin only)
- `POST /api/complaints` - Create new complaint
- `GET /api/complaints/:id` - Get complaint by ID
- `PATCH /api/complaints/:id` - Update complaint (admin only)
- `DELETE /api/complaints/:id` - Delete complaint (admin only)
- `GET /api/complaints/stats/overview` - Get complaint statistics

## Usage

### For Users
1. Register a new account or login
2. Submit complaints with title, description, and optional attachments
3. Track complaint status on your dashboard
4. View detailed complaint information

### For Admins
1. Login with admin credentials
2. Access the admin dashboard
3. View all complaints with filtering options
4. Update complaint status and add comments
5. Assign handlers to complaints
6. Monitor system statistics

### Demo Accounts
- **User**: `user@demo.com` / `password123`
- **Admin**: `admin@demo.com` / `admin123`

## Database Schema

### User Model
```javascript
{
  id: String,
  name: String,
  email: String,
  password: String (hashed),
  role: String (user/admin),
  createdAt: Date,
  updatedAt: Date
}
```

### Complaint Model
```javascript
{
  id: String,
  title: String,
  description: String,
  userId: String,
  status: String (pending/in-progress/resolved),
  category: String,
  adminComment: String,
  handlerName: String,
  attachment: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Role-based Access**: Different permissions for users and admins
- **Input Validation**: Server-side validation for all inputs
- **File Upload Security**: Restricted file types and size limits

## Future Enhancements

- **MongoDB Integration**: Replace JSON files with MongoDB
- **Email Notifications**: Send status updates via email
- **Advanced Search**: Full-text search capabilities
- **Audit Logs**: Track all system activities
- **Batch Operations**: Handle multiple complaints at once
- **Analytics Dashboard**: Advanced reporting and analytics

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please create an issue in the repository.