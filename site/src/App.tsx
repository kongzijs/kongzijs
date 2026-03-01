import { BuilderDemo } from "./BuilderDemo";

function App() {
    return (
        <>
            <header className="header">
                <div className="container">
                    <a
                        href={import.meta.env.BASE_URL}
                        className="logo"
                        style={{ textDecoration: "none" }}
                    >
                        <div className="logo-icon">
                            <img
                                src={`${import.meta.env.BASE_URL}logo.png`}
                                alt="KongziJS Logo"
                                className="logo-icon"
                            />
                        </div>
                        <span>KongziJS</span>
                    </a>
                    <nav className="nav-links">
                        <a href="#features" className="nav-link">
                            Features
                        </a>
                        <a href="#docs" className="nav-link">
                            Documentation
                        </a>
                        <a
                            href="https://github.com/kongzijs/kongzijs"
                            className="nav-link"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            GitHub
                        </a>
                    </nav>
                </div>
            </header>

            <main>
                <section className="hero">
                    <div className="hero-bg"></div>
                    <div className="container">
                        <div className="hero-content">
                            <div className="hero-badge">
                                <span className="dot"></span>
                                v0.1.0 Open Source Release
                            </div>

                            <h1>
                                FLF-Based Visual <span>Lesson Builder</span>.
                            </h1>

                            <p>
                                KongziJS is a modern visual lesson builder
                                system fully based on the FLF (Fluence Lesson
                                Format). It provides a complete toolset for
                                authoring, editing, and managing interactive
                                courses using flow-based node editing.
                            </p>

                            <div className="hero-actions">
                                <a
                                    href="#get-started"
                                    className="btn btn-primary"
                                >
                                    Get Started
                                </a>
                                <a
                                    href="https://github.com/kongzijs/kongzijs"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-secondary"
                                >
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                                    </svg>
                                    Star on GitHub
                                </a>
                            </div>
                        </div>

                        {/* Live demo — visible immediately on page load */}
                        <div
                            id="get-started"
                            style={{ marginTop: "3rem", paddingBottom: "4rem" }}
                        >
                            <BuilderDemo />
                        </div>
                    </div>
                </section>

                <section id="features" className="features">
                    <div className="container">
                        <div className="section-header">
                            <h2>Built for Interactive Education</h2>
                            <p>
                                A complete toolset for authoring FLF (Fluence
                                Lesson Format) standard courses.
                            </p>
                        </div>

                        <div className="features-grid">
                            <div className="feature-card">
                                <div className="feature-icon">
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line
                                            x1="12"
                                            y1="16"
                                            x2="12"
                                            y2="12"
                                        ></line>
                                        <line
                                            x1="12"
                                            y1="8"
                                            x2="12.01"
                                            y2="8"
                                        ></line>
                                    </svg>
                                </div>
                                <h3>FLF First Architecture</h3>
                                <p>
                                    Fully implements the FLF JSON specification
                                    (RFC 0017) with strict validation, protocol
                                    parsing, and seamless React Flow
                                    bi-directional transformers.
                                </p>
                            </div>

                            <div className="feature-card">
                                <div className="feature-icon">
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                                        <polyline points="2 17 12 22 22 17"></polyline>
                                        <polyline points="2 12 12 17 22 12"></polyline>
                                    </svg>
                                </div>
                                <h3>Monorepo Scale</h3>
                                <p>
                                    Engineered via Turborepo & pnpm workspaces
                                    to isolate components, editors, and
                                    translation layers into distinct consumable
                                    packages.
                                </p>
                            </div>

                            <div className="feature-card">
                                <div className="feature-icon">
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                        <line
                                            x1="12"
                                            y1="22.08"
                                            x2="12"
                                            y2="12"
                                        ></line>
                                    </svg>
                                </div>
                                <h3>React Ecosystem Compatible</h3>
                                <p>
                                    Integrates seamlessly with Vite, React 19,
                                    TailwindCSS, and leverages powerful
                                    sub-engines like QuizerJS for rich media
                                    handling.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="packages" className="info-section">
                    <div className="container">
                        <h2>Core Packages</h2>
                        <p className="lead">
                            Engineered via Turborepo & pnpm workspaces to
                            isolate components, editors, and translation layers.
                        </p>

                        <div className="package-grid">
                            <div className="package-card">
                                <h3>@kongzijs/flf-core</h3>
                                <p>
                                    The core implementation of the FLF
                                    specification. Provides everything needed to
                                    validate, parse, and transform FLF data.
                                </p>
                                <ul>
                                    <li>Full FLF TypeScript Types</li>
                                    <li>
                                        <code>asset://</code> and{" "}
                                        <code>local://</code> protocol parsing
                                    </li>
                                    <li>
                                        Bi-directional React Flow Transformers
                                    </li>
                                </ul>
                                <div className="code-window">
                                    <div className="code-header">
                                        <div className="code-dots">
                                            <div className="code-dot dot-red"></div>
                                            <div className="code-dot dot-yellow"></div>
                                            <div className="code-dot dot-green"></div>
                                        </div>
                                        <span className="code-title">
                                            core-example.ts
                                        </span>
                                    </div>
                                    <pre>
                                        <code>{`import { validateFLFManifest, FLFTransformer } from "@kongzijs/flf-core";\n\nconst isValid = validateFLFManifest(manifest);\nconst reactFlowData = FLFTransformer.toReactFlow(manifest);`}</code>
                                    </pre>
                                </div>
                            </div>

                            <div className="package-card">
                                <h3>@kongzijs/lesson-builder</h3>
                                <p>
                                    Visual React Flow based editor components.
                                    Drop this into your application to enable
                                    full courses authoring.
                                </p>
                                <ul>
                                    <li>Drag & Drop Canvas</li>
                                    <li>Learn, Test, Resource custom nodes</li>
                                    <li>Integrated Property Panels</li>
                                </ul>
                                <div className="code-window">
                                    <div className="code-header">
                                        <div className="code-dots">
                                            <div className="code-dot dot-red"></div>
                                            <div className="code-dot dot-yellow"></div>
                                            <div className="code-dot dot-green"></div>
                                        </div>
                                        <span className="code-title">
                                            editor.tsx
                                        </span>
                                    </div>
                                    <pre>
                                        <code>{`import { LessonBuilder } from "@kongzijs/lesson-builder";\n\n<LessonBuilder\n  lessonId={123}\n  initialManifest={flfManifest}\n  onSave={handleSave}\n/>`}</code>
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="protocol" className="info-section">
                    <div className="container">
                        <h2>The FLF Protocol</h2>
                        <p className="lead">
                            Fluence Lesson Format (FLF) is the definitive,
                            self-contained JSON standard for describing
                            interactive educational flows.
                        </p>

                        <div className="package-grid">
                            <div>
                                <h3
                                    style={{
                                        marginBottom: "1.5rem",
                                        fontSize: "1.5rem",
                                        color: "var(--color-primary)",
                                    }}
                                >
                                    Node Types
                                </h3>
                                <div className="node-type">
                                    <div className="node-icon">📚</div>
                                    <div className="node-content">
                                        <h4>Learn Node</h4>
                                        <p>
                                            Delivers Markdown content and rich
                                            media assets.
                                        </p>
                                    </div>
                                </div>
                                <div className="node-type">
                                    <div className="node-icon">🎯</div>
                                    <div className="node-content">
                                        <h4>Test Node</h4>
                                        <p>
                                            Evaluates users via Quiz DSL with
                                            branching logic.
                                        </p>
                                    </div>
                                </div>
                                <div className="node-type">
                                    <div className="node-icon">🔗</div>
                                    <div className="node-content">
                                        <h4>Resource Node</h4>
                                        <p>
                                            Provides external attachments and
                                            links.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3
                                    style={{
                                        marginBottom: "1.5rem",
                                        fontSize: "1.5rem",
                                        color: "var(--color-primary)",
                                    }}
                                >
                                    Asset URIs
                                </h3>
                                <p
                                    style={{
                                        color: "var(--color-text-muted)",
                                        marginBottom: "1.5rem",
                                    }}
                                >
                                    FLF abstracts file storage via universal
                                    protocol prefixes:
                                </p>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "1rem",
                                    }}
                                >
                                    <div>
                                        <span className="protocol-badge">
                                            asset://
                                        </span>
                                        <span
                                            style={{
                                                color: "var(--color-text-muted)",
                                                fontSize: "0.95rem",
                                            }}
                                        >
                                            Resolves to a database UUID
                                            endpoint.
                                        </span>
                                    </div>
                                    <div>
                                        <span className="protocol-badge">
                                            local://
                                        </span>
                                        <span
                                            style={{
                                                color: "var(--color-text-muted)",
                                                fontSize: "0.95rem",
                                            }}
                                        >
                                            Relative path within an exported
                                            .flz bundle.
                                        </span>
                                    </div>
                                    <div>
                                        <span className="protocol-badge">
                                            blob://
                                        </span>
                                        <span
                                            style={{
                                                color: "var(--color-text-muted)",
                                                fontSize: "0.95rem",
                                            }}
                                        >
                                            Temporary frontend browser memory
                                            references.
                                        </span>
                                    </div>
                                    <div>
                                        <span className="protocol-badge">
                                            https://
                                        </span>
                                        <span
                                            style={{
                                                color: "var(--color-text-muted)",
                                                fontSize: "0.95rem",
                                            }}
                                        >
                                            Absolute remote URL fallback.
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="quick-start" className="info-section">
                    <div
                        className="container"
                        style={{ maxWidth: "800px", margin: "0 auto" }}
                    >
                        <h2>Quick Start</h2>
                        <p className="lead">
                            Get up and running with the KongziJS monorepo
                            locally.
                        </p>

                        <div className="code-window">
                            <div className="code-header">
                                <div className="code-dots">
                                    <div className="code-dot dot-red"></div>
                                    <div className="code-dot dot-yellow"></div>
                                    <div className="code-dot dot-green"></div>
                                </div>
                                <span className="code-title">terminal</span>
                            </div>
                            <pre>
                                <code>{`# Clone the repository
git clone <repository-url>
cd kongzijs

# Install dependencies via pnpm workspace
pnpm install

# Start development environments (Apps & Packages)
pnpm dev

# Build the entire monorepo
pnpm build`}</code>
                            </pre>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="footer">
                <div className="container">
                    <p>
                        © {new Date().getFullYear()} KongziJS. Open source
                        software under MIT license.
                    </p>
                    <div className="footer-links">
                        <a href="https://github.com/kongzijs/kongzijs">
                            Repository
                        </a>
                        <a href="https://github.com/kongzijs/kongzijs/issues">
                            Report Issue
                        </a>
                        <a href="#">X (Twitter)</a>
                    </div>
                </div>
            </footer>
        </>
    );
}

export default App;
