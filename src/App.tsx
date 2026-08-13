import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

import IndexComponent from "./routes/index";
import AboutPage from "./routes/about";
import BrochurePage from "./routes/brochure";
import GalleryPage from "./routes/gallery";
import ContactPage from "./routes/contact";
import AdminPage from "./routes/admin";

export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {!isAdmin && <SiteHeader />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<IndexComponent />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/brochure" element={<BrochurePage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin/*" element={<AdminPage />} />
          <Route path="*" element={<IndexComponent />} />
        </Routes>
      </main>
      {!isAdmin && <SiteFooter />}
    </div>
  );
}
