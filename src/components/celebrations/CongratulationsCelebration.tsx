import { useEffect } from "react";
import confetti from "canvas-confetti";
import type { SurpriseData } from "@/lib/surprise";
import { getSuccessMessage } from "@/lib/surprise";
import TypingMessage from "./TypingMessage";

export default function CongratulationsCelebration({ data }: { data: SurpriseData }) {
  useEffect(() => {
    // Big celebration confetti
    const end = Date.now() + 3000;
    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#ffd700", "#ff6b8a", "#4a90d9", "#50c878"],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#ffd700", "#ff6b8a", "#4a90d9", "#50c878"],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  return (
    <div className="min-h-screen gradient-hero flex flex-col items-center justify-center px-4 text-center overflow-hidden">
      {/* Floating trophies */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {["🏆", "🎊", "⭐", "🥇", "🎉", "👏", "🌟", "🎊"].map((e, i) => (
          <span
            key={i}
            className="absolute text-2xl md:text-4xl animate-float opacity-30"
            style={{
              left: `${5 + i * 12}%`,
              top: `${8 + (i % 4) * 22}%`,
              animationDelay: `${i * 0.4}s`,
            }}
          >
            {e}
          </span>
        ))}
      </div>

      <div className="animate-bounce-in relative z-10">
        <p className="text-7xl md:text-9xl mb-6">🏆</p>
        <h1 className="text-3xl md:text-5xl font-display text-primary-foreground mb-4">
          Amazing! 🎊
        </h1>
        <p className="text-xl md:text-2xl text-primary-foreground/90 font-semibold mb-3">
          {getSuccessMessage(data.occasion, data.senderName)}
        </p>
        {data.message && <TypingMessage message={data.message} sender={data.senderName} variant="hero" />}

        <div className="flex justify-center gap-3 text-2xl mt-4">
          {["🎉", "🏆", "⭐", "🏆", "🎉"].map((e, i) => (
            <span key={i} className="animate-float" style={{ animationDelay: `${i * 0.2}s` }}>
              {e}
            </span>
          ))}
        </div>
      </div>

      <p className="absolute bottom-6 text-primary-foreground/60 text-xs">
        Made with ❤️ by {data.senderName}
      </p>
    </div>
  );
}
