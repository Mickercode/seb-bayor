---
name: Infrastructure preferences
description: User prefers Railway for deployment, Cloudinary for file storage, SQLite for local dev — no Supabase or Vercel
type: feedback
---

Use Railway instead of Vercel/Supabase for deployment and hosting. Use Cloudinary for file uploads. Use SQLite for local development.

**Why:** User's explicit preference — simpler stack, fewer accounts to manage.
**How to apply:** All deployment references, env var setup, and infrastructure code should target Railway. No Supabase Auth — use custom auth with bcrypt + JWT/sessions instead. DB is SQLite locally, can switch to Railway PostgreSQL in production.
