# GitHub Copilot Instructions for Next.js + Sanity Project

## Project Overview
This is a Next.js application integrated with Sanity CMS for content management. The project follows modern web development practices with TypeScript, focusing on maintainability, security, and performance.

## Core Technologies
- **Frontend**: Next.js 14+ (App Router)
- **Content Management**: Sanity CMS
- **Language**: TypeScript
- **Styling**: Tailwind CSS (assumed)
- **Package Manager**: npm/yarn/pnpm

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