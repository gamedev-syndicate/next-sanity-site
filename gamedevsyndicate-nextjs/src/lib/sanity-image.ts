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
export function getImageUrl(image: SanityImage, width?: number, height?: number) {
  let url = urlFor(image)
  
  if (width) {
    url = url.width(width)
  }
  
  if (height) {
    url = url.height(height)
  }
  
  return url.url()
}
