# Vehicle Inventory Tool - Setup Guide

## Prerequisites

- Node.js 18+
- PostgreSQL database
- AWS S3 bucket for file storage
- Gemini Nano API access

## Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Set up environment variables:

```bash
cp .env.example .env.local
# Edit .env.local with your actual values
```

3. Set up the database:

```bash
# Run Prisma migrations (after schema is defined)
npx prisma migrate dev
npx prisma generate
```

## Development

### Running the application

```bash
npm run dev
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run property-based tests only
npm run test:properties

# Run with coverage
npm run test:coverage
```

### Code Quality

```bash
# Lint code
npm run lint
npm run lint:fix

# Format code
npm run format
npm run format:check
```

## Project Structure

```
src/
├── app/                 # Next.js 14 app router
│   ├── api/            # API routes
│   ├── auth/           # Authentication pages
│   ├── stores/         # Store selection pages
│   ├── vehicles/       # Vehicle management pages
│   └── layout.tsx      # Root layout
├── components/         # Reusable UI components
├── lib/               # Utility libraries
├── types/             # TypeScript type definitions
├── hooks/             # Custom React hooks
└── utils/             # Helper functions

tests/
├── unit/              # Unit tests
├── integration/       # Integration tests
├── properties/        # Property-based tests
├── e2e/              # End-to-end tests
└── utils/            # Test utilities and mocks
```

## Technology Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Authentication**: NextAuth.js
- **Database**: PostgreSQL with Prisma ORM
- **File Storage**: AWS S3 + CloudFront
- **Image Processing**: Gemini Nano Banana 25 flash
- **Testing**: Jest, React Testing Library, fast-check
- **Code Quality**: ESLint, Prettier

## Next Steps

1. Complete database schema definition in `prisma/schema.prisma`
2. Set up authentication configuration
3. Implement core components and API routes
4. Add comprehensive test coverage
