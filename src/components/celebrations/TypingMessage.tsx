import { useTypingAnimation } from "@/hooks/use-typing-animation";

interface TypingMessageProps {
  message: string;
  sender: string;
  variant: "hero" | "card";
}

export default function TypingMessage({ message, sender, variant }: TypingMessageProps) {
  const { displayed, done } = useTypingAnimation(message, 40, 500);

  const isHero = variant === "hero";

  return (
    <div className={`rounded-2xl p-4 max-w-md mx-auto mb-6 ${
      isHero ? "bg-card/20 backdrop-blur-sm" : "bg-card shadow-lg border border-border"
    }`}>
      <p className={`italic text-lg ${isHero ? "text-primary-foreground" : "text-foreground"}`}>
        "{displayed}
        {!done && <span className="inline-block w-0.5 h-5 bg-current animate-pulse ml-0.5 align-middle" />}
        "
      </p>
      {done && (
        <p className={`text-sm mt-2 animate-fade-in ${isHero ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
          — {sender}
        </p>
      )}
    </div>
  );
}
