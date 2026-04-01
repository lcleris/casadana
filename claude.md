# Casa Dana - Project Rules & Guidelines

## Project Overview

Monorepo with:

- **Frontend**: React 19 + Vite + TypeScript (Bun)
- **Backend**: Go API
- **Database**: PostgreSQL
- **Package Manager**: Bun

## Rules & Conventions

### Frontend (React/TypeScript)

**Type Safety**

- ❌ NO `any` types - always define explicit types
- Use `Array<Type>` instead of `Type[]` syntax
- Example: `Array<string>` not `string[]`

**Component Structure**

- All components and page views must be **function components** (not class components)
- Handler functions (like `handleClick`, `handleSubmit`) must be `const` arrows

  ```tsx
  const handleClick = () => {
    /* logic */
  };
  ```

**Conditional Logic**

- ❌ NO nested if statements
- ✅ Favor **object mapping** for conditional rendering

  ```tsx
  // Instead of nested ifs, use object mapping
  const statusMessages = {
    pending: "Loading...",
    success: "Done!",
    error: "Failed",
  };
  return <div>{statusMessages[status]}</div>;
  ```

- ❌ NO nested ternary operators
- ✅ Use intermediate variables or object mapping instead

**Styling**

- Use **OKCH color space** instead of hex values
- Example: `okch(70% 0.15 200)` instead of `#FF5733`

**File**

- kebab-case for file names (e.g., `user-profile.tsx`, `dashboard-view.tsx`)
- camelCase for variable and function names (e.g., `userName`, `handleSubmit`)

### Backend (Go)

**Architecture**

- Follow **Clean Architecture** principles (or Hexagonal if preferred)
- Ensure high scalability and modularity
- Clear separation of concerns:
  - **Domain** layer (entities, use cases)
  - **Application** layer (services, handlers)
  - **Infrastructure** layer (databases, external services)
  - **Interface** layer (HTTP handlers, routers)

**Structure**

- Well-organized package structure
- Clear dependencies flow (avoid circular dependencies)
- Interface-based design for abstraction

### General

- Keep code clean, readable, and maintainable
- Follow language-specific idioms and best practices

### Docker & Development

- Use `mise run docker-dev` for development
- Hot reload is enabled for frontend changes
- Environment variables are managed by mise
