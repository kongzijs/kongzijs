const PACKAGES = [
    {
        name: "@kongzijs/flf-core",
        desc: "The core implementation of the FLF specification. Provides everything needed to validate, parse, and transform FLF data.",
        bullets: [
            "Full FLF TypeScript Types",
            <>
                <code>asset://</code> and <code>local://</code> protocol parsing
            </>,
            "Bi-directional React Flow Transformers",
        ],
        file: "core-example.ts",
        code: `import { validateFLFManifest, FLFTransformer } from "@kongzijs/flf-core";

const isValid = validateFLFManifest(manifest);
const reactFlowData = FLFTransformer.toReactFlow(manifest);`,
    },
    {
        name: "@kongzijs/flf-builder",
        desc: "Visual React Flow based editor components. Drop this into your application to enable full course authoring.",
        bullets: [
            "Drag & Drop Canvas",
            "Learn, Test, Resource custom nodes",
            "Integrated Property Panels",
        ],
        file: "editor.tsx",
        code: `import { LessonBuilder } from "@kongzijs/flf-builder";

<LessonBuilder
  lessonId={123}
  initialManifest={flfManifest}
  onSave={handleSave}
/>`,
    },
];

function CodeWindow({ file, code }: { file: string; code: string }) {
    return (
        <div className="code-window">
            <div className="code-header">
                <div className="code-dots">
                    <div className="code-dot dot-red"></div>
                    <div className="code-dot dot-yellow"></div>
                    <div className="code-dot dot-green"></div>
                </div>
                <span className="code-title">{file}</span>
            </div>
            <pre>
                <code>{code}</code>
            </pre>
        </div>
    );
}

export function PackagesSection() {
    return (
        <section id="packages" className="info-section">
            <div className="container">
                <h2>Core Packages</h2>
                <p className="lead">
                    Engineered via Turborepo &amp; pnpm workspaces to isolate
                    components, editors, and translation layers.
                </p>
                <div className="package-grid">
                    {PACKAGES.map((pkg) => (
                        <div key={pkg.name} className="package-card">
                            <h3>{pkg.name}</h3>
                            <p>{pkg.desc}</p>
                            <ul>
                                {pkg.bullets.map((b, i) => (
                                    <li key={i}>{b}</li>
                                ))}
                            </ul>
                            <CodeWindow file={pkg.file} code={pkg.code} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
