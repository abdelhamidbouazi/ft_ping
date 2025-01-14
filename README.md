# ft_transcendence

ft_transcendence is the final project in the common core curriculum at 42 (1337 Morocco). It is a full-stack web application designed to showcase our understanding of modern web development tools, technologies, and collaborative skills.

## Project Overview

**Name:** BeyondSphere

This project includes a rich feature set such as real-time chat, user authentication, and multiplayer functionality. The chat system supports direct messaging and channels and was designed with scalability and responsiveness in mind. 

## Tech Stack

### Frontend
- **Next.js**: React framework for building performant and scalable web applications.
- **TypeScript**: Superset of JavaScript ensuring type safety.
- **SWR**: Data-fetching library for managing server state.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Socket.IO**: Real-time communication for instant messaging.
- **Axios**: Promise-based HTTP client for API requests.
- **NextUI**: Pre-styled UI components for faster development.

### Backend
- **NestJS**: Framework for building efficient, reliable, and scalable server-side applications.
- **PostgreSQL**: Relational database for managing application data.
- **TypeORM**: ORM for database interactions and migrations.

### Deployment
- **Docker**: Containerization for consistent development and deployment environments.
- **NGINX**: Reverse proxy and load balancing for serving the application efficiently.

## Key Features

### Chat System
- **Direct Messages**: One-on-one messaging between users.
- **Channels**: Public and private group conversations.
- **Real-Time Updates**: Powered by Socket.IO for instant communication.
- **Enhanced Integration**: SWR for optimized data fetching throughout the application.

### User Settings
- **Profile Management**: Update user information such as username and avatar.
- **Privacy Settings**: Configure visibility and communication preferences.

### Authentication
- Secure user authentication with support for OAuth.

### Multiplayer Gameplay (if applicable)
- Real-time multiplayer games with live updates and scores.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ft_transcendence.git
   ```

2. Navigate to the project directory:
   ```bash
   cd ft_transcendence
   ```

3. Install dependencies for both frontend and backend:
   ```bash
   # Frontend
   cd frontend
   npm install

   # Backend
   cd backend
   npm install
   ```

4. Configure environment variables for both frontend and backend based on the `.env.example` files provided.

5. Set up Docker and NGINX:
   - Build and start the Docker containers:
     ```bash
     docker-compose up --build
     ```
   - Ensure NGINX configuration is correctly set up in the `nginx.conf` file.

6. Access the application:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend: [http://localhost:5000](http://localhost:5000)

## Lessons Learned

Working on ft_transcendence has been a tremendous learning experience. Key takeaways include:
- Mastery of real-time features using Socket.IO.
- Efficient data management with SWR.
- Team collaboration and effective project management.
- Deep understanding of TypeScript and full-stack development workflows.
- Deployment and scaling using Docker and NGINX.

## Contributors
- [Your Name] - Frontend Development (Chat System, SWR Integration, Docker & NGINX Setup)
- [Teammate 1] - Backend Development
- [Teammate 2] - Backend Development

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.
