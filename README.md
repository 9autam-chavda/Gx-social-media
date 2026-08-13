# GX Social

<div align="center">

### A modern full-stack social media platform built for sharing, discovery, and real-time connection.

Built with **React, Node.js, Express, MongoDB, and Socket.IO** with a focus on clean architecture, responsive UX, real-time communication, and scalable API design.

<br />

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Real--Time-010101?logo=socket.io&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue.svg)

</div>

---

## Overview

**GX Social** is a full-stack social media web application designed around the core experience of modern social platforms.

Users can create and discover content, build connections, interact with posts, manage their profiles, receive notifications, and communicate through real-time one-to-one messaging.

The project uses a separated frontend and backend architecture connected through REST APIs and Socket.IO.

### Core Focus

- Clean and responsive user experience
- Secure authentication and authorization
- Modular REST API architecture
- Real-time communication
- Media upload and delivery
- Social graph functionality
- Scalable project structure
- Production-ready deployment architecture

---

# Features

## Authentication

- User registration
- Secure login
- JWT-based authentication
- Protected API routes
- Password hashing with bcrypt
- Persistent authentication sessions
- Logout support
- Password reset flow

## User Profiles

- User profiles
- Profile picture
- Cover image
- Bio and profile information
- Followers and following counts
- Profile editing
- User-specific content

## Posts

- Create posts
- Image uploads
- Captions
- Like / unlike posts
- Delete own posts
- Paginated feed
- Comments
- Replies
- Saved posts
- Social interactions

## Social Graph

- Follow users
- Unfollow users
- Followers / following relationships
- User discovery
- User search
- Social connections

## Feed & Explore

- Personalized feed
- Paginated feed loading
- Explore section
- Visual content discovery
- Responsive explore layout
- User and content discovery

## Real-Time Messaging

- One-to-one conversations
- Real-time message delivery
- Socket.IO integration
- Online / offline presence
- Conversation management
- Message persistence
- Real-time conversation updates

## Notifications

- Follow notifications
- Like notifications
- Comment notifications
- Real-time notification updates

## Media

- Image uploads
- Profile media
- Post media
- ImageKit integration
- Cloud-based media delivery

---

# Architecture

GX Social follows a **decoupled full-stack architecture**.

```text
                         GX SOCIAL
                             │
             ┌───────────────┴───────────────┐
             │                               │
             ▼                               ▼
       React Frontend                  Node.js Backend
          Vite                         Express.js
             │                               │
             │ REST API                      │
             └──────────────────────────────►│
                                             │
                              ┌──────────────┼──────────────┐
                              │              │              │
                              ▼              ▼              ▼
                           MongoDB        ImageKit       Socket.IO
                           Atlas           Media          Real-Time
                              │
                              ▼
                            Data
```

---

# Production Architecture

```text
                 ┌─────────────────────┐
                 │       Vercel        │
                 │   React Frontend    │
                 └──────────┬──────────┘
                            │
                           HTTPS
                            │
                            ▼
                 ┌─────────────────────┐
                 │       Render        │
                 │  Node + Express API │
                 │      Socket.IO      │
                 └──────┬───────┬──────┘
                        │       │
              ┌─────────┘       └─────────┐
              ▼                           ▼
       ┌─────────────┐              ┌─────────────┐
       │ MongoDB     │              │   ImageKit  │
       │   Atlas     │              │    Media    │
       └─────────────┘              └─────────────┘
```

---

# Tech Stack

## Frontend

| Technology | Purpose |
|---|---|
| React 19 | UI development |
| Vite | Development and build tooling |
| React Router | Client-side routing |
| Tailwind CSS | UI styling |
| Axios | API communication |
| Context API | Application state |
| React Icons | Interface icons |
| Socket.IO Client | Real-time communication |
| React Masonry CSS | Explore layout |

## Backend

| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | REST API |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcryptjs | Password hashing |
| Multer | File handling |
| ImageKit | Media storage |
| Socket.IO | Real-time communication |
| CORS | Cross-origin configuration |

## Infrastructure

| Service | Purpose |
|---|---|
| Vercel | Frontend deployment |
| Render | Backend deployment |
| MongoDB Atlas | Cloud database |
| ImageKit | Cloud media storage |
| GitHub | Version control |

---

# Project Structure

```text
GX-SOCIAL-MEDIA/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── api/
│   │   └── ...
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── socket/
│   │   └── utils/
│   ├── server.js
│   └── package.json
│
├── .gitignore
├── package.json
└── README.md
```

---

# API Structure

The backend exposes modular REST endpoints under `/api`.

```text
/api
│
├── /auth
│   ├── register
│   ├── login
│   └── profile
│
├── /posts
├── /users
├── /feed
│   └── /explore
├── /comments
├── /replies
├── /search
├── /conversations
├── /messages
└── /notifications
```

Protected endpoints use JWT bearer authentication.

```http
Authorization: Bearer <token>
```

---

# Getting Started

## Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- Git
- MongoDB Atlas account
- ImageKit account

## 1. Clone the Repository

```bash
git clone https://github.com/9autam-chavda/Gx-social-media.git
cd Gx-social-media
```

## 2. Install Backend Dependencies

```bash
cd server
npm install
```

## 3. Configure Backend Environment

Create:

```text
server/.env
```

Add:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_strong_jwt_secret
JWT_EXPIRE=7d

CLIENT_URL=http://localhost:5173

IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

> Never commit `.env` files or private credentials to GitHub.

## 4. Install Frontend Dependencies

From the project root:

```bash
cd client
npm install
```

## 5. Configure Frontend Environment

Create:

```text
client/.env.local
```

For local development:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

For production, configure these values through the deployment platform.

## 6. Run the Backend

```bash
cd server
node server.js
```

The backend will run on:

```text
http://localhost:5000
```

## 7. Run the Frontend

Open another terminal:

```bash
cd client
npm run dev
```

The frontend will run on:

```text
http://localhost:5173
```

---

# Production Deployment

GX Social uses a separated production architecture.

### Frontend

```text
Vercel
React + Vite
```

### Backend

```text
Render
Node.js + Express + Socket.IO
```

### Database

```text
MongoDB Atlas
```

### Media Storage

```text
ImageKit
```

The frontend communicates with the backend through HTTPS REST APIs, while Socket.IO provides real-time communication.

---

# Live Application

## Frontend

https://gx-sandy-one.vercel.app

## Backend API

https://gx-social-backend.onrender.com

---

# Engineering Highlights

## Modular Backend Architecture

The backend separates HTTP handling, business logic, and database operations.

```text
Routes
   │
   ▼
Controllers
   │
   ▼
Services
   │
   ▼
Models
   │
   ▼
MongoDB
```

This structure keeps the application modular and easier to maintain.

## Authentication Flow

```text
User Login
    │
    ▼
Auth Controller
    │
    ▼
Credential Validation
    │
    ▼
JWT Generation
    │
    ▼
Client Storage
    │
    ▼
Authorization Header
    │
    ▼
Protected Middleware
    │
    ▼
Protected API
```

Passwords are hashed using bcrypt before being stored.

## Real-Time Communication

Socket.IO is used for:

- Instant messaging
- Online presence
- Conversation updates
- Real-time events

The application authenticates Socket.IO connections using JWT credentials.

## Media Management

ImageKit handles cloud-based media storage and delivery, keeping large media files outside MongoDB.

---

# Security

The application includes several security-oriented practices:

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Authorization middleware
- User ownership validation
- Environment-based secrets
- CORS configuration
- Secure media handling
- Input validation
- Separation of frontend and backend credentials

---

# Performance

The application considers performance through:

- Paginated API responses
- Efficient API communication
- Reusable React components
- Cloud-based image delivery
- Modular state management
- Optimized database queries
- Socket.IO for real-time communication
- Production builds through Vite

---

# Development Principles

GX Social was developed around several practical engineering principles.

### Separation of Concerns

Frontend UI, API logic, business logic, and database operations remain separated.

### Reusable Components

Common UI and API functionality is organized into reusable components and services.

### API-Driven Architecture

The frontend communicates with the backend through structured REST APIs rather than directly accessing the database.

### Real-Time Architecture

Socket.IO is used where immediate communication is required instead of repeatedly polling the backend.

### Environment-Based Configuration

Secrets, database credentials, API URLs, and deployment configuration are handled through environment variables.

---

# Roadmap

Future improvements may include:

- [ ] Stories
- [ ] Reels / short-form video
- [ ] Video uploads
- [ ] Group conversations
- [ ] Voice messages
- [ ] Push notifications
- [ ] Advanced post analytics
- [ ] AI-powered captions
- [ ] AI content moderation
- [ ] Admin dashboard
- [ ] Advanced recommendation system
- [ ] Improved content ranking
- [ ] Advanced privacy controls

---

# Project Goals

This project was created to gain practical experience with modern full-stack development and demonstrate concepts such as:

- React application development
- REST API design
- JWT authentication
- Authorization
- MongoDB data modeling
- Cloud media management
- Real-time web applications
- Social graph implementation
- WebSocket communication
- Responsive UI development
- Production deployment
- Frontend/backend architecture

---

# Contributing

Contributions and suggestions are welcome.

### Create a Feature Branch

```bash
git checkout -b feature/your-feature
```

### Make Your Changes

Implement and test your changes locally.

### Commit

```bash
git commit -m "feat: add your feature"
```

### Push

```bash
git push origin feature/your-feature
```

Then open a Pull Request.

---

# License

This project is licensed under the **MIT License**.

See the `LICENSE` file for more information.

---

# Author

<div align="center">

## Gautam Chavda

**IT Engineering Student · Full-Stack Developer · Java & DSA Enthusiast**

Building projects with:

**React · Node.js · Java · DSA · AI/ML**

</div>

---

<div align="center">

## GX Social

### Share. Discover. Connect.

⭐ If you found this project interesting, consider giving the repository a star.

Made with ❤️ by **Gautam Chavda**

</div>
