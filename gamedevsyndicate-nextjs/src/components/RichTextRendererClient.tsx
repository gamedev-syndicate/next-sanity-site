"use client"

import React from 'react'
import { PortableText } from '@portabletext/react'
import { customComponents } from './CustomBlocks'

interface Props {
  value: any
}

export default function RichTextRendererClient({ value }: Props) {
  return <PortableText value={value} components={customComponents} />
}
