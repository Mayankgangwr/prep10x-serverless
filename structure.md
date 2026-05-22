# Production-Ready Folder Structure

For Your AI Serverless SaaS

This structure is optimized for:

- Next.js App Router
- Better Auth
- Prisma
- Neon
- AI workflows
- Serverless
- Scalable modules

## Recommended Structure

```text
src/
│
├── app/
│   │
│   ├── (public)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── pricing/
│   │   ├── features/
│   │   └── about/
│   │
│   ├── (auth)/
│   │   ├── layout.tsx
│   │   ├── login/
│   │   ├── signup/
│   │   └── forgot-password/
│   │
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   │
│   │   ├── dashboard/
│   │   ├── roadmap/
│   │   ├── resume/
│   │   ├── interview/
│   │   ├── progress/
│   │   └── settings/
│   │
│   ├── api/
│   │   │
│   │   ├── auth/
│   │   ├── resume/
│   │   ├── roadmap/
│   │   ├── interview/
│   │   ├── webhook/
│   │   └── billing/
│   │
│   ├── globals.css
│   ├── layout.tsx
│   └── not-found.tsx
│
│
├── components/
│   │
│   ├── ui/                 # shadcn generated
│   │
│   ├── common/
│   │   ├── navbar/
│   │   ├── sidebar/
│   │   ├── loaders/
│   │   └── logos/
│   │
│   ├── forms/
│   │
│   ├── dashboard/
│   │
│   ├── roadmap/
│   │
│   ├── resume/
│   │
│   └── interview/
│
│
├── modules/
│   │
│   ├── auth/
│   │   │
│   │   ├── server/
│   │   ├── client/
│   │   ├── actions/
│   │   ├── schemas/
│   │   ├── types/
│   │   ├── hooks/
│   │   └── constants/
│   │
│   │
│   ├── user/
│   │   ├── server/
│   │   ├── actions/
│   │   ├── schemas/
│   │   └── types/
│   │
│   │
│   ├── resume/
│   │   │
│   │   ├── ai/
│   │   ├── parser/
│   │   ├── services/
│   │   ├── actions/
│   │   ├── schemas/
│   │   ├── types/
│   │   ├── hooks/
│   │   ├── mock/
│   │   └── prompts/
│   │
│   │
│   ├── roadmap/
│   │   │
│   │   ├── ai/
│   │   ├── services/
│   │   ├── actions/
│   │   ├── prompts/
│   │   ├── mock/
│   │   ├── schemas/
│   │   ├── types/
│   │   └── hooks/
│   │
│   │
│   ├── interview/
│   │   ├── ai/
│   │   ├── prompts/
│   │   ├── mock/
│   │   ├── services/
│   │   └── types/
│   │
│   │
│   ├── analytics/
│   │
│   └── billing/
│
│
├── lib/
│   │
│   ├── auth/
│   │   ├── auth.ts
│   │   ├── client.ts
│   │   ├── session.ts
│   │   └── middleware.ts
│   │
│   ├── prisma/
│   │   ├── client.ts
│   │   └── queries/
│   │
│   ├── ai/
│   │   ├── openai.ts
│   │   ├── embeddings.ts
│   │   └── provider.ts
│   │
│   ├── upload/
│   │
│   ├── inngest/
│   │
│   ├── redis/
│   │
│   ├── validations/
│   │
│   ├── constants/
│   │
│   └── utils/
│
│
├── hooks/
│
├── providers/
│
├── stores/
│
├── config/
│
├── types/
│
├── styles/
│
└── proxy.ts
```

## Why This Is Production Ready

Because it separates concerns clearly:

| Concern | Location |
| --- | --- |
| UI | `components/` |
| Business logic | `modules/` |
| Infra | `lib/` |
| APIs | `app/api/` |
| Auth | `lib/auth/` |
| AI | `modules/*/ai` |
| Prompts | `prompts/` |
| DB | `prisma/` |
| Mock data | `mock/` |

## Notes

- This structure is designed for serverless-friendly deployment on platforms like Vercel.
- Route groups such as `(public)`, `(auth)`, and `(dashboard)` keep the app router clean without affecting URLs.
- Feature-owned modules keep AI, parsing, schemas, prompts, and services close together.
- Shared infrastructure in `lib/` keeps authentication, database, and AI providers reusable across the app.
- On Next.js 16, use `proxy.ts` for auth route protection instead of `middleware.ts`.
