import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import type { SurpriseData } from "@/lib/surprise";
import { getSuccessMessage } from "@/lib/surprise";
import { playAnniversarySound } from "@/lib/celebration-sounds";
import { useTypingAnimation } from "@/hooks/use-typing-animation";

export default function AnniversaryCelebration({ data }: { data: SurpriseData }) {
  const [phase, setPhase] = useState<"sparkle" | "reveal">("sparkle");

  useEffect(() => {
    playAnniversarySound();
    // Golden confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.5 },
      colors: ["#ffd700", "#ffb347", "#fff44f", "#daa520"],
    });

    const t = setTimeout(() => {
      setPhase("reveal");
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.4 },
        colors: ["#ffd700", "#ffb347", "#ff6b8a", "#a78bfa"],
      });
    }, 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(var(--surprise-gold)/0.15)] to-background flex flex-col items-center justify-center px-4 text-center overflow-hidden">
      {/* Sparkle particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <span
            key={i}
            className="absolute text-lg md:text-2xl animate-sparkle-float"
            style={{
              left: `${Math.random() * 90 + 5}%`,
              top: `${Math.random() * 80 + 5}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          >
            {i % 3 === 0 ? "✨" : i % 3 === 1 ? "💫" : "⭐"}
          </span>
        ))}
      </div>

      {phase === "sparkle" && (
        <div className="animate-anniversary-ring">
          <p className="text-[100px] md:text-[140px] leading-none">💍</p>
          <p className="text-primary/80 text-lg mt-4 animate-pulse font-semibold">
            Celebrating your love...
          </p>
        </div>
      )}

      {phase === "reveal" && (
        <div className="animate-bounce-in relative z-10">
          <p className="text-7xl md:text-9xl mb-6">💍</p>
          <h1 className="text-3xl md:text-5xl font-display text-gradient mb-4">
            Forever & Always 💕
          </h1>
          <p className="text-xl md:text-2xl text-foreground font-semibold mb-3">
            {getSuccessMessage(data.occasion, data.senderName)}
          </p>
          {data.message && <TypingMessage message={data.message} sender={data.senderName} variant="card" />}

          <div className="flex justify-center gap-3 text-2xl">
            {["🥂", "💖", "✨", "💖", "🥂"].map((e, i) => (
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
