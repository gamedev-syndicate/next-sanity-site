"use client"

import React from 'react'
import { PortableText } from '@portabletext/react'
import { createCustomComponents } from './CustomBlocks'
import { useDesignSystem } from '../hooks/useDesignSystem'
import type { PortableTextBlock } from '@portabletext/types'

interface Props {
  value: PortableTextBlock | PortableTextBlock[]
}

export default function RichTextRendererClient({ value }: Props) {
  const { designSystem } = useDesignSystem();
  const customComponents = createCustomComponents(designSystem);
  
  console.log('RichTextRendererClient rendering with value:', value);
  console.log('CustomComponents types available:', Object.keys(customComponents.types || {}));
  
  return <PortableText value={value} components={customComponents} />
}
