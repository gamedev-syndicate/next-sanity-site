This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:



# Sanity Integration

This project uses [Sanity](https://www.sanity.io/) as a headless CMS. 

## Setup

1. Install dependencies:
	```sh
	npm install sanity @sanity/client @sanity/image-url
	```
2. Configure your Sanity project:
	- Edit `sanity/sanity.config.ts` and set your `projectId` and `dataset`.
	- Add schema types to the `types` array as needed.
3. Use the client in your app:
	- Import from `src/sanityClient.ts` for querying content.
	- Use `src/sanityImage.ts` for image URLs.

## Running Sanity Studio

From the `sanity` directory:
```sh
npx sanity dev
```

## Example Usage

Fetch data in a Next.js page:
```ts
import { sanityClient } from '../sanityClient';

export async function getStaticProps() {
  const posts = await sanityClient.fetch(`*[_type == "post"]`);
  return { props: { posts } };
}
```

## Key Files
- `sanity/sanity.config.ts`: Sanity Studio config
- `src/sanityClient.ts`: Sanity client setup
- `src/sanityImage.ts`: Image URL builder
## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
