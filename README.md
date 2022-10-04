# boggers

## Getting Started

Run the development server:

```bash
yarn dev
```

## Scripts

In order to run scripts, "next dev" must be running.

Scripts:
- seed: creates root user

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
- Copy the contents of `example.env.local` into a new file `.env.local` to establish environment variable for the MongoDB connection.
- Remember to never commit shared environment variables to your version control.

## Deployment

For more information about Deployment and Vercel, <a href="https://www.notion.so/gtbitsofgood/General-Deployment-Pointers-Vercel-763e769ef0074ff8b12c85c3d4809ba9">check out this guide.</a>