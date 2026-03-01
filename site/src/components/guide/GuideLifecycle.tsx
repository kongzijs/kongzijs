const STEPS = [
    {
        badge: "runtime",
        label: "Runtime",
        title: "Editing",
        desc: (
            <>
                The frontend editor holds the live JSON. New uploads use a
                temporary <code>blob://</code> src until the lesson is saved.
            </>
        ),
    },
    {
        badge: "persisted",
        label: "Persisted",
        title: "Save",
        desc: (
            <>
                The Transformer resolves <code>local://</code> files to
                long-term storage and unpacks Quiz DSLs into relational tables.
            </>
        ),
    },
    {
        badge: "delivery",
        label: "Delivery",
        title: "Playback",
        desc: (
            <>
                When a student opens a lesson, the App layer rewrites each{" "}
                <code>asset://UUID</code> to a signed CDN URL on demand.
            </>
        ),
    },
];

export function GuideLifecycle() {
    return (
        <div className="guide-block">
            <h3 className="guide-block-title">
                <span className="guide-step-num">04</span>
                Reference Lifecycle
            </h3>
            <p className="guide-block-desc">
                An FLF document passes through three distinct states as it moves
                from authoring to delivery.
            </p>
            <div className="guide-lifecycle">
                {STEPS.map((s, i) => (
                    <>
                        <div key={s.badge} className="guide-lifecycle-step">
                            <div className={`lifecycle-badge ${s.badge}`}>
                                {s.label}
                            </div>
                            <div className="lifecycle-body">
                                <h4>{s.title}</h4>
                                <p>{s.desc}</p>
                            </div>
                        </div>
                        {i < STEPS.length - 1 && (
                            <div
                                key={`arrow-${i}`}
                                className="guide-lifecycle-arrow"
                            >
                                →
                            </div>
                        )}
                    </>
                ))}
            </div>
        </div>
    );
}
