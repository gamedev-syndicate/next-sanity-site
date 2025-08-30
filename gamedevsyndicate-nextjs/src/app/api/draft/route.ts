import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { config } from '../../../config';

export async function GET(request: Request) {
  // Check if visual editing is enabled
  if (!config.features.visualEditing) {
    return new Response('Visual editing is disabled', { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug') || '/';

  // Debug logging
  console.log('🔑 Draft API Debug:', {
    receivedSecret: secret,
    configSecret: config.sanity.previewSecret,
    secretsMatch: secret === config.sanity.previewSecret,
    visualEditingEnabled: config.features.visualEditing
  });

  // Check secret to prevent unauthorized access
  if (secret !== config.sanity.previewSecret) {
    console.error('❌ Secret mismatch in draft API');
    return new Response('Invalid token', { status: 401 });
  }

  console.log('✅ Draft mode enabled for:', slug);

  // Enable draft mode
  const draft = await draftMode();
  draft.enable();

  // Redirect to the path from the fetched post
  redirect(slug);
}
