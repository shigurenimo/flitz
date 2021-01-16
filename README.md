This is a [Blitz.js](https://github.com/blitz-js/blitz) app.

# **FLITZ**

## Getting Started

Make env file and run PostgreSQL by using Docker.

```
% docker-compose up -d
```

Install Node.js modules.

```
% yarn
```

Migrate PostgreSQL schemas.

```
% yarn prisma db push --preview-feature
```

Run your app in the development mode.

```
% yarn start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Ensure the `.env.local` file has required environment variables:

```
DATABASE_URL="postgresql://postgres@localhost:5432/app"
POSTGRES_HOST_AUTH_METHOD=trust
```

Ensure the `.env.test.local` file has required environment variables:

```
DATABASE_URL="postgresql://postgres@localhost:5432/test"
```

## Tests

Runs your tests using Jest.

```
% yarn test
```

Blitz comes with a test setup using [Jest](https://jestjs.io/) and [react-testing-library](https://testing-library.com/).

## Learn more

Read the [Blitz.js Documentation](https://blitzjs.com/docs/getting-started) to learn more.
