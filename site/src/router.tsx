import { HashRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./Layout";
import { HomePage } from "./pages/HomePage";
import { FeaturesPage } from "./pages/FeaturesPage";
import { PackagesPage } from "./pages/PackagesPage";
import { ProtocolPage } from "./pages/ProtocolPage";
import { GetStartedPage } from "./pages/GetStartedPage";
import { DocsPage } from "./pages/DocsPage";

export function AppRouter() {
    return (
        <HashRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/features" element={<FeaturesPage />} />
                    <Route path="/packages" element={<PackagesPage />} />
                    <Route path="/protocol" element={<ProtocolPage />} />
                    <Route path="/get-started" element={<GetStartedPage />} />
                    <Route path="/docs/flf" element={<DocsPage />} />
                </Routes>
            </Layout>
        </HashRouter>
    );
}
