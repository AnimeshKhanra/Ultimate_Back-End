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
│   │   ├── comment.controller.js
│   │   ├── dashboard.controller.js
│   │   ├── healthcheck.controller.js
│   │   ├── like.controller.js
│   │   ├── playlist.controller.js
│   │   ├── subscription.controller.js
│   │   ├── tweet.controller.js
│   │   ├── user.controller.js
│   │   └── video.controller.js
│   ├── db/
│   │   └── index.js           # Database connection
│   ├── middlewares/           # Custom middlewares
│   │   ├── auth.middlewares.js
│   │   └── multer.middlewares.js
│   ├── models/                # Mongoose models
│   │   ├── comment.model.js
│   │   ├── like.model.js
│   │   ├── playlist.model.js
│   │   ├── subscription.model.js
│   │   ├── tweet.model.js
│   │   ├── user.model.js
│   │   └── video.model.js
│   ├── routes/                # API routes
│   │   ├── comment.routes.js
│   │   ├── dashboard.routes.js
│   │   ├── healthcheck.routes.js
│   │   ├── like.routes.js
│   │   ├── playlist.routes.js
│   │   ├── subscription.routes.js
│   │   ├── tweet.routes.js
│   │   ├── user.routes.js
│   │   └── video.routes.js
│   └── utils/                 # Utility functions
│       ├── ApiError.js
│       ├── ApiResponse.js
│       ├── asyncHandler.js
│       └── cloudinary.js
├── public/                    # Static files
│   └── temp/                  # Temporary files
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

### User Routes
Base path: `/api/v1/users`

| HTTP Method | Path | Auth Required | Description |
|------------|------|---------------|-------------|
| POST | `/register` | ❌ | Register a new user with avatar and cover image |
| POST | `/login` | ❌ | Login user |
| POST | `/logout` | ✅ | Logout user |
| POST | `/refresh-token` | ❌ | Refresh access token |
| POST | `/change-password` | ✅ | Change current password |
| GET | `/current-user` | ✅ | Get current logged-in user |
| PATCH | `/update-account-details` | ✅ | Update account details |
| PATCH | `/update-avatar` | ✅ | Update user avatar |
| PATCH | `/update-cover-image` | ✅ | Update user cover image |
| GET | `/c/:username` | ✅ | Get user channel profile |
| GET | `/watch-history` | ✅ | Get user watch history |

### Video Routes
Base path: `/api/v1/videos` | *All require authentication*

| HTTP Method | Path | Description |
|------------|------|-------------|
| GET | `/` | Get all videos |
| POST | `/` | Publish a new video |
| GET | `/:videoId` | Get video by ID |
| DELETE | `/:videoId` | Delete video |
| PATCH | `/:videoId` | Update video details |
| PATCH | `/toggle/publish/:videoId` | Toggle video publish status |

### Tweet Routes
Base path: `/api/v1/tweets` | *All require authentication*

| HTTP Method | Path | Description |
|------------|------|-------------|
| POST | `/` | Create a new tweet |
| GET | `/user/:userId` | Get user's tweets |
| PATCH | `/:tweetId` | Update tweet |
| DELETE | `/:tweetId` | Delete tweet |

### Comment Routes
Base path: `/api/v1/comments` | *All require authentication*

| HTTP Method | Path | Description |
|------------|------|-------------|
| GET | `/:videoId` | Get video comments |
| POST | `/:videoId` | Add comment to video |
| PATCH | `/c/:commentId` | Update comment |
| DELETE | `/c/:commentId` | Delete comment |

### Like Routes
Base path: `/api/v1/likes` | *All require authentication*

| HTTP Method | Path | Description |
|------------|------|-------------|
| POST | `/toggle/v/:videoId` | Toggle like on video |
| POST | `/toggle/c/:commentId` | Toggle like on comment |
| POST | `/toggle/t/:tweetId` | Toggle like on tweet |
| GET | `/videos` | Get all liked videos |

### Playlist Routes
Base path: `/api/v1/playlists` | *All require authentication*

| HTTP Method | Path | Description |
|------------|------|-------------|
| POST | `/` | Create a new playlist |
| GET | `/:playlistId` | Get playlist by ID |
| PATCH | `/:playlistId` | Update playlist |
| DELETE | `/:playlistId` | Delete playlist |
| PATCH | `/:playlistId/add/:videoId` | Add video to playlist |
| PATCH | `/:playlistId/remove/:videoId` | Remove video from playlist |
| GET | `/user/:userId` | Get user's playlists |

### Subscription Routes
Base path: `/api/v1/subscriptions` | *All require authentication*

| HTTP Method | Path | Description |
|------------|------|-------------|
| POST | `/c/:channelId` | Toggle subscription to channel |
| GET | `/c/:channelId` | Get channel subscribers |
| GET | `/u/:subscriberId` | Get subscribed channels for user |

### Dashboard Routes
Base path: `/api/v1/dashboards` | *All require authentication*

| HTTP Method | Path | Description |
|------------|------|-------------|
| GET | `/stats` | Get channel statistics |
| GET | `/videos` | Get channel videos |

### Healthcheck Routes
Base path: `/api/v1/healthcheck` | *All require authentication*

| HTTP Method | Path | Description |
|------------|------|-------------|
| GET | `/` | Health check endpoint |

## 🧪 Testing

To run tests (if implemented):
```bash
npm test
```


## 👨‍💻 Author

**Animesh Khanra**

- GitHub: [Animseh](https://github.com/AnimeshKhanra)
- LinkedIn: [LinkedIn Profile](https://www.linkedin.com/in/animesh-khanra-3041231b4/)

## 🙏 Acknowledgments

- Inspired by modern video-sharing platforms
- Built with love for backend development
- Special thanks to the open-source community

---

⭐ If you found this project helpful, please give it a star!