# Ultimate Backend

A comprehensive backend API built with Node.js, Express, and MongoDB for a video-sharing platform. This project provides robust user authentication, video management, commenting system, and more features to support a full-fledged video platform like YouTube.

## 🚀 Features

- **User Authentication & Authorization**
  - User registration and login with JWT tokens
  - Secure password hashing with bcrypt
  - Refresh token mechanism for session management
  - Profile management (avatar, cover image updates)

- **Video Management**
  - Video upload and storage (integrated with Cloudinary)
  - Video metadata handling
  - Watch history tracking

- **Social Features**
  - Commenting system on videos
  - Like/dislike functionality
  - User subscriptions
  - Playlists creation and management

- **Content Management**
  - Tweet-like short posts
  - Channel profiles for users
  - Comprehensive user dashboard

- **Security & Middleware**
  - CORS configuration
  - Cookie-based authentication
  - File upload handling with Multer
  - Input validation and error handling

## 🛠 Tech Stack

- **Backend Framework**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **File Storage**: Cloudinary for media uploads
- **Password Hashing**: bcrypt
- **Development Tools**: Nodemon for hot reloading, Prettier for code formatting

## 📁 Project Structure

```
ultimate_backend/
├── src/
│   ├── app.js                 # Express app configuration
│   ├── index.js               # Server entry point
│   ├── constants.js           # Application constants
│   ├── controllers/           # Route controllers
│   │   ├── user.controller.js
│   │   └── comment.controller.js
│   ├── db/
│   │   └── index.js           # Database connection
│   ├── middlewares/           # Custom middlewares
│   │   ├── auth.middlewares.js
│   │   └── multer.middlewares.js
│   ├── models/                # Mongoose models
│   │   ├── user.model.js
│   │   ├── video.model.js
│   │   ├── comment.model.js
│   │   ├── like.model.js
│   │   ├── playlist.model.js
│   │   ├── subscription.model.js
│   │   └── tweet.model.js
│   ├── routes/                # API routes
│   │   ├── user.router.js
│   │   └── comment.router.js
│   └── utils/                 # Utility functions
│       ├── ApiError.js
│       ├── ApiResponse.js
│       ├── asyncHandler.js
│       └── cloudinary.js
├── public/                    # Static files
├── package.json
└── README.md
```

## 🔧 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/ultimate_backend.git
   cd ultimate_backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory with the following variables:
   ```env
   PORT=8000
   MONGODB_URI=your_mongodb_connection_string
   CORS_ORIGIN=http://localhost:3000
   ACCESS_TOKEN_SECRET=your_access_token_secret
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   REFRESH_TOKEN_EXPIRY=10d
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:8000` (or the port specified in your `.env`).

## 📡 API Endpoints

### User Routes (`/api/v1/users`)

- `POST /register` - Register a new user
- `POST /login` - User login
- `POST /logout` - User logout (requires authentication)
- `POST /refresh-token` - Refresh access token
- `POST /change-password` - Change user password (requires authentication)
- `GET /current-user` - Get current user details (requires authentication)
- `PATCH /update-account-details` - Update account details (requires authentication)
- `PATCH /update-avatar` - Update user avatar (requires authentication)
- `PATCH /update-cover-image` - Update user cover image (requires authentication)
- `GET /c/:username` - Get user channel profile (requires authentication)
- `GET /watch-history` - Get user watch history (requires authentication)

### Comment Routes (`/api/v1/comment`)

- `GET /:videoId` - Get comments for a video (requires authentication)
- `POST /:videoId` - Add a comment to a video (requires authentication)

## 🧪 Testing

To run tests (if implemented):
```bash
npm test
```


## 👨‍💻 Author

**Animesh Khanra**

- GitHub: [animseh](https://github.com/animseh)
- LinkedIn: [LinkedIn Profile](https://www.linkedin.com/in/animesh-khanra-3041231b4/)

## 🙏 Acknowledgments

- Inspired by modern video-sharing platforms
- Built with love for backend development
- Special thanks to the open-source community

---

⭐ If you found this project helpful, please give it a star!