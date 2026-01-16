# Automotive Inventory Management System

A modern, accessible automotive inventory management application built with Next.js 16, React 19, and shadcn/ui components.

## Features

- **Modern UI Components**: Built with shadcn/ui for accessible, customizable components
- **Dark Mode Support**: System-aware theme with manual toggle
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Accessibility**: WCAG-compliant with keyboard navigation and screen reader support
- **Image Management**: Advanced image processing with CDK integration
- **Role-Based Access**: Photographer and admin workflows
- **Real-time Notifications**: Toast notifications for user feedback

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS v4
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Image Storage**: AWS S3 and Google Cloud Storage
- **Testing**: Jest with React Testing Library and fast-check

## Getting Started

### Prerequisites

- Node.js 20+ and npm
- PostgreSQL database
- AWS S3 bucket (for image storage)
- Google Cloud Storage (optional fallback)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables (copy `.env.example` to `.env` and configure)

4. Run database migrations:

```bash
npm run db:migrate
```

5. Seed the database (optional):

```bash
npm run db:seed
```

6. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## UI Components

This project uses [shadcn/ui](https://ui.shadcn.com/) components, which are built on:
- **Radix UI**: Unstyled, accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **class-variance-authority**: For component variants

### Available Components

All UI components are located in `src/components/ui/`:
- Button, Card, Input, Select, Checkbox
- Dialog (modals), Badge, Skeleton
- Table, Toast (notifications)

### Using Components

```tsx
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Example Card</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="default">Click Me</Button>
      </CardContent>
    </Card>
  )
}
```

## Dark Mode

The application supports both light and dark themes with automatic system preference detection.

### Usage

- **Toggle**: Click the theme toggle button in the navigation banner
- **Persistence**: Theme preference is saved to localStorage
- **System Preference**: Automatically detects and applies system theme on first visit

See [DARK_MODE.md](.kiro/specs/shadcn-ui-integration/DARK_MODE.md) for implementation details.

## Theme Customization

Theme colors and design tokens are defined in `src/app/globals.css` using CSS variables.

### Custom Theme Tokens

The project includes custom variants beyond shadcn/ui defaults:
- `success`: Green variant for success states
- `warning`: Yellow/orange variant for warning states

See [THEME_CUSTOMIZATION.md](.kiro/specs/shadcn-ui-integration/THEME_CUSTOMIZATION.md) for details.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm test` - Run test suite
- `npm run test:coverage` - Run tests with coverage
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

## Testing

The project uses a comprehensive testing strategy:
- **Unit Tests**: Component and function testing
- **Property-Based Tests**: Universal correctness properties with fast-check
- **Integration Tests**: End-to-end workflow testing

Run tests:
```bash
npm test
```

See test results in `.kiro/specs/shadcn-ui-integration/TEST_RESULTS_SUMMARY.md`.

## Project Structure

```
src/
├── app/                    # Next.js app router pages
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── common/            # Shared components
│   ├── vehicles/          # Vehicle management components
│   ├── stores/            # Store management components
│   └── providers/         # React context providers
├── lib/                   # Utility functions
├── types/                 # TypeScript type definitions
└── utils/                 # Helper utilities
```

## Documentation

- [Setup Guide](SETUP.md)
- [Database Guide](DATABASE_GUIDE.md)
- [Theme Customization](.kiro/specs/shadcn-ui-integration/THEME_CUSTOMIZATION.md)
- [Dark Mode Implementation](.kiro/specs/shadcn-ui-integration/DARK_MODE.md)
- [Manual Testing Guide](.kiro/specs/shadcn-ui-integration/MANUAL_TESTING_GUIDE.md)

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/primitives)

## License

Private - All rights reserved
