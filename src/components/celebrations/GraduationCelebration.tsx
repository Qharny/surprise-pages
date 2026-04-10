import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import type { SurpriseData } from "@/lib/surprise";
import { getSuccessMessage } from "@/lib/surprise";
import TypingMessage from "./TypingMessage";

const caps = ["🎓", "📚", "🏆", "⭐", "📜", "🌟"];

export default function GraduationCelebration({ data }: { data: SurpriseData }) {
  const [phase, setPhase] = useState<"toss" | "reveal">("toss");

  useEffect(() => {
    // Cap toss confetti
    confetti({
      particleCount: 100,
      spread: 120,
      origin: { y: 0.7 },
      colors: ["#1a1a2e", "#ffd700", "#4a90d9", "#e94560"],
    });

    const t = setTimeout(() => {
      setPhase("reveal");
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.4 },
        colors: ["#ffd700", "#ffb347", "#4a90d9", "#1a1a2e"],
      });
    }, 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900/20 to-background flex flex-col items-center justify-center px-4 text-center overflow-hidden">
      {/* Floating caps */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {caps.map((cap, i) => (
          <span
            key={i}
            className="absolute text-2xl md:text-4xl animate-float"
            style={{
              left: `${10 + i * 15}%`,
              top: `${10 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.4}s`,
            }}
          >
            {cap}
          </span>
        ))}
      </div>

      {phase === "toss" && (
        <div className="animate-gift-shake">
          <p className="text-[120px] md:text-[160px] leading-none">🎓</p>
          <p className="text-foreground/80 text-lg mt-4 animate-pulse font-semibold">
            Throwing the cap...
          </p>
        </div>
      )}

      {phase === "reveal" && (
        <div className="animate-bounce-in relative z-10">
          <p className="text-7xl md:text-9xl mb-6">🎓</p>
          <h1 className="text-3xl md:text-5xl font-display text-gradient mb-4">
            You Made It! 🌟
          </h1>
          <p className="text-xl md:text-2xl text-foreground font-semibold mb-3">
            {getSuccessMessage(data.occasion, data.senderName)}
          </p>
          {data.message && <TypingMessage message={data.message} sender={data.senderName} variant="card" />}

          <div className="flex justify-center gap-3 text-2xl mt-4">
            {["🎓", "🏆", "⭐", "🏆", "🎓"].map((e, i) => (
              <span key={i} className="animate-float" style={{ animationDelay: `${i * 0.2}s` }}>
                {e}
              </span>
            ))}
          </div>
        </div>
      )}

      <p className="absolute bottom-6 text-muted-foreground text-xs">
        Made with ❤️ by {data.senderName}
      </p>
    </div>
  );
}
