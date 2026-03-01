import { Link, NavLink } from "react-router-dom";

const NAV_LINKS = [
    { to: "/", label: "Home", end: true },
    { to: "/features", label: "Features", end: false },
    { to: "/packages", label: "Packages", end: false },
    { to: "/protocol", label: "Protocol", end: false },
    { to: "/get-started", label: "Get Started", end: false },
    { to: "/docs/flf", label: "Docs", end: false },
];

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <header className="header">
                <div className="container header-inner">
                    <Link
                        to="/"
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
                    </Link>

                    <nav className="nav-links">
                        {NAV_LINKS.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.end}
                                className={({ isActive }) =>
                                    `nav-link${isActive ? " nav-link--active" : ""}`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>

                    <a
                        href="https://github.com/kongzijs/kongzijs"
                        className="btn btn-secondary btn-sm"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                        </svg>
                        GitHub
                    </a>
                </div>
            </header>

            <main className="page-main">{children}</main>

            <footer className="footer">
                <div className="container footer-inner">
                    <div className="footer-brand">
                        <Link
                            to="/"
                            className="logo"
                            style={{
                                textDecoration: "none",
                                fontSize: "1.1rem",
                            }}
                        >
                            <span>KongziJS</span>
                        </Link>
                        <p>
                            Open source interactive course tooling
                            <br />
                            built on the FLF specification.
                        </p>
                    </div>

                    <div className="footer-nav-group">
                        <span className="footer-nav-label">Product</span>
                        {NAV_LINKS.slice(1, 4).map((l) => (
                            <Link
                                key={l.to}
                                to={l.to}
                                className="footer-nav-link"
                            >
                                {l.label}
                            </Link>
                        ))}
                    </div>

                    <div className="footer-nav-group">
                        <span className="footer-nav-label">Resources</span>
                        <Link to="/get-started" className="footer-nav-link">
                            Get Started
                        </Link>
                        <Link to="/docs/flf" className="footer-nav-link">
                            FLF Documentation
                        </Link>
                    </div>

                    <div className="footer-nav-group">
                        <span className="footer-nav-label">Links</span>
                        <a
                            href="https://github.com/kongzijs/kongzijs"
                            className="footer-nav-link"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Repository
                        </a>
                        <a
                            href="https://github.com/kongzijs/kongzijs/issues"
                            className="footer-nav-link"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Report Issue
                        </a>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>
                        © {new Date().getFullYear()} KongziJS. Open source
                        software under MIT license.
                    </p>
                </div>
            </footer>
        </>
    );
}
