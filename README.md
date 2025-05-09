[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Follow on Twitter](https://img.shields.io/twitter/follow/taishik_?style=social)](https://x.com/taishik_)

[![Demo Video](https://img.youtube.com/vi/EHcOJih-eIA/0.jpg)](https://www.youtube.com/watch?v=EHcOJih-eIA)

# CiteAnalytics 📊

CiteAnalytics is an open-source analytics platform for tracking AI citations. Built with Next.js, Supabase, TypeScript, shadcn/ui, and Tailwind CSS. Deployable on Vercel.

## Features ✨

- Analytics for AI citations
- Modern UI with shadcn/ui and Tailwind CSS
- Supabase as the backend
- TypeScript for type safety
- Ready for Vercel deployment

## Getting Started 🚀

### 1. Clone the Repository

```bash
git clone https://github.com/taishikato/citeanalytics.git
cd citeanalytics
```

### 2. Install Dependencies

This project uses [pnpm](https://pnpm.io/):

```bash
pnpm install
```

### 3. Set Up Environment Variables 🔑

Copy the sample environment file from the web app directory and fill in your Supabase and app credentials:

```bash
cp apps/web/.env.sample apps/web/.env
```

Edit `apps/web/.env` and provide the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_SUPABASE_PROJECT_ID=your-supabase-project-id
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# ex) https://www.citeanalytics.com
NEXT_PUBLIC_APP_URL=your-app-url
```

You can find these values in your [Supabase project settings](https://app.supabase.com/).

### 4. Run the Development Server 🖥️

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### 5. Build and Start for Production 🏭

```bash
pnpm build
pnpm start
```

## Deployment 🌐

CiteAnalytics is ready to deploy on [Vercel](https://vercel.com/):

1. Push your repository to GitHub.
2. Import your repo in Vercel.
3. Set the environment variables in the Vercel dashboard.
4. Deploy!

## Tech Stack 🛠️

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vercel](https://vercel.com/)

## Contributing 🤝

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## Author 👤

[Taishi Kimura on Twitter](https://x.com/taishik_)
