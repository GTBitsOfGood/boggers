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

### Run With Docker

1. Install [Docker](https://docs.docker.com/engine/install/)
2. Obtain the Bitwarden password from your EM. Create a `bitwarden.env` file and fill it in with the following contents:
   ```
   BW_PASSWORD=<your bitwarden password>
   ```
   This only needs to be done on your first run. After that, you should delete the file from your repository to avoid pushing it to Github.
3. Start the application with Docker Compose: `docker compose up`

If you make any changes to the packages, you may need to rebuild the images. To do this, append --build to the above docker compose up command.

The Dockerized application will have live-reloading of changes made on the host machine.

Note: On linux-based operating systems, if you come across an entrypoint permission error (i.e. `process: exec: "./entrypoint.sh": permission denied: unknown`), run `chmod +x ./entrypoint.sh` to make the shell file an executable.

### Run the development server:

```bash
yarn dev
```

## Scripts

In order to run scripts, "next dev" must be running.

Scripts:

- seed: creates root user

## Deployment

For more information about Deployment and Vercel, <a href="https://www.notion.so/gtbitsofgood/General-Deployment-Pointers-Vercel-763e769ef0074ff8b12c85c3d4809ba9">check out this guide.</a>
