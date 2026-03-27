import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import type { SurpriseData } from "@/lib/surprise";
import { getSuccessMessage } from "@/lib/surprise";

export default function ConfessionCelebration({ data }: { data: SurpriseData }) {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    // Heart-shaped confetti burst
    const colors = ["#ff6b8a", "#ff9a5c", "#a78bfa", "#ffd93d"];
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.6 },
      colors,
      shapes: ["circle"],
    });

    const t = setTimeout(() => setShowMessage(true), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(var(--surprise-pink)/0.2)] to-background flex flex-col items-center justify-center px-4 text-center overflow-hidden">
      {/* Pulse ring effect */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full border-2 border-primary/30 animate-confession-ring"
            style={{
              width: `${150 + i * 100}px`,
              height: `${150 + i * 100}px`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
      </div>

      <div className={`relative z-10 transition-all duration-700 ${showMessage ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <div className="animate-heartbeat inline-block mb-6">
          <p className="text-7xl md:text-9xl">😍</p>
        </div>

        <h1 className="text-3xl md:text-5xl font-display text-gradient mb-4">
          They said YES!
        </h1>
        <p className="text-xl md:text-2xl text-foreground font-semibold mb-3">
          {getSuccessMessage(data.occasion, data.senderName)}
        </p>
        {data.message && (
          <div className="bg-card rounded-2xl shadow-lg p-4 max-w-md mx-auto mb-6 border border-border">
            <p className="text-foreground italic text-lg">"{data.message}"</p>
            <p className="text-muted-foreground text-sm mt-2">— {data.senderName}</p>
          </div>
        )}

        {/* Floating love emojis */}
        <div className="flex justify-center gap-2 text-3xl mb-4">
          {["💕", "💘", "💗", "💓", "💞"].map((e, i) => (
            <span key={i} className="animate-float" style={{ animationDelay: `${i * 0.3}s` }}>
              {e}
            </span>
          ))}
        </div>
      </div>

      {/* Rising hearts background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <span
            key={i}
            className="absolute text-xl md:text-3xl animate-heart-rise opacity-40"
            style={{
              left: `${5 + i * 10}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 3}s`,
            }}
          >
            💕
          </span>
        ))}
      </div>

      <p className="absolute bottom-6 text-muted-foreground text-xs">
        Made with ❤️ by {data.senderName}
      </p>
    </div>
  );
}
