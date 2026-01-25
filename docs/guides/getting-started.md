# Getting Started

This guide will help you get started with the Kongzijs FLF-based lesson builder development.

## Prerequisites

- **Node.js**: Version >= 23.11.0
- **pnpm**: Version >= 10.9.0
- **Git**: For version control

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd kongzijs
```

2. Install dependencies:

```bash
pnpm install
```

## Development

### Start Development Server

```bash
pnpm dev
```

This will start all packages in development mode using Pangu (monorepo dev tool). The demo app will be available at the port shown in the terminal.

### Working with Packages

This is a monorepo with multiple packages:

```bash
# Work on flf-core package
cd packages/flf-core
pnpm dev

# Work on lesson-builder package
cd packages/lesson-builder
pnpm dev

# Work on demo app
cd apps/demo-react
pnpm dev
```

## Project Structure

```
kongzijs/
├── packages/
│   ├── flf-core/              # FLF format implementation
│   │   ├── src/
│   │   │   ├── types.ts       # FLF type definitions
│   │   │   ├── validator.ts   # FLF validation
│   │   │   ├── asset-protocol.ts  # Protocol parsing
│   │   │   ├── transformer.ts # FLF ↔ React Flow
│   │   │   └── examples.ts    # Sample data
│   │   └── package.json
│   │
│   ├── lesson-builder/        # Visual lesson builder
│   │   ├── src/
│   │   │   ├── LessonBuilder.tsx
│   │   │   ├── CustomNodes.tsx
│   │   │   └── NodePropertyPanel.tsx
│   │   └── package.json
│   │
│   └── ui/                    # Shared UI components
│       └── src/components/
│
├── apps/
│   └── demo-react/            # Demo application
│
├── docs/                      # Documentation
│   ├── rfc/                   # RFC documents
│   ├── guides/                # Developer guides
│   └── ROADMAP.md            # Development roadmap
│
├── nx.json                    # Nx configuration
├── pnpm-workspace.yaml       # pnpm workspace config
└── package.json              # Root package.json
```

## Available Scripts

### Development
- `pnpm dev` - Start all packages in dev mode
- `pnpm build` - Build all packages
- `pnpm lint` - Lint all packages
- `pnpm test` - Run tests across packages

### Package-Specific
Each package has its own scripts. See individual `package.json` files for details.

## Understanding FLF

**FLF (Fluence Lesson Format)** is the core data protocol for this project. Before diving into development, familiarize yourself with:

1. **[RFC 0017: FLF Specification](../rfc/0017-flf-specification.md)** - Complete FLF format documentation
2. **[flf-core README](../../packages/flf-core/README.md)** - FLF core API documentation

### Quick FLF Example

```typescript
import { FLFManifest, validateFLFManifest } from "@kongzijs/flf-core";

// Create an FLF manifest
const manifest: FLFManifest = {
  flf_version: "1.0",
  lesson_id: "L-101",
  settings: {
    total_credits: 50,
    difficulty: "intermediate"
  },
  assets_manifest: [
    {
      id: "video_1",
      type: "video",
      src: "asset://550e8400-e29b-41d4-a716-446655440000"
    }
  ],
  flow_nodes: [
    {
      id: "node_1",
      type: "learn",
      data: {
        markdown: "# Lesson Content",
        media: ["video_1"]
      }
    }
  ],
  flow_edges: []
};

// Validate FLF
const result = validateFLFManifest(manifest);
if (result.valid) {
  console.log("FLF is valid!");
}
```

## Code Style

The project uses:

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking

Run `pnpm lint` before committing.

### Code Guidelines

- Use TypeScript for all new files
- Follow functional programming principles where applicable
- Use pure functions when possible
- Keep components modular and focused
- Define constants instead of using strings directly
- Add comments for complex logic

## Next Steps

- Read the [FLF Specification](../rfc/0017-flf-specification.md) to understand the format
- Check out [Component Development](./component-development.md) for building components
- Review [RFCs](../rfc/) for design decisions
- Explore the [Development Roadmap](../ROADMAP.md) for project progress

## Key Concepts

### FLF Format
- Self-contained JSON format for lessons
- Protocol-based asset references (`https://`, `local://`, `asset://`, `blob://`)
- Flow-based node structure (Learn, Test, Resource nodes)

### Lesson Builder
- Visual drag-and-drop editor using React Flow
- Node-based lesson creation
- Property panels for editing node content

### Monorepo Structure
- Shared packages (`flf-core`, `ui`)
- Independent apps (`demo-react`)
- Workspace-based dependency management

---

**Note**: This project is focused on building a comprehensive FLF-based lesson builder system. All development efforts align with this core goal.
