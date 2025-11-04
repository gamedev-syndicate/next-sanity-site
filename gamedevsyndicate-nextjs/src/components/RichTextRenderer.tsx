"use client"

import React from 'react'
import { PortableText } from '@portabletext/react'
import { customComponents } from './CustomBlocks'

interface RichTextRendererProps {
  value: any
}

export default function RichTextRenderer({ value }: RichTextRendererProps) {
  return <PortableText value={value} components={customComponents} />
}
