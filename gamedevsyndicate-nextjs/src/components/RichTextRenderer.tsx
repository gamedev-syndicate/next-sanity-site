"use client"

import React from 'react'
import { PortableText } from '@portabletext/react'
import { customComponents } from './CustomBlocks'
import type { PortableTextBlock } from '@portabletext/types'

interface RichTextRendererProps {
  value: PortableTextBlock | PortableTextBlock[]
}

export default function RichTextRenderer({ value }: RichTextRendererProps) {
  return <PortableText value={value} components={customComponents} />
}
