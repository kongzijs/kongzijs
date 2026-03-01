import { Link } from "react-router-dom";
import { BuilderDemo } from "../../BuilderDemo";

export function HeroSection() {
    return (
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
                        KongziJS is a modern visual lesson builder system fully
                        based on the FLF (Fluence Lesson Format). It provides a
                        complete toolset for authoring, editing, and managing
                        interactive courses using flow-based node editing.
                    </p>

                    <div className="hero-actions">
                        <Link to="/docs/flf" className="btn btn-primary">
                            Get Started
                        </Link>
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

                <div
                    id="get-started"
                    style={{ marginTop: "3rem", paddingBottom: "4rem" }}
                >
                    <BuilderDemo />
                </div>
            </div>
        </section>
    );
}
