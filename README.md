# boggers

## Getting Started

Run the development server:

```bash
yarn dev
```

## MongoDB

A running instance of MongoDB is required this project.

- Locally (Docker - RECOMMENDED)
  1. [Download Docker Desktop](https://www.docker.com/products/docker-desktop)
  2. Run `docker run --name mongodb -d -p 27017:27017 mongo` in your terminal
  3. Open Docker Desktop and confirm that your MongoDB image is running. It should exist on port 27017, and can be accessed.
- Locally (Non-Docker)
  1. [Download MongoDB Community Server](https://www.mongodb.com/download-center/community)
  2. Go through the installation instructions.
     - Leave the port at default 27017
- Remember to never commit shared environment variables to your version control.
