const FIELDS = [
    {
        field: "id",
        type: "String",
        desc: (
            <>
                Script-unique asset identifier (e.g. <code>media_1</code>)
            </>
        ),
    },
    {
        field: "type",
        type: "Enum",
        desc: (
            <>
                <code>video</code> · <code>audio</code> · <code>image</code> ·{" "}
                <code>pdf</code> · <code>quiz_dsl</code>
            </>
        ),
    },
    {
        field: "src",
        type: "String",
        desc: "Protocol-addressed path — see examples below",
    },
    { field: "hash", type: "String?", desc: "Optional integrity checksum" },
];

const PROTOCOLS = [
    { badge: "https://", desc: "Remote CDN or server resource" },
    { badge: "local://", desc: "Relative path inside an export bundle" },
    { badge: "asset://", desc: "UUID reference to a global database asset" },
];

export function GuideAssetManifest() {
    return (
        <div className="guide-block">
            <h3 className="guide-block-title">
                <span className="guide-step-num">02</span>
                Asset Manifest
            </h3>
            <p className="guide-block-desc">
                All external media is declared upfront in{" "}
                <code>assets_manifest</code>. Every asset has a unique{" "}
                <code>id</code> that nodes reference, and a <code>src</code>{" "}
                field that uses a protocol prefix to unify remote URLs, local
                bundle paths, and database resources.
            </p>

            <div className="guide-table-wrapper">
                <table className="guide-table">
                    <thead>
                        <tr>
                            <th>Field</th>
                            <th>Type</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {FIELDS.map((f) => (
                            <tr key={f.field}>
                                <td>
                                    <code>{f.field}</code>
                                </td>
                                <td>{f.type}</td>
                                <td>{f.desc}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="guide-protocols">
                {PROTOCOLS.map((p) => (
                    <div key={p.badge} className="guide-protocol-item">
                        <code className="protocol-badge">{p.badge}</code>
                        <span>{p.desc}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
