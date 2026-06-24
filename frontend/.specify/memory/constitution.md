# Big Bank Theory Constitution
<!-- React + MUI Banking Application -->

## Core Principles

### I. Library-First
<!-- Every component/feature as reusable, self-contained module -->
Every component and feature must be designed as a standalone, reusable library. Components are self-contained, independently importable, and documented. No component should be tightly coupled to specific pages or contexts. Favor composition and prop-driven architecture for maximum reusability.

### II. User Experience First
<!-- User needs drive all decisions -->
Every feature decision prioritizes user experience and accessibility. Design decisions must consider: ease of use, visual clarity, performance, and responsive behavior. Features that negatively impact UX are deprioritized or redesigned. User feedback and intuitive interactions guide implementation. MUI components must be configured to provide the best user experience, not just default styling.

### III. Test-Driven Development (NON-NEGOTIABLE)
<!-- TDD mandatory: Tests written → Implementation -->
All code follows strict TDD: Write tests first, define behavior through tests, then implement. Red-Green-Refactor cycle is enforced. Components ship with passing unit and integration tests. No feature is considered complete without test coverage. Tests validate both functionality and user interaction patterns.

### IV. React Best Practices
<!-- Functional components, hooks, proper prop management -->
Use functional components with hooks throughout. Props are the primary communication mechanism. State is managed at the appropriate level. Component reusability is maximized through proper prop interfaces. React patterns are followed consistently.

### V. MUI Integration Standards
<!-- Consistent Material Design implementation -->
All MUI components are properly configured with ThemeProvider. Components must be compatible with React 19. Version consistency is maintained across @mui/material and @mui/icons-material. Styling follows MUI patterns (sx prop, theme customization).

## Development Requirements

### Dependencies & Compatibility
- React 19.x with proper MUI v6+ setup
- All MUI components require ThemeProvider wrapper
- Version alignment: @mui/material and @mui/icons-material must match major versions
- No breaking version mismatches in dependencies

### Code Quality Gates
- Tests written before implementation
- All components documented with usage examples
- Code passes linting and follows React conventions
- No console errors or warnings in development

### Component Architecture
- Functional, reusable components with clear prop interfaces
- Separation of concerns: components, pages, services
- Proper state management and hook usage
- Accessibility considerations in all UI components

## Governance

**Constitution supersedes all other practices.** All PRs and code reviews must verify compliance with these principles. Amendments require documentation and team approval.

**Version**: 1.0.0 | **Ratified**: 2026-06-24 | **Last Amended**: 2026-06-24
