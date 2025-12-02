"use client"

import React from 'react'
import { PortableText } from '@portabletext/react'
import { customComponents } from './CustomBlocks'
import type { PortableTextBlock } from '@portabletext/types'

interface Props {
  value: PortableTextBlock | PortableTextBlock[]
}

export default function RichTextRendererClient({ value }: Props) {
  console.log('RichTextRendererClient rendering with value:', value);
  console.log('CustomComponents types available:', Object.keys(customComponents.types || {}));
  
  return <PortableText value={value} components={customComponents} />
}
