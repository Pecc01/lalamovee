import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import FeaturesSection from "@/components/FeaturesSection";
import DownloadAppSection from "@/components/DownloadAppSection";
import Footer from "@/components/Footer";
import TrackingModal from "@/components/TrackingModal";
import { useEffect } from "react";
import { decodeTrackingData, buildShareLink, normalizeCode } from "@/lib/utils";
import type { TrackingData } from "@/lib/tracking";
import { getTrackingData } from "@/lib/tracking";

const Index = () => {
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [trackingCode, setTrackingCode] = useState("");
  const [sharedData, setSharedData] = useState<TrackingData | null>(null);

  const handleTrack = (code: string) => {
    const normalized = normalizeCode(code);
    const local = getTrackingData(normalized);
    if (local) {
      const link = buildShareLink(local);
      window.location.href = link;
      return;
    }
    setTrackingCode(normalized);
    setIsTrackingOpen(true);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dataParam = params.get("data");
    const codeParam = params.get("code");
    if (dataParam) {
      const decoded = decodeTrackingData(dataParam);
      if (decoded) {
        setSharedData(decoded);
        setIsTrackingOpen(true);
      }
    }
    if (codeParam) {
      setTrackingCode(normalizeCode(codeParam));
      setIsTrackingOpen(true);
    }
    if (!codeParam) {
      const raw = window.location.pathname.replace(/^\/+|\/+$/g, "");
      if (raw) {
        const candidate = normalizeCode(raw);
        if (/^BR\d+$/.test(candidate)) {
          setTrackingCode(candidate);
          setIsTrackingOpen(true);
        }
      }
    }
  }, []);

  const handleClose = () => {
    setIsTrackingOpen(false);
    const url = new URL(window.location.href);
    url.searchParams.delete("data");
    url.searchParams.delete("code");
    window.history.replaceState({}, "", url.toString());
    setSharedData(null);
    setTrackingCode("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection onTrack={handleTrack} />
      <DownloadAppSection />
      <ServicesSection />
      <FeaturesSection />
      <Footer />
      
      <TrackingModal
        isOpen={isTrackingOpen}
        onClose={handleClose}
        trackingCode={trackingCode}
        trackingData={sharedData || undefined}
      />
    </div>
  );
};

export default Index;
