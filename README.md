# Desawali - Premium Pickles & Seafood E-commerce

A production-ready e-commerce website built with React + Vite + TypeScript, featuring PhonePe payments and Supabase backend.

## 🚀 Features

- **Complete E-commerce Functionality**: Product browsing, cart, checkout, order management
- **Secure Payments**: PhonePe integration with webhook verification
- **Admin Dashboard**: Product management, order tracking, inventory control
- **Responsive Design**: Mobile-first approach with beautiful UI
- **Authentication**: Supabase Auth with role-based access
- **Real-time Data**: Supabase realtime subscriptions
- **SEO Optimized**: Meta tags, Open Graph, JSON-LD markup
- **Accessible**: WCAG compliant with keyboard navigation
- **Testing**: Unit tests (Vitest) and E2E tests (Playwright)
- **CI/CD**: GitHub Actions deployment pipeline

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TypeScript, TailwindCSS
- **Backend**: Supabase (Database, Auth, Storage)
- **Payments**: PhonePe Gateway
- **Serverless**: Vercel Functions
- **Testing**: Vitest, Playwright
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ and pnpm
- Supabase account
- PhonePe merchant account
- Vercel account (for deployment)

## 🚦 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo>
cd desawali
pnpm install
```

### 2. Supabase Setup

1. Create a new Supabase project at https://supabase.com
2. Run the migrations:

```bash
# Copy the contents of supabase/migrations.sql and run in Supabase SQL Editor
```

3. Run the seed data:

```bash
# Copy the contents of supabase/seeds.sql and run in Supabase SQL Editor
```

4. Enable Row Level Security for all tables in Supabase Dashboard

### 3. Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required environment variables:

```env
# Supabase (get from your project settings)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# PhonePe (get from merchant dashboard)
PHONEPE_MID=your_merchant_id
PHONEPE_SECRET=your_secret_key

# Email (optional - for order confirmations)
EMAIL_API_KEY=your_sendgrid_api_key

# App URL
VITE_APP_URL=http://localhost:5173
```

### 4. Run Development Server

```bash
pnpm dev
```

Visit http://localhost:5173

### 5. Create Admin User

1. Sign up through the website
2. In Supabase dashboard, go to Table Editor → profiles
3. Set `is_admin = true` for your user
4. Access admin dashboard at `/admin`

## 🧪 Testing

### Unit Tests
```bash
pnpm test
```

### E2E Tests
```bash
pnpm test:e2e
```

## 🚀 Deployment

### Vercel Deployment

1. Connect your GitHub repo to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production

Set these in Vercel dashboard:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `PHONEPE_MID`
- `PHONEPE_SECRET`
- `EMAIL_API_KEY`
- `VITE_APP_URL` (your production URL)

## 🔒 Security Notes

- Never expose service role keys to client
- PhonePe webhook signature verification implemented
- Input validation and sanitization on all forms
- Rate limiting recommended for production
- HTTPS enforcement in production

## 📝 API Endpoints

### Public Endpoints
- `GET /api/products` - Get products
- `GET /api/products/[id]` - Get product details
- `POST /api/orders` - Create order

### Protected Endpoints
- `POST /api/phonepe/create-payment` - Create payment order
- `POST /api/phonepe/webhook` - Payment webhook
- `GET /api/phonepe/verify/[id]` - Verify payment

### Admin Endpoints
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/[id]` - Update product
- `DELETE /api/admin/products/[id]` - Delete product
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/[id]` - Update order status

## 📊 Database Schema

### Core Tables
- `profiles` - User profiles with admin roles
- `categories` - Product categories (Pickles, Seafood)
- `products` - Product catalog
- `orders` - Order management
- `coupons` - Discount coupons
- `reviews` - Product reviews

### Key Features
- UUID primary keys
- Row Level Security enabled
- Automatic timestamps
- JSONB for flexible data (order items, metadata)

## 🎨 Design System

### Colors
- Primary: `#B22222` (Meat Red)
- Background: `#FFF7F0` (Warm Cream)
- Seafood Accent: `#0891B2` (Cyan 600)
- Success: `#059669` (Emerald 600)
- Warning: `#D97706` (Amber 600)
- Error: `#DC2626` (Red 600)

### Typography
- Font Family: Inter (system fallback)
- Heading Scale: 120% line height
- Body Scale: 150% line height

## 🔧 Development Commands

```bash
# Development
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm preview      # Preview production build

# Testing
pnpm test         # Run unit tests
pnpm test:e2e     # Run E2E tests
pnpm test:ui      # Run tests with UI

# Linting & Type Checking
pnpm lint         # ESLint
pnpm typecheck    # TypeScript check

# Database
pnpm db:migrate   # Run migrations
pnpm db:seed      # Seed database
pnpm db:reset     # Reset database
```

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── hooks/         # Custom React hooks
├── utils/         # Utility functions
├── types/         # TypeScript types
├── lib/           # External service configurations
└── assets/        # Static assets

api/               # Serverless functions
├── phonepe/       # Payment endpoints
└── admin/         # Admin endpoints

supabase/
├── migrations.sql # Database schema
└── seeds.sql      # Sample data

tests/
├── unit/          # Vitest unit tests
└── e2e/           # Playwright E2E tests
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Include error logs and steps to reproduce

---

Built with ❤️ for fresh pickles and seafood lovers!