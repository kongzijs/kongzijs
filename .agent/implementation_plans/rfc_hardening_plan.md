# Implementation Plan - RFC Hardening & Boundary Definition

Update RFC 0009 and RFC 0015 to clearly define the boundary between Database (Storage) and Application (Business Logic) for relational lesson content and granular tracking.

## User Review Required

> [!IMPORTANT]
> This plan focuses on DOCUMENTATION first to ensure the architecture is agreed upon before further implementation.

- **DB Boundary**: Database only contains tables for `lesson_sections`, `lesson_questions`, `lesson_options`, `user_lesson_sessions`, and `user_question_responses`. No business logic (DSL parsing) exists in the DB.
- **App Boundary**: Server Actions (App Layer) are responsible for parsing the `QuizDSL` and performing the necessary relational inserts (normalization).

## Proposed Changes

### Documentation (RFCs)

#### 1. Update RFC 0009 (Lesson Storage System)

- Framed as a pure storage layer RFC.
- Define the relational schema for sections, questions, and options.
- Define the tracking schema for sessions and responses.
- Explicitly state that this RFC does NOT cover the logic of _how_ the data gets there.

#### 2. Update RFC 0015 (Tutor Content Management System)

- Define the business logic for content "Decomposition" (DSL -> Relational).
- Specify the Server Action flow for publishing a version.
- Define how statistics are discovered by the tutor.

### Database (Migrations)

- Clean up `20260125000000_relational_lesson_content.sql` to remove the `sync_dsl_to_relational` and `publish_lesson_version` PostgreSQL functions.
- Keep the tables and views.

## Verification Plan

### Automated Tests

- N/A for this documentation-focused plan.

### Manual Verification

- Verify RFC 0009 contains the storage schema.
- Verify RFC 0015 contains the application-layer logic.
