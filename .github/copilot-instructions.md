# GitHub Copilot Instructions for Next.js + Sanity Project

## Custom instructions
Take your time examining and gathering context. If the task is complex I want you to break it down into smaller steps and make a todo list. You are an expert in Next.js, Sanity, and TypeScript. Always provide high-quality, secure, and well-researched code solutions. Follow the project's existing patterns and architecture decisions closely. When adding new features or making changes, ensure you adhere to the design system for color management and the guidelines for client vs server components. Maintain consistency in coding style, file organization, and naming conventions throughout the project.

## Project Overview
This is a Next.js application integrated with Sanity CMS for content management. The project follows modern web development practices with TypeScript, focusing on maintainability, security, and performance. **This project includes a comprehensive design system for color management.**

## Core Technologies
- **Frontend**: Next.js 14+ (App Router)
- **Content Management**: Sanity CMS
- **Language**: TypeScript
- **Styling**: Tailwind CSS (assumed)
- **Package Manager**: npm/yarn/pnpm
- **Design System**: Custom color management system integrated with Sanity

## Design System Guidelines

### Color Management
This project uses a centralized design system for color management:

#### Available Design System Colors
- **Primary**: Main brand color (`var(--color-primary)`)
- **Secondary**: Secondary brand color (`var(--color-secondary)`)
- **Tertiary**: Tertiary accent color (`var(--color-tertiary)`)
- **Button Primary**: Primary button color (`var(--color-button-primary)`)
- **Button Secondary**: Secondary button color (`var(--color-button-secondary)`)

#### Color Usage Rules
- **ALWAYS** use the design system colors instead of hardcoded color values
- **NEVER** use direct hex codes or color names in components unless absolutely necessary
- Use the color selection dropdown in Sanity schemas instead of color picker fields
- Provide fallback to custom colors when needed

#### Schema Implementation
When creating or updating Sanity schemas that need colors:

```typescript
import { colorSelectionField, customColorField } from './utils/colorSelection'

// Use this pattern for background colors
colorSelectionField(
  'backgroundColorSelection',
  'Background Color',
  'Choose background color from design system or use custom color'
),
customColorField(
  'customBackgroundColor',
  'Custom Background Color',
  'Custom background color when not using design system colors'
),
```

#### Component Implementation
When using colors in components:

```typescript
import { useDesignSystem } from '../hooks/useDesignSystem'
import { resolveColor, getCSSVariableForColor, type ColorReference } from '../lib/colorUtils'

// In component
const { designSystem } = useDesignSystem()

// Resolve design system colors
const colorRef: ColorReference = {
  colorSelection: backgroundColorSelection,
  customColor: customBackgroundColor
}
const resolvedColor = resolveColor(colorRef, designSystem, '#fallback')

// Or use CSS variables directly
const cssColor = getCSSVariableForColor(backgroundColorSelection)
```

#### CSS Variable Usage
Use CSS variables for consistent styling:
```css
.my-element {
  background-color: var(--color-primary);
  border-color: var(--color-secondary);
}
```

#### Design System Files
- **Types**: `src/types/designSystem.ts`
- **Utilities**: `src/lib/designSystem.ts`, `src/lib/colorUtils.ts`
- **Hook**: `src/hooks/useDesignSystem.ts`
- **Provider**: `src/components/DesignSystemProvider.tsx`
- **Schema Utils**: `gamedevsyndicate/schemaTypes/utils/colorSelection.ts`

## Client vs Server Components

### "use client" Directive Guidelines
This project uses Next.js App Router with Server Components by default. Use the `'use client'` directive when:

#### Required for Client Components:
- **Components using React hooks** (useState, useEffect, useContext, etc.)
- **Components using browser APIs** (localStorage, sessionStorage, window, document)
- **Event handlers** that require user interaction (onClick, onSubmit, onChange)
- **Components using the design system hook** (`useDesignSystem`)

#### Files that MUST be Client Components in this project:
- `src/hooks/useDesignSystem.ts` - Uses React hooks
- `src/components/DesignSystemProvider.tsx` - Uses useEffect for DOM manipulation
- `src/components/CompanyBlocks.tsx` - Uses useDesignSystem hook
- `src/components/CustomBlocks.tsx` - Imports client components
- Any component that imports the above components

#### Best Practices:
- **Keep Server Components by default** - Only add `'use client'` when necessary
- **Push client boundaries down** - Make the smallest possible components client-side
- **Separate logic** - Extract data fetching to Server Components, pass data to Client Components
- **Import chain rule** - If a Server Component imports a Client Component, the importing component must also be marked as client
- **Avoid Node.js modules in client code** - Never import `fs`, `path`, or other Node.js modules in components that will run on the client

#### Common Pitfalls to Avoid:
- Importing config files that use Node.js modules (like `fs`) in client components
- Using `fs.readFileSync` or similar server-only APIs in files imported by client components
- Mixing server-only configuration with client-safe configuration

#### Client-Safe Configuration:
Use environment variables and dedicated client-safe config files:
```typescript
// ✅ Good - Client-safe configuration
const clientConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
}

// ❌ Bad - Server-only configuration in client code
import fs from 'fs' // This will break in client components
```

#### Example Usage:
```typescript
'use client'

import { useDesignSystem } from '@/hooks/useDesignSystem'
import { useState } from 'react'

export function MyClientComponent() {
  const { designSystem } = useDesignSystem()
  const [state, setState] = useState('')
  // Client-side logic here
}
```

## Quality and Expertise Guidelines

### Code Quality Standards
- Always provide solutions that follow modern best practices in Next.js, TypeScript, and Sanity integration
- Ensure all generated code is high-quality, secure, and aligns with industry standards
- Act as an expert, providing well-researched and reliable approaches to any coding problem
- Write clean, readable, and maintainable code with proper documentation

### TypeScript Standards
- Use strict TypeScript configuration
- Define proper interfaces and types for all data structures
- Utilize generic types where appropriate
- Ensure type safety across components and API routes

## Project Architecture

### Next.js Architecture
```
src/
├── app/                    # App Router pages and layouts
│   ├── (routes)/          # Route groups
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── blocks/           # Content blocks
│   └── forms/            # Form components
├── lib/                  # Utility functions and configurations
│   ├── sanity/           # Sanity client and utilities
│   ├── utils.ts          # General utilities
│   └── validations.ts    # Form validation schemas
├── types/                # TypeScript type definitions
└── hooks/                # Custom React hooks
```

### Sanity Architecture
```
sanity/
├── schemas/              # Content schemas
│   ├── documents/        # Document types
│   ├── objects/          # Object types
│   └── index.ts          # Schema registry
├── lib/                  # Sanity utilities
│   ├── client.ts         # Sanity client configuration
│   ├── queries.ts        # GROQ queries
│   └── image.ts          # Image utilities
└── sanity.config.ts      # Sanity studio configuration
```

## Development Guidelines

### Component Development
- Use functional components with hooks
- Implement proper error boundaries
- Follow compound component patterns where appropriate
- Use React.memo() for performance optimization when needed
- Implement proper loading and error states
- **Always consider if components need client-side rendering** before adding 'use client'

### Sanity Integration
- Always define TypeScript interfaces for Sanity documents
- Use GROQ queries efficiently with proper projections
- Implement image optimization using Sanity's image API
- Handle draft content appropriately
- Use Sanity's real-time features where beneficial

### Performance Best Practices
- Implement proper caching strategies
- Use Next.js Image component for all images
- Implement code splitting and lazy loading
- Optimize bundle size with proper imports
- Use ISR (Incremental Static Regeneration) where appropriate

### Security Considerations
- Always consider security best practices when generating code
- Be cautious with API keys and environment variables
- Implement proper input validation and sanitization
- Use HTTPS for all external API calls
- Implement proper CORS policies
- Validate and sanitize all user inputs

## Coding Standards

### File Organization
- Use kebab-case for file and folder names
- Organize components by feature/domain
- Keep related files close together
- Use index files for clean imports

### Naming Conventions
- Use PascalCase for components and types
- Use camelCase for functions and variables
- Use UPPER_SNAKE_CASE for constants
- Use descriptive and meaningful names

### Code Style
- Use consistent indentation (2 spaces)
- Include JSDoc comments for complex functions
- Use meaningful commit messages
- Follow existing linting and formatting rules
- Implement proper error handling

## Scope Control
- Only modify the specific files, functions, or lines that are explicitly requested
- Avoid altering unrelated parts of the codebase unless specifically asked
- Always preserve existing functionality when making changes
- Ask for clarification if the scope is unclear

## Implementation Guidelines

### When Adding New Features
1. Gather project context by examining existing patterns
2. Check how similar problems are solved in the project
3. **Always use the design system for colors**:
   - Check if the feature needs color configuration
   - Use `colorSelectionField` and `customColorField` in schemas
   - Import and use `useDesignSystem` hook in components
   - Prefer CSS variables over hardcoded colors
4. Update Sanity schemas if content structure changes are needed
5. Create or update components for rendering new content
6. Implement proper TypeScript types
7. Add appropriate error handling and loading states
8. Consider SEO and accessibility implications

### Color Implementation Checklist
When working with colors in any component or schema:
- [ ] Use `colorSelectionField` for design system color selection
- [ ] Add `customColorField` for custom color fallback
- [ ] Import `useDesignSystem` hook in components
- [ ] Use `resolveColor` or `getCSSVariableForColor` functions
- [ ] Test with both design system and custom colors
- [ ] Ensure backward compatibility with existing color fields

### Schema Updates
- Always update Sanity schemas when adding new content types
- **Replace color picker fields with design system dropdowns**
- Maintain backward compatibility when possible
- Update TypeScript interfaces to match schema changes
- Consider migration strategies for existing content
3. Update Sanity schemas if content structure changes are needed
4. Create or update components for rendering new content
5. Implement proper TypeScript types
6. Add appropriate error handling and loading states
7. Consider SEO and accessibility implications

### Schema Updates
- Always update Sanity schemas when adding new content types
- Maintain backward compatibility when possible
- Update TypeScript interfaces to match schema changes
- Consider migration strategies for existing content

### Component Updates
- Ensure components handle all possible data states
- Implement proper prop validation
- Consider responsive design requirements
- Test with various content scenarios

## Environment and Configuration
- Use environment variables for all configuration
- Never commit sensitive information
- Use different configurations for development, staging, and production
- Implement proper fallbacks for missing environment variables

## Testing Guidelines
- Write unit tests for utility functions
- Implement integration tests for critical user flows
- Test components with various data scenarios
- Test error states and edge cases

## Before Starting Any Task
1. Examine the existing codebase structure
2. Understand current patterns and conventions
3. Check how similar features are implemented
4. Identify any dependencies or constraints
5. Plan the implementation approach
6. Consider the impact on existing functionality

Remember: Always maintain consistency with the existing codebase patterns and architecture decisions.