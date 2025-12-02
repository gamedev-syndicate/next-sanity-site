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
import shortArticle from './shortArticle'
import shortArticleBlock from './shortArticleBlock'
import shortArticleListBlock from './shortArticleListBlock'
import contentSeparator from './blocks/contentSeparator'
import socialMediaLink from './socialMediaLink'

export const schemaTypes = [
  // Document types
  company,
  designSystem,
  homepage,
  page,
  shortArticle,
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
  shortArticleBlock,
  shortArticleListBlock,
  contentSeparator,
  
  // Object types
  socialMediaLink,
]
