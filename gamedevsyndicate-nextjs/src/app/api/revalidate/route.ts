import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Webhook endpoint for on-demand revalidation when Sanity content changes
 * 
 * Usage:
 * POST /api/revalidate?secret=YOUR_SECRET
 * Body: { type: 'article' | 'page' | 'siteConfig' | 'designSystem', slug?: string }
 * 
 * Configure in Sanity webhook settings:
 * URL: https://your-domain.com/api/revalidate?secret=YOUR_SECRET
 * Trigger on: Create, Update, Delete
 */
export async function POST(request: NextRequest) {
  // Verify secret token
  const secret = request.nextUrl.searchParams.get('secret');
  
  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { message: 'Invalid or missing secret token' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { type, slug } = body;

    console.log('Revalidation request:', { type, slug });

    // Revalidate based on content type
    switch (type) {
      case 'article':
      case 'articlePage':
        if (slug) {
          // Revalidate specific article page
          revalidatePath(`/articles/${slug}`);
          console.log(`Revalidated article: /articles/${slug}`);
        }
        // Always revalidate articles index when articles change
        revalidatePath('/articles');
        // Revalidate by tag for dynamic content
        revalidateTag('dynamic');
        break;

      case 'page':
        if (slug) {
          // Revalidate specific page
          revalidatePath(`/${slug}`);
          console.log(`Revalidated page: /${slug}`);
        }
        // Revalidate by tag for semi-static content
        revalidateTag('semi-static');
        break;

      case 'homepage':
        // Revalidate homepage
        revalidatePath('/');
        revalidateTag('semi-static');
        console.log('Revalidated homepage');
        break;

      case 'siteConfig':
        // Site config changes affect all pages
        revalidatePath('/', 'layout');
        revalidateTag('static');
        console.log('Revalidated site config (all pages)');
        break;

      case 'designSystem':
        // Design system changes affect all pages
        revalidatePath('/', 'layout');
        revalidateTag('static');
        console.log('Revalidated design system (all pages)');
        break;

      case 'company':
        // Revalidate pages that display companies
        revalidateTag('semi-static');
        console.log('Revalidated company data');
        break;

      default:
        return NextResponse.json(
          { 
            message: 'Invalid content type',
            validTypes: ['article', 'articlePage', 'page', 'homepage', 'siteConfig', 'designSystem', 'company']
          },
          { status: 400 }
        );
    }

    return NextResponse.json({
      revalidated: true,
      type,
      slug,
      timestamp: Date.now(),
    });

  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { message: 'Error revalidating', error: String(error) },
      { status: 500 }
    );
  }
}

// Also support GET for testing purposes (only in development)
export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { message: 'GET method not allowed in production' },
      { status: 405 }
    );
  }

  const secret = request.nextUrl.searchParams.get('secret');
  const type = request.nextUrl.searchParams.get('type');
  const slug = request.nextUrl.searchParams.get('slug');

  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { message: 'Invalid or missing secret token' },
      { status: 401 }
    );
  }

  if (!type) {
    return NextResponse.json(
      { message: 'Missing type parameter' },
      { status: 400 }
    );
  }

  // Reuse POST logic
  return POST(
    new NextRequest(request.url, {
      method: 'POST',
      body: JSON.stringify({ type, slug }),
    })
  );
}
