import { createClient } from 'next-sanity';
import { sanityClientConfig } from './lib/sanity-client-config';

export const sanityClient = createClient({
  projectId: sanityClientConfig.projectId,
  dataset: sanityClientConfig.dataset,
  apiVersion: sanityClientConfig.apiVersion,
  useCdn: true,
  token: process.env.SANITY_API_TOKEN,
  // Enable stega for visual editing
  stega: {
    enabled: false,
    studioUrl: '/studio',
  },
});

// Updated client for draft mode
export function getClient(preview = false) {
  return createClient({
    projectId: sanityClientConfig.projectId,
    dataset: sanityClientConfig.dataset,
    apiVersion: sanityClientConfig.apiVersion,
    useCdn: !preview && process.env.NODE_ENV === 'production',
    token: process.env.SANITY_API_TOKEN,
    perspective: preview ? 'previewDrafts' : 'published',
    // Enable stega for visual editing in preview mode
    stega: {
      enabled: preview,
      studioUrl: '/studio',
    },
  });
}
