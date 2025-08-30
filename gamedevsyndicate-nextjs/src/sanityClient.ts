import { createClient } from '@sanity/client';
import { config } from './config';

export const sanityClient = createClient({
  projectId: config.sanity.projectId,
  dataset: config.sanity.dataset,
  apiVersion: config.sanity.apiVersion,
  useCdn: true,
  token: config.sanity.token,
});

// Updated client for draft mode
export function getClient(preview = false) {
  return createClient({
    projectId: config.sanity.projectId,
    dataset: config.sanity.dataset,
    apiVersion: config.sanity.apiVersion,
    useCdn: !preview && config.features.caching,
    token: config.sanity.token,
    perspective: preview ? 'previewDrafts' : 'published',
  });
}
