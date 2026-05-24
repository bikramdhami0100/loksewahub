# LoksewaHub

Nepal's all-in-one AI-powered bilingual preparation platform for Loksewa, TSC, Banking, and all government competitive examinations.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Lucide React, GSAP
- **Backend**: Next.js Route Handlers, Server Actions
- **Database**: MongoDB Atlas + Mongoose ODM
- **Auth**: Auth.js (NextAuth) with Google OAuth
- **AI**: Google Gemini API (gemini-2.0-flash)
- **Storage**: Cloudinary
- **Email**: Nodemailer
- **Deployment**: Vercel

## Environment Variables

Create a `.env.local` file:

```env
# MongoDB
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/loksewahub

# Auth.js
AUTH_SECRET=<generate with: openssl rand -base64 32>
AUTH_GOOGLE_ID=<Google OAuth client ID>
AUTH_GOOGLE_SECRET=<Google OAuth client secret>

# Google Gemini AI
GEMINI_API_KEY=<Gemini API key>

# Cloudinary
CLOUDINARY_CLOUD_NAME=<cloud name>
CLOUDINARY_API_KEY=<api key>
CLOUDINARY_API_SECRET=<api secret>

# Nodemailer (Gmail App Password recommended)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=<app password>

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
src/
├── app/
│   ├── [locale]/           # Localized routes (en, ne)
│   │   ├── (public)/       # Public pages
│   │   │   ├── notices/
│   │   │   ├── vacancies/
│   │   │   ├── results/
│   │   │   ├── syllabus/
│   │   │   ├── notes/
│   │   │   ├── old-questions/
│   │   │   ├── ai-probable-questions/
│   │   │   ├── current-affairs/
│   │   │   ├── mock-tests/
│   │   │   ├── ai-tutor/
│   │   │   ├── pricing/
│   │   │   ├── contact/
│   │   │   ├── faq/
│   │   │   └── about/
│   │   ├── dashboard/      # Protected user pages
│   │   └── admin/          # Admin panel
│   ├── api/                # API routes
│   └── sitemap.ts
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── layout/             # Navbar, Footer, etc.
│   └── shared/             # Shared components
├── lib/                    # Utilities (db, auth, gemini, cloudinary, etc.)
├── models/                 # Mongoose schemas (15 models)
├── hooks/                  # Custom hooks (useGsapFadeIn, useGsapCounter)
├── providers/              # Context providers
├── scripts/                # Automation scripts
├── messages/               # i18n JSON files
└── types/                  # TypeScript definitions
```

## MongoDB Models

- **User** - User accounts with roles and subscriptions
- **Notice** - Government notices and vacancies
- **Note** - Study notes and materials
- **Syllabus** - Exam syllabus for all services
- **Question** - Practice questions (MCQ, descriptive)
- **CurrentAffair** - Current affairs (last 90 days)
- **MockTest** - Timed mock tests
- **Attempt** - User test attempts and scores
- **Bookmark** - Saved bookmarks
- **Prediction** - AI-generated predictions
- **GovernmentSource** - Government websites for scraping
- **FileAsset** - Cloudinary file metadata
- **Subscription** - Email subscriptions
- **Notification** - User notifications
- **ContactMessage** - Contact form submissions

## Deployment (Vercel)

1. Push to GitHub
2. Connect repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

The `vercel.json` configures:
- Framework detection
- Build settings
- Cron jobs for scraping:
  - Notices: hourly
  - Current affairs: every 6 hours
  - AI predictions: weekly

## Available Scripts

- `src/scripts/seed-data.ts` - Seed initial government sources and sample data
- `src/scripts/scrape-notices.ts` - Scrape government notice websites
- `src/scripts/scrape-current-affairs.ts` - Scrape current affairs from news sites
- `src/scripts/generate-predictions.ts` - Generate AI predictions weekly

Run scripts with: `npx ts-node src/scripts/script-name.ts`

## Official Data Sources

- psc.gov.np (PSC)
- tsc.gov.np (TSC)
- All 7 Provincial PSC websites
- nepal.gov.np
- opmcm.gov.np
- mof.gov.np
- nrb.org.np
- nepalpolice.gov.np
- apf.gov.np
- nepalarmy.mil.np
- gorkhapatraonline.com
- risingnepaldaily.com
