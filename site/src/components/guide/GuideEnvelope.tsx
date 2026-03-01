const ENVELOPE_JSON = `{
  "flf_version": "1.0",
  "lesson_id":   "L-101",
  "settings": {
    "total_credits": 50,
    "difficulty":    "intermediate"
  },
  "assets_manifest": [],   // all media declared here
  "flow_nodes":      [],   // content & quiz nodes
  "flow_edges":      []    // connections between nodes
}`;

export function GuideEnvelope() {
    return (
        <div className="guide-block">
            <h3 className="guide-block-title">
                <span className="guide-step-num">01</span>
                The Envelope
            </h3>
            <p className="guide-block-desc">
                Every FLF document is a single JSON object. The top-level
                envelope gives the format version, a unique lesson identifier,
                global settings, and three arrays that hold all content.
            </p>
            <div className="code-window">
                <div className="code-header">
                    <div className="code-dots">
                        <span className="code-dot dot-red" />
                        <span className="code-dot dot-yellow" />
                        <span className="code-dot dot-green" />
                    </div>
                    <span className="code-title">lesson.flf.json</span>
                </div>
                <pre>{ENVELOPE_JSON}</pre>
            </div>
        </div>
    );
}
