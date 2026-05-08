import { useLayoutEffect } from "react";
import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { NavigationProvider } from "./context/NavigationContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/sections/Footer";
import ClientWrapper from "./components/layout/ClientWrapper";
import CustomCursor from "./components/ui/CustomCursor";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import Loader from "./components/ui/Loader";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Work from "./pages/Work";
import Contact from "./pages/Contact";
import Clients from "./pages/Clients";
import WorkDetail from "./pages/WorkDetail";
import ComingSoon from "./pages/ComingSoon";
import AdminPanel from "./pages/AdminPanel";
import Legal from "./pages/Legal";

gsap.registerPlugin(ScrollTrigger);

// Scrolls to top, kills GSAP pins/tweens, and resets body styles on each route change
function RouteChangeHandler() {
  const location = useLocation();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    ScrollTrigger.getAll().forEach(t => t.kill(true));
    gsap.killTweensOf(document.body);
    document.body.style.backgroundColor = "";
    document.body.style.color = "";
    document.body.style.removeProperty("--accent-color");
    document.body.style.removeProperty("--accent-bg");
  }, [location.pathname]);
  return null;
}

// Wraps Routes in an ErrorBoundary that resets on every navigation
function PageRoutes() {
  const location = useLocation();
  return (
    <ErrorBoundary key={location.pathname}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/work" element={<Work />} />
        <Route path="/work/:slug" element={<WorkDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="*" element={<ComingSoon />} />
      </Routes>
    </ErrorBoundary>
  );
}

function SiteShell() {
  return (
    <NavigationProvider>
      <RouteChangeHandler />
      <Loader />
      <CustomCursor />
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999, pointerEvents: "none" }}>
        <Navbar />
      </div>
      <ClientWrapper>
        <main className="font-sans antialiased">
          <div className="relative w-full">
            <PageRoutes />
            <Footer />
          </div>
        </main>
      </ClientWrapper>
    </NavigationProvider>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin-change-marashall" element={<AdminPanel />} />
        <Route path="*" element={<SiteShell />} />
      </Routes>
    </Router>
  );
}
