import { useState, useEffect } from "react";
import type { SurpriseData } from "@/lib/surprise";
import { getSuccessMessage } from "@/lib/surprise";
import { playBirthdaySound } from "@/lib/celebration-sounds";
import { useTypingAnimation } from "@/hooks/use-typing-animation";

const giftItems = ["🧸", "🎮", "👟", "📱", "💎", "🍫", "🎧", "🌸", "⭐", "🎈"];

export default function BirthdayCelebration({ data }: { data: SurpriseData }) {
  const [phase, setPhase] = useState<"shake" | "open" | "reveal">("shake");

  useEffect(() => {
    playBirthdaySound();
    const t1 = setTimeout(() => setPhase("open"), 1500);
    const t2 = setTimeout(() => setPhase("reveal"), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="min-h-screen gradient-hero flex flex-col items-center justify-center px-4 text-center overflow-hidden">
      {phase === "shake" && (
        <div className="animate-gift-shake">
          <div className="text-[120px] md:text-[160px] leading-none">🎁</div>
          <p className="text-primary-foreground/80 text-lg mt-4 animate-pulse">Opening your gift...</p>
        </div>
      )}

      {phase === "open" && (
        <div className="relative">
          {/* Gift items flying out */}
          {giftItems.map((item, i) => (
            <span
              key={i}
              className="absolute text-3xl md:text-5xl animate-gift-burst"
              style={{
                "--burst-x": `${(Math.random() - 0.5) * 300}px`,
                "--burst-y": `${-150 - Math.random() * 200}px`,
                animationDelay: `${i * 0.1}s`,
                left: "50%",
                top: "50%",
              } as React.CSSProperties}
            >
              {item}
            </span>
          ))}
          <div className="text-[120px] md:text-[160px] leading-none animate-gift-open">🎁</div>
        </div>
      )}

      {phase === "reveal" && (
        <div className="animate-bounce-in">
          <p className="text-7xl md:text-9xl mb-6">🎂</p>
          <h1 className="text-3xl md:text-5xl font-display text-primary-foreground mb-4">
            Happy Birthday! 🎉
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 font-semibold mb-3">
            {getSuccessMessage(data.occasion, data.senderName)}
          </p>
          {data.message && <TypingMessage message={data.message} sender={data.senderName} variant="hero" />}

          {/* Floating balloons */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            {["🎈", "🎈", "🎈", "🎈", "🎈", "🎈"].map((b, i) => (
              <span
                key={i}
                className="absolute text-4xl md:text-6xl animate-balloon-rise"
                style={{
                  left: `${10 + i * 15}%`,
                  animationDelay: `${i * 0.4}s`,
                  animationDuration: `${3 + Math.random() * 2}s`,
                }}
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      )}

      <p className="absolute bottom-6 text-primary-foreground/60 text-xs">
        Made with ❤️ by {data.senderName}
      </p>
    </div>
  );
}
