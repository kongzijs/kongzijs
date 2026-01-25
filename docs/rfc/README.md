# RFC (Request for Comments) Documents

This directory contains RFC documents that describe the design decisions, architecture, and implementation details for the Kongzijs FLF-based lesson builder project.

## What is an RFC?

An RFC (Request for Comments) is a document that describes:

- **Design decisions**: Why certain approaches were chosen
- **Architecture**: How systems are structured
- **Implementation details**: How features are built
- **Best practices**: Guidelines for developers
- **Future enhancements**: Potential improvements

## 🎓 FLF Core RFCs

The following RFCs define the core FLF (Fluence Lesson Format) lesson builder system:

### [RFC 0017: FLF JSON Specification](./0017-flf-specification.md)

**Status:** ✅ Implemented  
**Created:** 2026-01-25

Defines the FLF JSON data protocol - the foundation of the lesson builder system.

**Key Topics:**
- FLF JSON schema and structure
- Protocol-based asset references (`https://`, `local://`, `asset://`, `blob://`)
- Flow node types (Learn, Test, Resource)
- Asset manifest system

### [RFC 0020: FLF Transformer Engine](./0020-flf-transformer.md)

**Status:** 📋 Planned  
**Created:** 2026-01-25

Documents the bidirectional transformation between FLF format and React Flow data structures.

**Key Topics:**
- FLF → React Flow conversion
- React Flow → FLF conversion
- Data mapping and validation

### [RFC 0018: Flow Canvas (React Flow)](./0018-flf-ui-experience.md)

**Status:** 📋 Planned  
**Created:** 2026-01-25

Describes the visual flow-based editor UI using React Flow.

**Key Topics:**
- React Flow integration
- Custom node components
- Flow editing interactions

### [RFC 0021: Lesson Player Engine](./0021-lesson-player.md)

**Status:** 📋 Planned  
**Created:** 2026-01-25

Documents the student-facing lesson playback system.

**Key Topics:**
- FLF manifest interpretation
- Node progression logic
- Progress tracking

### [RFC 0022: Asset Library](./0022-asset-library.md)

**Status:** 📋 Planned  
**Created:** 2026-01-25

Describes the asset management and library interface.

**Key Topics:**
- Asset browsing and search
- Drag-and-drop integration
- Asset reference management

### [RFC 0023: Node Property Editors](./0023-node-property-editors.md)

**Status:** 📋 Planned  
**Created:** 2026-01-25

Documents the node property editing interface.

**Key Topics:**
- Markdown editor for Learn nodes
- Quiz configuration for Test nodes
- Rule and settings editors

### [RFC 0019: Bundle Management](./0019-bundle-management.md)

**Status:** 📋 Planned  
**Created:** 2026-01-25

Describes physical bundle export (.flz) and asset relocation.

**Key Topics:**
- Bundle packaging
- Asset path relocation
- Export/import workflows

## RFC Format

Each RFC follows this structure:

1. **Header**: Status, author, dates
2. **Summary**: Brief overview
3. **Motivation**: Why this feature exists
4. **Design Overview**: High-level architecture
5. **Implementation Details**: Technical specifics
6. **Usage Examples**: How to use the feature
7. **Best Practices**: Guidelines for developers
8. **Future Enhancements**: Potential improvements
9. **References**: Related documentation

## Contributing

When creating a new RFC:

1. Use the format: `000X-feature-name.md`
2. Follow the RFC template structure
3. Include code examples
4. Document both current state and future plans
5. Update this README with the new RFC

## Status Definitions

- **Draft**: Under discussion, not yet implemented
- **Planned**: Approved for implementation
- **Implemented**: Fully implemented and in use
- **Deprecated**: No longer recommended
- **Superseded**: Replaced by another RFC
