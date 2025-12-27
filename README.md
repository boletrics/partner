# Boletrics Partner Dashboard

The **Partner Dashboard** is the organization management interface for Boletrics, built with [Next.js](https://nextjs.org/) and deployed on [Cloudflare Workers](https://workers.cloudflare.com/) via [OpenNext](https://opennext.js.org/).

## Overview

This application provides event organizers and partners with tools to manage their events, tickets, and sales on the Boletrics platform:

- **Dashboard Overview** - Key metrics and performance summary
- **Event Management** - Create, edit, and manage events (including drafts)
- **Order Management** - View and manage customer orders
- **Ticket Scanning** - QR code scanning for event check-in
- **Customer Management** - View customer data and purchase history
- **Analytics** - Sales analytics and event performance metrics
- **Finance** - Revenue tracking, transactions, and payout management
- **Refunds** - Handle refund requests and processing
- **Settings** - Organization configuration and preferences
- **Help Center** - Support resources and documentation

## Tech Stack

- **Framework**: Next.js 16 with React 19
- **Styling**: Tailwind CSS 4 with shadcn/ui components
- **State Management**: Zustand + Nanostores
- **Form Handling**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Authentication**: Better Auth integration
- **Data Fetching**: SWR
- **Testing**: Vitest + React Testing Library
- **Visual Testing**: Storybook
- **Deployment**: Cloudflare Workers via OpenNext

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10+

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3002](http://localhost:3002) to view the dashboard.

## Available Scripts

| Command             | Description                                    |
| :------------------ | :--------------------------------------------- |
| `pnpm dev`          | Start development server on port 3002          |
| `pnpm build`        | Build for production                           |
| `pnpm preview`      | Preview production build locally               |
| `pnpm deploy`       | Build and deploy to Cloudflare Workers         |
| `pnpm lint`         | Run ESLint                                     |
| `pnpm format`       | Format code with Prettier                      |
| `pnpm format:check` | Check code formatting                          |
| `pnpm typecheck`    | Run TypeScript type checking                   |
| `pnpm test`         | Run tests with coverage                        |
| `pnpm test:watch`   | Run tests in watch mode                        |
| `pnpm storybook`    | Start Storybook on port 6006                   |
| `pnpm ci:check`     | Run all CI checks (format, lint, types, tests) |

## Project Structure

```text
partner/
├── src/
│   ├── app/
│   │   ├── (dashboard)/        # Dashboard routes (events, orders, analytics, etc.)
│   │   └── layout.tsx          # Root layout with org dashboard wrapper
│   ├── components/
│   │   ├── org/                # Organization-specific components
│   │   │   └── views/          # Page view components
│   │   └── ui/                 # shadcn/ui components
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utilities, stores, and API clients
│   ├── stories/                # Storybook stories
│   └── test/                   # Test utilities
├── public/                     # Static assets
└── wrangler.jsonc              # Cloudflare Workers configuration
```

## Related Services

- **auth-svc** - Authentication backend service
- **tickets-svc** - Ticketing backend service (partner reads organization data)
- **admin** - Platform administration dashboard
- **tickets** - Customer-facing ticketing portal
- **auth** - Authentication frontend
