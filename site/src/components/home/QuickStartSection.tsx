import { Link } from "react-router-dom";

const SHELL_CODE = `# Clone the repository
git clone <repository-url>
cd kongzijs

# Install dependencies via pnpm workspace
pnpm install

# Start development environments (Apps & Packages)
pnpm dev

# Build the entire monorepo
pnpm build`;

export function QuickStartSection() {
    return (
        <section id="quick-start" className="info-section">
            <div
                className="container"
                style={{ maxWidth: "800px", margin: "0 auto" }}
            >
                <h2>Quick Start</h2>
                <p className="lead">
                    Get up and running with the KongziJS monorepo locally.
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
                        <code>{SHELL_CODE}</code>
                    </pre>
                </div>

                <div style={{ marginTop: "2.5rem", textAlign: "center" }}>
                    <Link to="/docs/flf" className="btn btn-primary">
                        Read the FLF Guide →
                    </Link>
                </div>
            </div>
        </section>
    );
}
