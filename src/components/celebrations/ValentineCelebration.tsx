import { useEffect } from "react";
import { Heart } from "lucide-react";
import confetti from "canvas-confetti";
import type { SurpriseData } from "@/lib/surprise";
import { getSuccessMessage } from "@/lib/surprise";

export default function ValentineCelebration({ data }: { data: SurpriseData }) {
  useEffect(() => {
    const duration = 3000;
    const end = Date.now() + duration;
    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#ff6b8a", "#ff9a5c", "#ffd93d", "#a78bfa"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#ff6b8a", "#ff9a5c", "#ffd93d", "#a78bfa"],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  return (
    <div className="min-h-screen gradient-hero flex flex-col items-center justify-center px-4 text-center overflow-hidden">
      {/* Floating hearts */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <span
            key={i}
            className="absolute text-2xl md:text-4xl animate-heart-rise"
            style={{
              left: `${5 + i * 8}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${2.5 + Math.random() * 2}s`,
            }}
          >
            {i % 3 === 0 ? "💖" : i % 3 === 1 ? "💕" : "❤️"}
          </span>
        ))}
      </div>

      <div className="animate-bounce-in relative z-10">
        <Heart className="mx-auto text-primary-foreground animate-heartbeat mb-6" size={80} />
        <h1 className="text-3xl md:text-5xl font-display text-primary-foreground mb-4">
          Yaaay! 🎉
        </h1>
        <p className="text-xl md:text-2xl text-primary-foreground/90 font-semibold mb-3">
          {getSuccessMessage(data.occasion, data.senderName)}
        </p>
        {data.message && (
          <div className="bg-card/20 backdrop-blur-sm rounded-2xl p-4 max-w-md mx-auto mb-6">
            <p className="text-primary-foreground italic text-lg">"{data.message}"</p>
            <p className="text-primary-foreground/70 text-sm mt-2">— {data.senderName}</p>
          </div>
        )}
        <p className="text-6xl mb-8">🌹</p>
      </div>

      <p className="absolute bottom-6 text-primary-foreground/60 text-xs">
        Made with ❤️ by {data.senderName}
      </p>
    </div>
  );
}
