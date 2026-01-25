# Kongzijs Developer Documentation

Welcome to the Kongzijs FLF-based lesson builder developer documentation. This documentation provides comprehensive guides, RFCs, API references, and design decisions for the project.

## 🎯 Project Focus

This project is an **FLF-based lesson builder system** that enables visual creation and management of educational content using the Fluence Lesson Format (FLF) - a standardized JSON protocol for rich-media lessons.

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server (all packages)
pnpm dev

# Build all packages
pnpm build

# Run tests
pnpm test
```

## 📚 Documentation Structure

### [RFCs](./rfc/)

Request for Comments documents describing FLF architecture and implementation:

#### FLF Core RFCs

- **[RFC 0017: FLF JSON Specification](./rfc/0017-flf-specification.md)** - FLF format specification and JSON schema
- **[RFC 0020: FLF Transformer Engine](./rfc/0020-flf-transformer.md)** - FLF ↔ React Flow bidirectional conversion
- **[RFC 0019: Bundle Management](./rfc/0019-bundle-management.md)** - Physical bundle export (.flz) and asset relocation

#### Lesson Builder RFCs

- **[RFC 0018: Flow Canvas (React Flow)](./rfc/0018-flf-ui-experience.md)** - Visual flow-based editor design
- **[RFC 0022: Asset Library](./rfc/0022-asset-library.md)** - Asset management and drag-and-drop interface
- **[RFC 0023: Node Property Editors](./rfc/0023-node-property-editors.md)** - Node property editing UI

#### Lesson Player RFCs

- **[RFC 0021: Lesson Player Engine](./rfc/0021-lesson-player.md)** - Student-facing lesson playback system

#### Infrastructure RFCs


#### Completed RFCs

See [RFC README](./rfc/README.md) for a complete list of completed RFCs including:
- i18n system
- Authentication & authorization
- User profile enhancements
- Dark mode support
- And more...

### [Guides](./guides/)

Step-by-step guides for common development tasks:

- **[Getting Started](./guides/getting-started.md)** - Project setup and overview
- **[Component Development](./guides/component-development.md)** - Building new components
- **[Internationalization](./guides/internationalization.md)** - Multi-language support

### [Supabase](./supabase/)

Complete guide for Supabase setup, CLI, migrations, and workflows:

- **[Supabase Development Guide](./supabase/)** - Setup, CLI, migrations, troubleshooting, and security
- **[MCP Setup](./supabase/mcp-setup.md)** - Model Context Protocol integration

### [Deployment](./deployment/)

Deployment and infrastructure guides:

- **[Vercel Monorepo Setup](./deployment/vercel-monorepo-setup.md)** - Deploying monorepo to Vercel
- **[Cloudflare + Vercel Setup](./deployment/cloudflare-vercel.md)** - Domain and CDN configuration

### [Testing](./testing/)

Testing guides and best practices:

- **[Testing Guide](./testing/)** - Testing setup and best practices
- **[E2E Guide](./testing/guides/e2e-guide.md)** - End-to-end testing with Playwright
- **[Playwright Setup](./testing/guides/playwright-setup.md)** - Playwright configuration

### [API Reference](./api/)

API documentation for packages, hooks, utilities, and components:

- **[API Index](./api/index.md)** - Complete API reference

## 🎓 FLF Format Overview

**FLF (Fluence Lesson Format)** is the core data protocol for this project. Key concepts:

### Core Principles

1. **Self-Contained**: Single JSON file with all lesson configuration
2. **Protocol-Based Assets**: Unified addressing via `https://`, `local://`, `asset://`, `blob://` protocols
3. **Flow-Based Structure**: Node-based lesson flow (Learn, Test, Resource nodes)
4. **Database-Friendly**: Designed for decomposition into relational tables

### FLF Structure

```json
{
  "flf_version": "1.0",
  "lesson_id": "L-101",
  "settings": { "total_credits": 50 },
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
      "data": { "markdown": "# Content", "media": ["video_1"] }
    }
  ],
  "flow_edges": []
}
```

### Node Types

- **Learn Node**: Content presentation with Markdown and media
- **Test Node**: Quiz validation with passing scores and redirects
- **Resource Node**: Additional learning resources

### Asset Protocols

- `https://` - Remote URLs
- `local://` - Package-relative paths
- `asset://` - Database UUIDs
- `blob://` - Frontend temporary uploads (editor state)

**Learn More**: See [RFC 0017: FLF Specification](./rfc/0017-flf-specification.md) for complete details.

## 📦 Package Documentation

### `@kongzijs/flf-core`

Core FLF implementation package:

- **Types**: Complete TypeScript definitions
- **Validation**: FLF manifest validation
- **Protocol Parsing**: Asset source parsing and building
- **Transformers**: FLF ↔ React Flow conversion
- **Examples**: Sample data generators

See [flf-core README](../packages/flf-core/README.md) for detailed API documentation.

### `@kongzijs/lesson-builder`

Visual lesson builder component:

- **LessonBuilder**: Main builder component
- **CustomNodes**: Learn, Test, Start, End node components
- **NodePropertyPanel**: Property editing interface

### `@kongzijs/ui`

Shared UI component library built with Radix UI and Tailwind CSS.

## 🛠 Project Overview

Kongzijs is a monorepo-based FLF lesson builder system built with:

- **TypeScript** - Full type safety
- **React 18** - UI framework
- **Nx** - Monorepo management
- **pnpm** - Package manager with workspaces
- **Vite** - Fast build tool
- **React Flow** - Visual flow editor
- **Radix UI** - Accessible components
- **Tailwind CSS** - Styling

## 🚀 Key Features

- 🎨 **Visual Lesson Builder** - Drag-and-drop flow-based editor
- 📝 **FLF Format Support** - Standardized JSON lesson format
- 🎯 **Type-Safe** - Complete TypeScript coverage
- 🔄 **Bidirectional Transformation** - FLF ↔ React Flow conversion
- 📦 **Asset Management** - Protocol-based asset references
- 🧪 **Validation** - FLF manifest validation
- 📚 **Comprehensive Documentation** - RFCs and guides

## 📋 Development Roadmap

See [ROADMAP.md](./ROADMAP.md) for the complete development roadmap, including:

- Phase 2: Modern Lesson System (FLF-based)
  - Protocol & Storage Foundation
  - Logic Bridge (Transformer)
  - Lesson Builder (Editor)
  - Player Engine & Governance

## 🤝 Contributing

When contributing to the project:

1. Follow the coding standards (ESLint, Prettier)
2. Use TypeScript for all new files
3. Write documentation for new features
4. Create RFCs for significant design decisions
5. Follow functional programming principles
6. Use pure functions when possible
7. Define constants instead of using strings directly
8. Update this documentation as needed

### Code Style Guidelines

- Use TypeScript for all new files
- Follow functional programming principles where applicable
- Use pure functions when possible
- Keep components modular and focused
- Add comments for complex logic
- Use meaningful variable and function names
- Define constants instead of using strings directly

## 📖 Resources

- [Project README](../README.md) - Main project documentation
- [RFC Documents](./rfc/) - Complete RFC index
- [Development Roadmap](./ROADMAP.md) - Project roadmap and progress
- [flf-core Package](../packages/flf-core/README.md) - FLF core API documentation

---

**Note**: All documentation aligns with the project's core goal: building a comprehensive FLF-based lesson builder system.
