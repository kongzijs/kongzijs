const LEARN_CODE = `{
  "type": "learn",
  "data": {
    "markdown": "# Introduction\\n...",
    "media": ["video_asset_id"]
  },
  "rules": {
    "min_view_time": 60
  }
}`;

const TEST_CODE = `{
  "type": "test",
  "asset_id": "final.quiz",
  "rules": {
    "passing_score": 0.8,
    "on_fail": "redirect_to_learn_node"
  }
}`;

function NodeCard({
    variant,
    title,
    desc,
    code,
    icon,
}: {
    variant: "learn" | "test";
    title: string;
    desc: string;
    code: string;
    icon: React.ReactNode;
}) {
    return (
        <div className="guide-node-card">
            <div className={`guide-node-header ${variant}`}>
                {icon}
                <span>{title}</span>
            </div>
            <p>{desc}</p>
            <div className="code-window" style={{ marginTop: "1rem" }}>
                <div className="code-header">
                    <div className="code-dots">
                        <span className="code-dot dot-red" />
                        <span className="code-dot dot-yellow" />
                        <span className="code-dot dot-green" />
                    </div>
                </div>
                <pre>{code}</pre>
            </div>
        </div>
    );
}

export function GuideNodeTypes() {
    return (
        <div className="guide-block">
            <h3 className="guide-block-title">
                <span className="guide-step-num">03</span>
                Flow Node Types
            </h3>
            <p className="guide-block-desc">
                The lesson graph is made up of two fundamental node types — one
                for presenting content, one for assessing it.
            </p>
            <div className="guide-node-grid">
                <NodeCard
                    variant="learn"
                    title="Learn Node"
                    desc="Delivers knowledge content. Supports Markdown rendering, embedded video / audio, and view-time tracking."
                    code={LEARN_CODE}
                    icon={
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                        </svg>
                    }
                />
                <NodeCard
                    variant="test"
                    title="Test Node"
                    desc="Logic gate for assessment. References an external .quiz script and routes learners based on score — pass, fail, or redirect."
                    code={TEST_CODE}
                    icon={
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="9 11 12 14 22 4" />
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                        </svg>
                    }
                />
            </div>
        </div>
    );
}
