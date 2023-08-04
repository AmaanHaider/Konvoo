# KONVOO App API Documentation

Welcome to konvoo, a social media-like application built with Node.js, Express, and MongoDB. konvoo allows users to create posts, like, reply, and follow other users, fostering a sense of community and connection.
## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed on your machine:

- Node.js: [Download and Install Node.js](https://nodejs.org/)
- MongoDB: [Download and Install MongoDB](https://www.mongodb.com/try/download/community)

### Installation

1. Clone the repository:

git clone https://github.com/your-username/konvoo-app.git 
cd konvoo-app
npm install

### Configuration
MONGODB_URL=mongodb://localhost:27017/konvoo
JWT_SECRET=your_secret_key_here
PORT=3000

### Usage

npm start



### API Documentation
1-Access the application in your browser or API client at http://localhost:3000.
2-Alternatively, you can also access the hosted version of the application at 
https://konvoo.vercel.app/.


## User Routes

| Route                           | Purpose                               | HTTP Method | Request Body                                                  | Authentication Required |
|---------------------------------|---------------------------------------|-------------|---------------------------------------------------------------|-------------------------|
| `/api/users/signup`             | User registration                    | POST        | `name`, `email`, `username`, `password`                       | No                      |
| `/api/users/login`              | User login                           | POST        | `username`, `password`                                       | No                      |
| `/api/users/logout`             | User logout                          | POST        | None                                                          | Yes                     |
| `/api/users/profile/:username`  | Get user profile                     | GET         | None                                                          | Yes                     |
| `/api/users/follow/:id`         | Follow/unfollow another user         | POST        | None                                                          | Yes                     |
| `/api/users/update/:id`         | Update user profile                  | POST        | `name`, `email`, `username`, `password`, `profilePic`, `bio`  | Yes                     |

## Post Routes

| Route                           | Purpose                               | HTTP Method | Request Body                                                  | Authentication Required |
|---------------------------------|---------------------------------------|-------------|---------------------------------------------------------------|-------------------------|
| `/api/posts/create`             | Create a new post                    | POST        | `text`, `img`                                                | Yes                     |
| `/api/posts/:id`                | Get a specific post                  | GET         | None                                                          | Yes                     |
| `/api/posts/feed`               | Get feed posts (from followed users)  | GET         | None                                                          | Yes                     |
| `/api/posts/like/:id`           | Like/unlike a post                   | POST        | None                                                          | Yes                     |
| `/api/posts/reply/:id`          | Reply to a post                      | POST        | `text`                                                        | Yes                     |
| `/api/posts/:id`                | Delete a post                        | DELETE      | None                                                          | Yes                     |

Please note:

- **Authentication Required**: Indicates whether the route requires the user to be authenticated (logged in) before accessing it.
- **Request Body**: Lists the required data that should be included in the request body for each API call.
- The HTTP methods (`POST`, `GET`, `DELETE`) correspond to the actions being performed on the routes.

Make sure to handle error cases, data validation, and input sanitization properly in your actual implementation.

Feel free to refer to the code and the documentation above for more details on each route's functionality.
