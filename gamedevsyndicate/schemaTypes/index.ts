import articlePage from './articlePage'
import buttonBlock from './buttonBlock'
import company from './company'
import companyBlock from './companyBlock'
import companyListBlock from './companyListBlock'
import compactCompanyListBlock from './compactCompanyListBlock'
import contactBlock from './contactBlock'
import designSystem from './designSystem'
import homepage from './homepage'
import imageBlock from './imageBlock'
import imageTextBlock from './imageTextBlock'
import page from './page'
import siteConfig from './siteConfig'
import textBlock from './textBlock'
import textAndImage from './textAndImage'
import textAndImageBlock from './textAndImageBlock'
import textAndImageListBlock from './textAndImageListBlock'
import contentSeparator from './blocks/contentSeparator'
import socialMediaLink from './socialMediaLink'

export const schemaTypes = [
  // Document types
  articlePage,
  company,
  designSystem,
  homepage,
  page,
  textAndImage,
  siteConfig,
  
  // Block types
  buttonBlock,
  companyBlock,
  companyListBlock,
  compactCompanyListBlock,
  contactBlock,
  imageBlock,
  imageTextBlock,
  textBlock,
  textAndImageBlock,
  textAndImageListBlock,
  contentSeparator,
  
  // Object types
  socialMediaLink,
]
