# Next.js Boilerplate

A minimal, opinionated starter for building modern Next.js applications with TypeScript and sensible defaults for linting, formatting, and testing.

## Features
- Next.js + TypeScript
- Tailwind CSS (optional)
- ESLint + Prettier configured
- Husky pre-commit hooks
- Testing setup (Jest / Vitest)
- Environment variable pattern (.env.local)
- Opinionated src/ structure

## Prerequisites
- Node.js 18+
- npm, yarn or pnpm

## Quick Start
1. Clone the repo:
  git clone <repo>
2. Install dependencies:
  npm install
  # or
  yarn
  # or
  pnpm install
3. Copy env example:
  cp .env.example .env.local
4. Start development server:
  npm run dev

## Available scripts
- npm run dev — start dev server
- npm run build — production build
- npm run start — run production server
- npm run lint — run ESLint
- npm run format — run Prettier
- npm run test — run tests
- npm run typecheck — TypeScript type check

## Environment
Create a .env.local with values required for your app:
```
NEXT_PUBLIC_API_URL=https://api.example.com
DATABASE_URL=...
```

## Project layout (recommended)
src/
- pages/ or app/
- components/
- lib/ (helpers, api)
- styles/
- hooks/
public/
.next.config.js
tsconfig.json
package.json
.eslintrc.cjs
.prettierrc

## Contributing
- Follow commit message convention
- Run lint and tests before opening PR
- Keep changes small and documented

## License
Specify a license (e.g., MIT) in LICENSE file.