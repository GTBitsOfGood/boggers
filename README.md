# Boggers
Boggers is a nickname for Bits of Good member management portal. Boggers was created to help the club leadership to get relevant information about the members fast. 

Besides the usual names, major, year, etc, Boggers can also...
- Allow members to keep track of their technical preferences (e.g. frontend, backend, fullstack, etc.)
- Allow EMs, Designers, and PMs to keep record of the member's contribution and see their past contribution easily

Boggers is still growing and we hope to add many new features to facilitate club logistics!

## Important Links and Information for Contribution
- [Figma](https://www.figma.com/file/DCNuHaQO59vK4FD3xbRfMS/Boggers-%2F-Fall22?node-id=2%3A4&t=9zbqfsiumcyXkIxW-0)
- `.env` located in Development Bitwarden (ask your EM or Director of Engineering for cred!)

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

## Deployment

For more information about Deployment and Vercel, <a href="https://www.notion.so/gtbitsofgood/General-Deployment-Pointers-Vercel-763e769ef0074ff8b12c85c3d4809ba9">check out this guide.</a>
