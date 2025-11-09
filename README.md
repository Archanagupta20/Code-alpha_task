# Mini Social Media App

A small full-stack social media demo using Express, MongoDB, and vanilla JS.

## Features
- Register / Login (JWT)
- Create posts
- Like / Unlike posts
- Simple frontend using fetch API

## Setup

1. Install dependencies:
```
npm install
```

2. Create `.env` file (see `.env.example`):
```
MONGO_URI=mongodb://localhost:27017/social_app
JWT_SECRET=your_jwt_secret
PORT=4000
```

3. Run MongoDB locally (or use MongoDB Atlas).

4. Start server:
```
npm run dev
```

5. Open `http://localhost:4000` in your browser.

## Notes
This is a minimal demo. For production use:
- Validate inputs thoroughly
- Add rate-limiting, input sanitization
- Use HTTPS and secure cookies or refresh-token strategy
- Add file uploads, comments, follows, pagination, and tests
