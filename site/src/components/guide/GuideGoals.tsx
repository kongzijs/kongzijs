const GOALS = [
    {
        title: "Self-contained",
        desc: "One-click export bundles all referenced assets into a portable package.",
        icon: (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                <line x1="12" y1="12" x2="12" y2="12" />
            </svg>
        ),
    },
    {
        title: "Protocol-addressed assets",
        desc: "Remote URLs, local paths, and database IDs share a single unified addressing scheme.",
        icon: (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
        ),
    },
    {
        title: "Relational-storage friendly",
        desc: "The structure maps cleanly to normalised database tables via built-in Transformers.",
        icon: (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <ellipse cx="12" cy="5" rx="9" ry="3" />
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
            </svg>
        ),
    },
];

export function GuideGoals() {
    return (
        <div className="guide-goals">
            {GOALS.map((g) => (
                <div key={g.title} className="guide-goal-card">
                    <div className="guide-goal-icon">{g.icon}</div>
                    <h4>{g.title}</h4>
                    <p>{g.desc}</p>
                </div>
            ))}
        </div>
    );
}
