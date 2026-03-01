import { GuideGoals } from "./components/guide/GuideGoals";
import { GuideEnvelope } from "./components/guide/GuideEnvelope";
import { GuideAssetManifest } from "./components/guide/GuideAssetManifest";
import { GuideNodeTypes } from "./components/guide/GuideNodeTypes";
import { GuideLifecycle } from "./components/guide/GuideLifecycle";
import { GuideTracking } from "./components/guide/GuideTracking";

export function FLFGuide() {
    return (
        <section id="docs" className="flf-guide">
            <div className="container">
                <div className="section-header">
                    <div className="guide-eyebrow">Documentation</div>
                    <h2>What is FLF?</h2>
                    <p>
                        <strong>Fluence Lesson Format (FLF)</strong> is a
                        standardised JSON protocol for defining rich-media
                        interactive courses. It is the core exchange format used
                        by all KongziJS tools.
                    </p>
                </div>

                <GuideGoals />
                <GuideEnvelope />
                <GuideAssetManifest />
                <GuideNodeTypes />
                <GuideLifecycle />
                <GuideTracking />
            </div>
        </section>
    );
}
