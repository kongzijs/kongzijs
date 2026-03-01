const NODE_TYPES = [
    {
        icon: "📚",
        title: "Learn Node",
        desc: "Delivers Markdown content and rich media assets.",
    },
    {
        icon: "🎯",
        title: "Test Node",
        desc: "Evaluates users via Quiz DSL with branching logic.",
    },
    {
        icon: "🔗",
        title: "Resource Node",
        desc: "Provides external attachments and links.",
    },
];

const ASSET_URIS = [
    ["asset://", "Resolves to a database UUID endpoint."],
    ["local://", "Relative path within an exported .flz bundle."],
    ["blob://", "Temporary frontend browser memory references."],
    ["https://", "Absolute remote URL fallback."],
] as const;

export function ProtocolSection() {
    return (
        <section id="protocol" className="info-section">
            <div className="container">
                <h2>The FLF Protocol</h2>
                <p className="lead">
                    Fluence Lesson Format (FLF) is the definitive,
                    self-contained JSON standard for describing interactive
                    educational flows.
                </p>
                <div className="package-grid">
                    {/* Node types */}
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
                        {NODE_TYPES.map((n) => (
                            <div key={n.title} className="node-type">
                                <div className="node-icon">{n.icon}</div>
                                <div className="node-content">
                                    <h4>{n.title}</h4>
                                    <p>{n.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Asset URIs */}
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
                            FLF abstracts file storage via universal protocol
                            prefixes:
                        </p>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "1rem",
                            }}
                        >
                            {ASSET_URIS.map(([badge, desc]) => (
                                <div key={badge}>
                                    <span className="protocol-badge">
                                        {badge}
                                    </span>
                                    <span
                                        style={{
                                            color: "var(--color-text-muted)",
                                            fontSize: "0.95rem",
                                        }}
                                    >
                                        {" "}
                                        {desc}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
