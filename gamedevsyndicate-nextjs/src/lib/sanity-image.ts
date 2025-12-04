import imageUrlBuilder from '@sanity/image-url'
import { sanityClientConfig } from './sanity-client-config'
import type { SanityImage } from '../types/sanity'

// Create image URL builder
const builder = imageUrlBuilder({
  projectId: sanityClientConfig.projectId,
  dataset: sanityClientConfig.dataset,
})

// Helper function to generate image URLs
export function urlFor(source: SanityImage) {
  return builder.image(source)
}

// Helper function to get optimized image URL with specific dimensions
export function getImageUrl(
  image: SanityImage, 
  width?: number, 
  height?: number,
  options?: {
    removeAlpha?: boolean;
    backgroundColor?: string;
    format?: 'jpg' | 'png' | 'webp' | 'auto';
    fit?: 'clip' | 'crop' | 'fill' | 'fillmax' | 'max' | 'scale' | 'min';
  }
) {
  let url = urlFor(image)
  
  if (width) {
    url = url.width(width)
  }
  
  if (height) {
    url = url.height(height)
  }

  // Set fit mode if specified
  if (options?.fit) {
    url = url.fit(options.fit)
  }

  // Handle transparency/alpha channel
  if (options?.removeAlpha && options?.backgroundColor) {
    // Convert to JPG format which doesn't support transparency and add background
    url = url.format('jpg').bg(options.backgroundColor)
  } else if (options?.format && options.format !== 'auto') {
    url = url.format(options.format)
  }
  // If format is 'auto' or not specified, let Sanity auto-detect
  
  return url.url()
}
