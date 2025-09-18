# NotePad Pro - Full Stack Web Application

A modern, responsive full-stack note-taking application built with React, TypeScript, Node.js, and MongoDB. Features user authentication, intelligent pagination with caching, and a clean, professional UI.


##  Features

###  Authentication & Authorization

- **User Registration**: Create new accounts with secure password hashing (bcrypt)
- **JWT Authentication**: Secure login system with JSON Web Tokens
- **Role-based Access**: Only authenticated users can create, edit, and delete notes
- **Guest Access**: Anonymous users can browse notes in read-only mode

###  Notes Management

- **CRUD Operations**: Create, read, update, and delete notes
- **Author Attribution**: Notes display author information and ownership
- **Permission-based UI**: Edit/delete buttons only visible to note owners
- **Rich Content**: Support for multi-line text content

###  Performance & UX

- **Smart Pagination**: Custom-built pagination component (no external libraries)
- **Intelligent Caching**: Pre-fetches 5 pages for instant navigation
- **Optimistic Updates**: Minimal API calls through strategic caching
- **Responsive Design**: Mobile-first, works on all device sizes


##  Tech Stack

### Frontend

- **React 19** - Modern UI library with hooks and context
- **TypeScript** - Type-safe JavaScript
- **React Router DOM** - Client-side routing
- **Vite** - Fast build tool and dev server
- **Axios** - HTTP client for API communication
- **CSS3** - Custom styling with responsive design

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe server-side code
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT implementation
- **CORS** - Cross-origin resource sharing

### Testing & Development

- **Playwright** - End-to-end testing framework
- **Jest** - JavaScript testing framework
- **Supertest** - HTTP assertion library
- **ESLint** - Code linting and formatting
- **Nodemon** - Development server auto-restart

##  Architecture

### Frontend Architecture

```
src/
├── components/          # Reusable UI components
│   ├── Note.tsx        # Individual note display
│   └── Pagination.tsx  # Custom pagination component
├── contexts/           # React Context providers
│   ├── AuthContext.tsx # Authentication state management
│   └── NotesContext.tsx # Notes state and caching
├── pages/              # Route components
│   ├── HomePage.tsx    # Main notes feed
│   ├── LoginPage.tsx   # User authentication
│   └── CreateUserPage.tsx # User registration
└── services/           # API communication & utilities
    ├── notesService.ts # Notes API calls
    ├── cacheService.ts # Intelligent caching logic
    └── errorService.ts # Error handling utilities
```

### Backend Architecture

```
backend/
├── controllers/        # Request handlers
├── models/            # Database schemas
├── routes/            # API endpoints
├── middlewares/       # Auth, logging, error handling
├── services/          # Business logic
└── tests/             # API tests
```

### Database Schema

**Notes Collection:**

```typescript
{
  title: string;
  content: string;
  author: {
    name: string;
    email: string;
  } | null;
  user: ObjectId; // Reference to User
}
```

**Users Collection:**

```typescript
{
  name: string;
  email: string;
  username: string;
  passwordHash: string;
}
```

##  Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB instance (local or cloud)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone [your-repo-url]
   cd notes-app
   ```

2. **Install backend dependencies**

   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**

   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Setup**

   Create a `.env` file in the backend directory:

   ```env
   MONGODB_URI=mongodb://localhost:27017/notesapp
   JWT_SECRET=your-super-secure-jwt-secret
   PORT=3001
   ```

### Running the Application

1. **Start the backend server**

   ```bash
   cd backend
   npm run dev
   ```

   Server runs on `http://localhost:3001`

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```
   Application runs on `http://localhost:3000`

### Testing

**Frontend E2E Tests:**

```bash
cd frontend
npm test
```

**Backend Unit Tests:**

```bash
cd backend
npm test
```

##  API Documentation

### Authentication Endpoints

- `POST /api/users` - Register new user
- `POST /api/login` - User login

### Notes Endpoints

- `GET /api/notes` - Get paginated notes
- `POST /api/notes` - Create new note (authenticated)
- `PUT /api/notes/:id` - Update note (authenticated, owner only)
- `DELETE /api/notes/:id` - Delete note (authenticated, owner only)

##  Key Implementation Highlights

### 1. Intelligent Caching System

- Pre-fetches 5 pages based on current pagination window
- Minimizes API calls during navigation
- Background updates for seamless user experience

### 2. Security Best Practices

- Password hashing with bcrypt
- JWT-based authentication
- Protected routes and API endpoints
- Input validation and sanitization

### 3. Performance Optimizations

- Custom pagination component
- Efficient state management with React Context
- Optimistic UI updates
- Responsive design patterns

