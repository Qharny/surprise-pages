import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import type { SurpriseData } from "@/lib/surprise";
import { getSuccessMessage } from "@/lib/surprise";
import TypingMessage from "./TypingMessage";

export default function PrankCelebration({ data }: { data: SurpriseData }) {
  const [phase, setPhase] = useState<"loading" | "jumpscare" | "reveal">("loading");

  useEffect(() => {
    // Fake loading, then jumpscare, then reveal
    const t1 = setTimeout(() => setPhase("jumpscare"), 2000);
    const t2 = setTimeout(() => {
      setPhase("reveal");
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.5 },
        colors: ["#ff6b8a", "#ffd700", "#50c878", "#4a90d9"],
      });
    }, 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-4 text-center overflow-hidden transition-all duration-300 ${
      phase === "jumpscare" ? "bg-black" : "bg-gradient-to-b from-yellow-100/30 to-background"
    }`}>
      {phase === "loading" && (
        <div className="animate-pulse">
          <p className="text-6xl mb-4">⏳</p>
          <p className="text-foreground text-lg font-semibold">Loading something important...</p>
          <p className="text-muted-foreground text-sm mt-2">Please wait...</p>
        </div>
      )}

      {phase === "jumpscare" && (
        <div className="animate-bounce-in">
          <p className="text-[150px] md:text-[200px] leading-none">😈</p>
          <p className="text-white text-2xl font-bold mt-4">GOTCHA!</p>
        </div>
      )}

      {phase === "reveal" && (
        <div className="animate-bounce-in relative z-10">
          <p className="text-7xl md:text-9xl mb-6">😂</p>
          <h1 className="text-3xl md:text-5xl font-display text-gradient mb-4">
            You Got Pranked! 🤣
          </h1>
          <p className="text-xl md:text-2xl text-foreground font-semibold mb-3">
            {getSuccessMessage(data.occasion, data.senderName)}
          </p>
          {data.message && <TypingMessage message={data.message} sender={data.senderName} variant="card" />}

          {/* Floating laughing emojis */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            {["😂", "🤣", "💀", "😈", "🤡", "😂", "🤣", "💀"].map((e, i) => (
              <span
                key={i}
                className="absolute text-2xl md:text-4xl animate-float opacity-30"
                style={{
                  left: `${5 + i * 12}%`,
                  top: `${10 + (i % 4) * 20}%`,
                  animationDelay: `${i * 0.4}s`,
                }}
              >
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
