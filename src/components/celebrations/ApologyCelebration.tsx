import { useState, useEffect } from "react";
import type { SurpriseData } from "@/lib/surprise";
import { getSuccessMessage } from "@/lib/surprise";
import TypingMessage from "./TypingMessage";

export default function ApologyCelebration({ data }: { data: SurpriseData }) {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowMessage(true), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100/30 to-background flex flex-col items-center justify-center px-4 text-center overflow-hidden">
      {/* Soft floating elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {["🤍", "🕊️", "✨", "🤍", "🕊️", "✨", "🤍", "🕊️"].map((e, i) => (
          <span
            key={i}
            className="absolute text-xl md:text-3xl animate-float opacity-30"
            style={{
              left: `${5 + i * 12}%`,
              top: `${10 + (i % 4) * 20}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          >
            {e}
          </span>
        ))}
      </div>

      <div className={`relative z-10 transition-all duration-700 ${showMessage ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <p className="text-7xl md:text-9xl mb-6">🤍</p>
        <h1 className="text-3xl md:text-5xl font-display text-gradient mb-4">
          Forgiven 🕊️
        </h1>
        <p className="text-xl md:text-2xl text-foreground font-semibold mb-3">
          {getSuccessMessage(data.occasion, data.senderName)}
        </p>
        {data.message && <TypingMessage message={data.message} sender={data.senderName} variant="card" />}

        <div className="flex justify-center gap-3 text-2xl mt-4">
          {["🕊️", "🤍", "✨", "🤍", "🕊️"].map((e, i) => (
            <span key={i} className="animate-float" style={{ animationDelay: `${i * 0.3}s` }}>
              {e}
            </span>
          ))}
        </div>
      </div>

      <p className="absolute bottom-6 text-muted-foreground text-xs">
        Made with ❤️ by {data.senderName}
      </p>
    </div>
  );
}
