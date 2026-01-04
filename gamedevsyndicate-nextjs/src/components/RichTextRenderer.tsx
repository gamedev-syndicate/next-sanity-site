"use client"

import React from 'react'
import { PortableText } from '@portabletext/react'
import { createCustomComponents } from './CustomBlocks'
import { useDesignSystem } from '../hooks/useDesignSystem'
import type { PortableTextBlock } from '@portabletext/types'

interface RichTextRendererProps {
  value: PortableTextBlock | PortableTextBlock[]
}

export default function RichTextRenderer({ value }: RichTextRendererProps) {
  const { designSystem } = useDesignSystem();
  const customComponents = createCustomComponents(designSystem);
  
  return <PortableText value={value} components={customComponents} />
}
