# Kongzijs - FLF-Based Lesson Builder

A modern, visual lesson builder system built on **FLF (Fluence Lesson Format)** - a standardized JSON protocol for creating rich-media educational content. This monorepo provides a complete toolkit for building, editing, and managing interactive lessons with flow-based node editing.

📍 **[查看开发路线图](./docs/ROADMAP.md)** - 了解项目进度和未来规划

## 🎯 Project Overview

This project is an **FLF-based lesson builder** that enables educators and content creators to:

- **Visual Lesson Creation**: Build lessons using a drag-and-drop flow canvas (React Flow)
- **FLF Format Support**: Create and edit lessons in the standardized FLF JSON format
- **Asset Management**: Manage multimedia assets (videos, audio, images, quizzes) with protocol-based references
- **Node-Based Editing**: Use Learn, Test, and Resource nodes to structure lesson content
- **Type-Safe Development**: Full TypeScript support with comprehensive FLF type definitions

## 📋 Table of Contents

- [Core Packages](#-core-packages)
- [FLF Format](#-flf-format)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Development](#-development)
- [Project Structure](#-project-structure)
- [Available Scripts](#-available-scripts)
- [Documentation](#-documentation)
- [Contributing](#-contributing)

## 📦 Core Packages

### `@kongzijs/flf-core`

The foundation package implementing the FLF specification (RFC 0017):

- **Type Definitions**: Complete TypeScript types for FLF manifests
- **Protocol Parsing**: Support for `https://`, `local://`, `asset://`, `blob://` protocols
- **Validation**: FLF manifest validation against schema
- **Transformers**: Bidirectional conversion between FLF and React Flow formats
- **Examples**: Sample FLF data generators for testing

```typescript
import { FLFManifest, validateFLFManifest, FLFTransformer } from "@kongzijs/flf-core";

// Create and validate FLF
const manifest: FLFManifest = createExampleFLF();
const result = validateFLFManifest(manifest);

// Transform to React Flow
const reactFlowData = FLFTransformer.toReactFlow(manifest);
```

### `@kongzijs/lesson-builder`

Visual lesson builder component built with React Flow:

- **Flow Canvas**: Drag-and-drop node-based lesson editor
- **Custom Nodes**: Learn, Test, Start, and End node types
- **Property Panel**: Edit node properties (Markdown content, quiz references, rules)
- **Asset Library**: Manage and reference multimedia assets
- **FLF Integration**: Direct import/export of FLF manifests

```typescript
import { LessonBuilder } from "@kongzijs/lesson-builder";

<LessonBuilder
  lessonId={123}
  initialManifest={flfManifest}
  onSave={async (lessonId, manifest) => {
    // Save FLF manifest
    return { success: true, versionId: "v1.0" };
  }}
/>
```

### `@kongzijs/ui`

Shared UI component library built with Radix UI and Tailwind CSS.

## 🎓 FLF Format

**FLF (Fluence Lesson Format)** is a standardized JSON protocol for defining rich-media lessons. Key features:

- **Self-Contained**: Single JSON file with all lesson configuration
- **Protocol-Based Assets**: Unified addressing for remote URLs, local paths, and database IDs
- **Flow-Based Structure**: Node-based lesson flow with Learn, Test, and Resource nodes
- **Database-Friendly**: Designed for easy decomposition into relational database tables

### FLF Structure

```json
{
  "flf_version": "1.0",
  "lesson_id": "L-101",
  "settings": {
    "total_credits": 50,
    "difficulty": "intermediate"
  },
  "assets_manifest": [
    {
      "id": "video_1",
      "type": "video",
      "src": "asset://550e8400-e29b-41d4-a716-446655440000"
    }
  ],
  "flow_nodes": [
    {
      "id": "node_1",
      "type": "learn",
      "data": {
        "markdown": "# Lesson Content",
        "media": ["video_1"]
      }
    }
  ],
  "flow_edges": []
}
```

**Learn More**: See [RFC 0017: FLF Specification](./docs/rfc/0017-flf-specification.md) for complete details.

## 🛠 Tech Stack

### Core

- **TypeScript**: Full type safety
- **React 18**: UI framework
- **Nx**: Monorepo management
- **pnpm**: Package manager with workspace support
- **Vite**: Fast build tool

### Lesson Builder

- **React Flow (@xyflow/react)**: Flow-based visual editor
- **FLF Core**: FLF format implementation
- **Sonner**: Toast notifications

### UI Components

- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Icon library

### Development Tools

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Type checking

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version >= 23.11.0
- **pnpm**: Version >= 10.9.0

### Installing pnpm

```bash
npm install -g pnpm
```

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd kongzijs
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start development server**

   ```bash
   pnpm dev
   ```

   This will start all packages in development mode using Pangu (monorepo dev tool).

## 💻 Development

### Monorepo Structure

This is an Nx-based monorepo with the following structure:

```
kongzijs/
├── packages/
│   ├── flf-core/          # FLF format implementation
│   ├── lesson-builder/  # Visual lesson builder UI
│   └── ui/               # Shared UI components
├── apps/
│   └── demo-react/       # Demo application
└── docs/                  # Documentation
```

### Development Commands

```bash
# Start all packages in dev mode
pnpm dev

# Build all packages
pnpm build

# Lint all packages
pnpm lint

# Run tests
pnpm test
```

### Package-Specific Commands

```bash
# Work on a specific package
cd packages/flf-core
pnpm dev

cd packages/lesson-builder
pnpm dev
```

## 📁 Project Structure

```
kongzijs/
├── packages/
│   ├── flf-core/
│   │   ├── src/
│   │   │   ├── types.ts           # FLF type definitions
│   │   │   ├── validator.ts       # FLF validation
│   │   │   ├── asset-protocol.ts  # Protocol parsing
│   │   │   ├── transformer.ts     # FLF ↔ React Flow
│   │   │   └── examples.ts        # Sample data
│   │   └── package.json
│   │
│   ├── lesson-builder/
│   │   ├── src/
│   │   │   ├── LessonBuilder.tsx      # Main builder component
│   │   │   ├── CustomNodes.tsx         # Flow node components
│   │   │   └── NodePropertyPanel.tsx   # Property editor
│   │   └── package.json
│   │
│   └── ui/
│       └── src/components/        # Shared UI components
│
├── apps/
│   └── demo-react/               # Demo app using lesson builder
│
├── docs/
│   ├── rfc/                      # RFC documents
│   │   ├── 0017-flf-specification.md
│   │   ├── 0018-flf-ui-experience.md
│   │   ├── 0020-flf-transformer.md
│   │   └── ...
│   └── ROADMAP.md                # Development roadmap
│
├── nx.json                        # Nx configuration
├── pnpm-workspace.yaml           # pnpm workspace config
└── package.json                  # Root package.json
```

## 📜 Available Scripts

| Script         | Description                    |
| -------------- | ------------------------------ |
| `pnpm dev`     | Start all packages in dev mode |
| `pnpm build`   | Build all packages             |
| `pnpm lint`    | Lint all packages              |
| `pnpm test`    | Run tests across packages      |

## 📚 Documentation

### RFC Documents

- **[RFC 0017: FLF Specification](./docs/rfc/0017-flf-specification.md)** - FLF JSON format specification
- **[RFC 0018: Flow Canvas UI](./docs/rfc/0018-flf-ui-experience.md)** - React Flow-based editor design
- **[RFC 0020: FLF Transformer](./docs/rfc/0020-flf-transformer.md)** - FLF ↔ React Flow conversion
- **[RFC 0021: Lesson Player](./docs/rfc/0021-lesson-player.md)** - Student-facing lesson player
- **[RFC 0022: Asset Library](./docs/rfc/0022-asset-library.md)** - Asset management system
- **[RFC 0023: Node Property Editors](./docs/rfc/0023-node-property-editors.md)** - Node editing UI

### Guides

- **[Getting Started](./docs/guides/getting-started.md)** - Project setup and overview
- **[Component Development](./docs/guides/component-development.md)** - Building new components
- **[Development Roadmap](./docs/ROADMAP.md)** - Project roadmap and progress

## 🤝 Contributing

1. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the existing code style
   - Run `pnpm lint` before committing
   - Write clear commit messages
   - Add tests for new features

3. **Test your changes**
   - Ensure all packages build successfully
   - Run tests: `pnpm test`
   - Test in the demo app

4. **Commit your changes**

   ```bash
   git commit -m "Add: your feature description"
   ```

5. **Push and create a Pull Request**

### Code Style Guidelines

- Use TypeScript for all new files
- Follow functional programming principles where applicable
- Use pure functions when possible
- Keep components modular and focused
- Add comments for complex logic
- Use meaningful variable and function names
- Define constants instead of using strings directly

## 📄 License

This project is private and proprietary.

## 🙏 Acknowledgments

- **FLF Format**: Designed for flexible, self-contained lesson definitions
- **React Flow**: Visual flow editing capabilities
- **Radix UI**: Accessible component primitives
- **Nx**: Monorepo management and tooling

---

**Note**: This project is focused on building a comprehensive FLF-based lesson builder system. All documentation and development efforts align with this core goal.
