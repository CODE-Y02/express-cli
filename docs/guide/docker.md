# Docker Integration

`create-express-forge` provides a production-ready Docker setup out of the box.

## Files Generated

1.  **Dockerfile**: A multi-stage build that keeps your production image small and secure.
2.  **docker-compose.yml**: Orchestrates your application and database services.
3.  **.dockerignore**: Ensures only necessary files are sent to the Docker daemon.

## Usage

### Spin up everything
```bash
docker-compose up -d
```

### Run just the database
```bash
docker-compose up -d db
```

## Multi-Stage Build

The Dockerfile is split into three stages:
-   **Dependencies**: Installs all node modules.
-   **Build**: Compiles TypeScript and prunes dev dependencies.
-   **Production**: Copies only the necessary files for a lean execution environment.
