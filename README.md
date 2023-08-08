# Full-Stack MERN Template

![MERN Logo](https://your-image-url.com)

Welcome to the Full-Stack MERN Template! This repository serves as a starting point for building modern web applications using the MERN stack (MongoDB, Express, React, Node.js). Whether you're a beginner looking to learn MERN or an experienced developer who wants to kickstart a new project, this template provides you with a solid foundation to begin with.

## Features

- Full-featured backend with Node.js and Express.
- Robust frontend with React and Redux for state management.
- User authentication and authorization using JSON Web Tokens (JWT).
- MongoDB for scalable and flexible database management.
- Bootstrap for responsive and mobile-friendly UI design.
- RESTful API design to communicate between frontend and backend.

## Prerequisites

Before you begin, ensure you have the following software installed on your system:

- Node.js (version 12 or above)
- npm (Node Package Manager)
- MongoDB (Make sure MongoDB is installed and running locally or provide a remote connection URI)

## Getting Started

To get started with this template, follow these steps:

1. Clone the repository:

```
git clone https://github.com/lylest/template.git
```

2. Install backend dependencies:

```
cd template/backend
npm install
```

3. Set up your environment variables:

   Create a `.env` file in the `backend` folder and define the following variables:

```
PORT=5000
MONGODB_URI=your-mongodb-connection-uri
SECRET_KEY=your-secret-key-for-jwt
```

4. Run the backend server:

```
npm start
```

5. Install frontend dependencies:

```
cd ../frontend
npm install
```

6. Run the frontend development server:

```
npm start
```

Your application should now be up and running! Access it by visiting `http://localhost:3000` in your web browser.

## Folder Structure

The template follows a common MERN folder structure:

- `backend`: Contains all the backend code.
- `frontend`: Contains all the frontend code.

## Backend Dependencies (package.json)

Here is the `package.json` for the backend:

```json
{
  "name": "mern-template-backend",
  "version": "1.0.0",
  "description": "Backend for the Full-Stack MERN Template",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "keywords": ["mern", "template", "backend"],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cookie-parser": "^1.4.6",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.1",
    "mongoose": "^7.4.0",
    "nodemon": "^3.0.1",
    "yup": "^1.2.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.15"
  }
}
```

## Frontend Dependencies (package.json)

Here is the `package.json` for the frontend:

```json
{
  "name": "mern-template-frontend",
  "version": "1.0.0",
  "description": "Frontend for the Full-Stack MERN Template",
  "main": "index.js",
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "keywords": ["mern", "template", "frontend"],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "date-fns": "^2.30.0",
    "primeflex": "^3.3.1",
    "primeicons": "^6.0.1",
    "primereact": "^9.6.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hot-toast": "^2.4.1",
    "react-icons": "^4.10.1",
    "react-router-dom": "^6.14.2"
  }
}
```

## Backend Scripts

- **start**: `node index.js`
  - Start the backend server in production mode.
  
- **dev**: `nodemon index.js`
  - Start the backend server using nodemon in development mode, which automatically restarts the server when changes are made to the files.

## Frontend Scripts

- **start**: `react-scripts start`
  - Start the frontend development server.
  
- **build**: `react-scripts build`
  - Build the production-ready frontend application.
  
- **test**: `react-scripts test`
  - Run tests in the frontend application.
  
- **eject**: `react-scripts eject`
  - Eject from the Create React App configuration, allowing customization of webpack and other build tools.

## Contribution

Feel free to contribute to this template by creating issues, submitting pull requests, or suggesting improvements. Let's make this template better together!

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Thank you for using the Full-Stack MERN Template. Happy coding! 🚀 If you have any questions or need further assistance, don't hesitate to reach out.
