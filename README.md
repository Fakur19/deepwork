# DeepWork App

The DeepWork App is a productivity tool designed to help users focus on their tasks, track their work sessions, and compete with others on a leaderboard. It features user authentication, personal profiles, and public profiles for community interaction.

## Features

*   **User Authentication:** Secure registration and login.
*   **Focus Sessions:** Start and track deep work sessions for specific tasks.
*   **Session History:** View a personal history of completed work sessions.
*   **Leaderboard:** See top users based on their total focus duration.
*   **User Profiles:** Manage personal bio and profile pictures.
*   **Public Profiles:** View other users' profiles from the leaderboard.

## Technologies Used

**Frontend:**
*   React.js
*   React Router DOM
*   Axios (for API calls)
*   Bootstrap (for styling)

**Backend:**
*   Node.js
*   Express.js
*   MongoDB (via Mongoose)
*   JWT (JSON Web Tokens) for authentication
*   Bcrypt.js (for password hashing)
*   CORS
*   Dotenv (for environment variables)
*   Multer (for file uploads)

## Getting Started (Local Development)

Follow these steps to set up and run the DeepWork App on your local machine.

### Prerequisites

*   Node.js (LTS version recommended)
*   npm (comes with Node.js)
*   MongoDB (ensure your cloud MongoDB instance is accessible from your local machine, or set up a local MongoDB instance)

### 1. Clone the Repository

First, navigate to your desired directory and clone the project:

```bash
git clone <your-repository-url>
cd deepwork-app
```

### 2. Install Dependencies

Navigate into the `client` and `server` directories and install their respective dependencies:

```bash
# Install client dependencies
cd client
npm install
cd ..

# Install server dependencies
cd server
npm install
cd ..
```

### 3. Set Up Environment Variables

Create `.env` files in both the `client` and `server` directories. These files will store your local environment configurations.

*   **`deepwork-app/client/.env`**:
    ```
    REACT_APP_API_URL=http://localhost:5000
    ```

*   **`deepwork-app/server/.env`**:
    ```
    PORT=5000
    MONGO_URI=your_cloud_mongodb_connection_string_here # Replace with your actual cloud MongoDB URI
    JWT_SECRET=your_local_jwt_secret_key               # Replace with a strong, random secret for local JWTs
    CLIENT_ORIGIN=http://localhost:3000
    ```
    **Important:** Replace `your_cloud_mongodb_connection_string_here` with the connection string from your MongoDB cloud provider (e.g., MongoDB Atlas). Also, ensure your MongoDB cloud provider has whitelisted your local IP address for connections.

### 4. Run the Backend Server

Navigate to the `server` directory and start the Node.js server:

```bash
cd server
npm start
```
The server should start on `http://localhost:5000`.

### 5. Run the Frontend Development Server

Open a **new terminal window**, navigate to the `client` directory, and start the React development server:

```bash
cd client
npm start
```
The client application should open in your browser, typically at `http://localhost:3000`.

## Deployment to Render.com

The DeepWork App is configured for deployment on Render.com as two separate services: a Web Service for the backend and a Static Site for the frontend.

### Backend (Web Service) Configuration

*   **Service Type:** Web Service
*   **Build Command:** `npm install`
*   **Start Command:** `npm start`
*   **Environment Variables (set on Render dashboard):**
    *   `PORT`: (Render automatically sets this)
    *   `MONGO_URI`: Your **production** MongoDB connection string.
    *   `JWT_SECRET`: A **production-grade**, strong, random string for JWTs.
    *   `CLIENT_ORIGIN`: The URL of your deployed frontend (e.g., `https://your-frontend-name.onrender.com`).

### Frontend (Static Site) Configuration

*   **Service Type:** Static Site
*   **Build Command:** `npm install && npm run build`
*   **Publish Directory:** `build`
*   **Environment Variables (set on Render dashboard):**
    *   `REACT_APP_API_URL`: The URL of your deployed backend (e.g., `https://your-backend-name.onrender.com`).

### Important Deployment Notes

*   **Ephemeral Storage:** The current file upload mechanism saves profile pictures to the server's local disk (`./uploads/`). On Render.com, this storage is ephemeral and will be lost upon server restarts or redeployments. For persistent file storage, consider integrating with a cloud storage service (e.g., AWS S3, Cloudinary).
*   **CORS:** The backend's CORS configuration uses `CLIENT_ORIGIN` to allow requests from your frontend. Ensure this environment variable is correctly set on Render.com.
*   **MongoDB IP Whitelisting:** Double-check that your MongoDB cloud provider allows connections from Render's IP addresses.

