import { useEffect, useRef, useState } from "react";
import loop from "@/assets/data-slabs/loop.mp4.asset.json";
import still from "@/assets/data-slabs/still.webp.asset.json";

export function DataSlabs({ className = "" }: { className?: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const [motion, setMotion] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setMotion(!query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  useEffect(() => {
    if (motion && video.current) void video.current.play().catch(() => setFailed(true));
  }, [motion]);
  return (
    <div className={`data-slabs ${className}`} aria-hidden="true">
      <img src={still.url} alt="" className="slabs-still" />
      {motion && !failed && <video ref={video} src={loop.url} poster={still.url} autoPlay muted loop playsInline onError={() => setFailed(true)} />}
    </div>
  );
}