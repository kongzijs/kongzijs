import { Link } from "react-router-dom";

const TRACKING = [
    {
        key: "track_id",
        desc: "A business identifier used to distinguish this step in analytics dashboards.",
    },
    {
        key: "is_milestone",
        desc: "Marks a node as a key checkpoint for phased credit settlement.",
    },
];

export function GuideTracking() {
    return (
        <>
            <div className="guide-block">
                <h3 className="guide-block-title">
                    <span className="guide-step-num">05</span>
                    Tracking Points
                </h3>
                <p className="guide-block-desc">
                    Every node can carry optional tracking attributes for
                    analytics and credit accounting.
                </p>
                <div className="guide-tracking-grid">
                    {TRACKING.map((t) => (
                        <div key={t.key} className="guide-tracking-card">
                            <code className="tracking-key">{t.key}</code>
                            <p>{t.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="guide-cta">
                <p>Ready to start building?</p>
                <Link to="/" className="btn btn-primary">
                    View the Demo
                </Link>
            </div>
        </>
    );
}
