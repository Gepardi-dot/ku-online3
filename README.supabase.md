# Running KU-ONLINE with Supabase and Vercel

Welcome! This guide will walk you through setting up your migrated KU-ONLINE application to run with a Supabase backend and deploy it on Vercel.

## Step 1: Set Up Your Supabase Project

If you haven't already, create a new project on [Supabase](https://supabase.com/).

### A. Create the `products` Table

You need a table to store your product listings. Go to the **Table Editor** in your Supabase project dashboard.

1.  Click **"Create a new table"**.
2.  Name the table `products`.
3.  Uncheck "Enable Row Level Security (RLS)" for now. We can add security rules later.
4.  Add the following columns. Make sure the data types match exactly.

| Column Name     | Data Type                 | Default Value            | Is Nullable? |
| --------------- | ------------------------- | ------------------------ | ------------ |
| `id`            | `uuid`                    | `gen_random_uuid()`      | No           |
| `createdAt`     | `timestamp with time zone`| `now()`                  | No           |
| `name`          | `text`                    |                          | No           |
| `description`   | `text`                    |                          | No           |
| `price`         | `numeric`                 |                          | No           |
| `currency`      | `text`                    | `'IQD'`                  | No           |
| `category`      | `text`                    |                          | No           |
| `condition`     | `text`                    |                          | No           |
| `location`      | `text`                    |                          | No           |
| `imageUrl`      | `text`                    |                          | No           |
| `imageHint`     | `text`                    |                          | Yes          |
| `sellerId`      | `uuid`                    |                          | No           |
| `seller`        | `jsonb`                   |                          | No           |
| `tags`          | `ARRAY` of `text`         |                          | Yes          |

5.  Click **Save**.

### B. Create a Storage Bucket

You need a place to store product images.

1.  Go to the **Storage** section in your Supabase project.
2.  Click **"New bucket"**.
3.  Name the bucket `products`.
4.  Check the box to make it a **Public bucket**.
5.  Click **"Create bucket"**.

### C. Get Your API Keys

You will need these keys for the next step.

1.  Go to **Project Settings** (the gear icon).
2.  Go to the **API** section.
3.  You will find your **Project URL** and your `anon` **public** key.
4.  Scroll down to **Project API keys** and find the `service_role` secret key.

## Step 2: Configure Environment Variables for Vercel

When you deploy your project to Vercel, you need to set up environment variables.

1.  In your Vercel project dashboard, go to **Settings -> Environment Variables**.
2.  Add the following secrets. Replace the placeholder values with the keys you just copied from Supabase.

| Key                          | Value                                    |
| ---------------------------- | ---------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`   | Your Supabase Project URL                |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your `anon` public key                   |
| `SUPABASE_SERVICE_ROLE_KEY`  | Your `service_role` secret key           |
| `GEMINI_API_KEY`             | Your Google Gemini API Key (for AI features) |

## Step 3: Deploy to Vercel

1.  Push all the code changes to your GitHub repository.
2.  In Vercel, create a new project and link it to your GitHub repository.
3.  Vercel will automatically detect that it's a Next.js project and deploy it.

That's it! Your project is now fully configured to run with Supabase on Vercel.
