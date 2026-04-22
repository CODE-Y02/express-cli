# Environment Variables

Your project uses `dotenv` to manage environment-specific configurations.

## Required Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode (`development`, `production`, `test`) | `development` |
| `PORT` | The port the server will listen on | `3000` |
| `DATABASE_URL` | Connection string for your database | (Depends on DB) |

## Database URLs

- **PostgreSQL**: `postgresql://user:password@localhost:5432/mydb`
- **MySQL**: `mysql://user:password@localhost:3306/mydb`
- **SQLite**: `file:./dev.db`

## Best Practices

- **Never commit `.env`**: This file is ignored by git to keep your secrets safe.
- **Use `.env.example`**: Keep this updated with the names of all required variables (but no real secrets).
