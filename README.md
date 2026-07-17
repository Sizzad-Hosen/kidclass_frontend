# KidClass Frontend

KidClass is a role-protected learning management frontend built with Next.js, TypeScript, Tailwind CSS, Redux Toolkit, and RTK Query.

## Environment

Create `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

The frontend runs on `http://localhost:3000`; the KidClass API runs on port `8000`.

## Course Management

Admins and super admins can manage courses at:

- `/course-management/courses` — searchable course catalog and status actions
- `/course-management/courses/create` — validated course creation
- `/course-management/courses/[courseId]/edit` — course editing
- `/course-management/courses/[courseId]/builder` — milestone, module, lesson, video, and quiz builder

Workflow:

```text
Create Course → Add Milestone → Add Module → Add Lesson → Add Quiz → Review → Publish
```

Lesson videos support either an existing URL or multipart upload. The backend limit is 25 MB and Cloudinary must be configured for file uploads. Students cannot access course-management pages or mutation APIs.

## Getting Started

Install dependencies and run the development server:

```bash
npm run dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Quality checks:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
