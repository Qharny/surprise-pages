import { useState, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import confetti from "canvas-confetti";
import { Heart, Share2, Check, MessageCircle, Mail, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  decodeSurpriseData,
  getOccasionButtons,
  getOccasionMessage,
  getSuccessMessage,
  type SurpriseData,
} from "@/lib/surprise";

const SurprisePage = () => {
  const [searchParams] = useSearchParams();
  const encoded = searchParams.get("d");
  const data = encoded ? decodeSurpriseData(encoded) : null;

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground text-lg">This surprise link is invalid or expired 😢</p>
      </div>
    );
  }

  return <SurpriseInteraction data={data} />;
};

function SurpriseInteraction({ data }: { data: SurpriseData }) {
  const [noCount, setNoCount] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [copied, setCopied] = useState(false);
  const noRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const yesScale = 1 + noCount * 0.15;
  const noScale = Math.max(0.4, 1 - noCount * 0.12);
  const noHidden = noCount >= noMessages.length;

  const currentMessage =
    noCount === 0
      ? getOccasionMessage(data.occasion, data.senderName, data.receiverName)
      : noMessages[Math.min(noCount - 1, noMessages.length - 1)];

  const handleNo = useCallback(() => {
    const next = noCount + 1;
    setNoCount(next);

    if (next >= 3) {
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }

    // Teleport the No button after click 4
    if (next >= 4 && noRef.current && containerRef.current) {
      const container = containerRef.current.getBoundingClientRect();
      const btn = noRef.current;
      const maxX = container.width - btn.offsetWidth - 20;
      const maxY = container.height - btn.offsetHeight - 20;
      const x = Math.random() * maxX;
      const y = Math.random() * maxY;
      btn.style.position = "absolute";
      btn.style.left = `${x}px`;
      btn.style.top = `${y}px`;
      btn.style.transition = "none";
    }
  }, [noCount]);

  const handleYes = useCallback(() => {
    setAccepted(true);
    // Fire confetti
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

  const shareUrl = window.location.href;
  const shareText = `${data.senderName} made a surprise for ${data.receiverName}! ❤️`;

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [shareUrl]);

  const handleWhatsApp = useCallback(() => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText + "\n" + shareUrl)}`, "_blank");
  }, [shareText, shareUrl]);

  const handleTelegram = useCallback(() => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, "_blank");
  }, [shareText, shareUrl]);

  const handleTwitter = useCallback(() => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, "_blank");
  }, [shareText, shareUrl]);

  const handleEmail = useCallback(() => {
    window.open(`mailto:?subject=${encodeURIComponent("A surprise for you! ❤️")}&body=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`, "_blank");
  }, [shareText, shareUrl]);

  const handleNativeShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({ title: "A surprise for you! ❤️", text: shareText, url: shareUrl });
    }
  }, [shareText, shareUrl]);

  const themeEmoji = data.theme === "cute" ? "🐱" : data.theme === "funny" ? "😂" : "🌹";

  if (accepted) {
    return (
      <div className="min-h-screen gradient-hero flex flex-col items-center justify-center px-4 text-center">
        <div className="animate-bounce-in">
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
          <p className="text-6xl mb-8">{themeEmoji}</p>
        </div>
        <p className="text-primary-foreground/60 text-xs mt-8">
          Made with ❤️ by {data.senderName}
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`min-h-screen relative flex flex-col items-center justify-center px-4 text-center bg-background overflow-hidden ${
        shaking ? "animate-shake" : ""
      }`}
    >
      {/* Floating decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <span
            key={i}
            className="absolute text-2xl md:text-4xl animate-float opacity-20"
            style={{
              left: `${10 + i * 12}%`,
              top: `${5 + (i % 4) * 22}%`,
              animationDelay: `${i * 0.7}s`,
            }}
          >
            {i % 2 === 0 ? "❤️" : themeEmoji}
          </span>
        ))}
      </div>

      <div className="relative z-10 max-w-lg">
        <p className="text-5xl mb-6 animate-bounce-in">{themeEmoji}</p>

        <h1 className="text-2xl md:text-4xl font-display text-gradient mb-3 animate-bounce-in">
          Hey {data.receiverName}!
        </h1>

        <p className="text-lg md:text-xl text-foreground font-semibold mb-2">
          From <span className="text-gradient font-bold">{data.senderName}</span>
        </p>

        <p className="text-xl md:text-2xl text-foreground font-bold mb-10 min-h-[2em] transition-all duration-300">
          {currentMessage}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 relative">
          <Button
            onClick={handleYes}
            className="rounded-full font-bold transition-all duration-300 animate-pulse-glow"
            size="lg"
            style={{
              transform: `scale(${yesScale})`,
              fontSize: `${1 + noCount * 0.1}rem`,
              padding: `${12 + noCount * 4}px ${24 + noCount * 8}px`,
            }}
          >
            Yes 💖
          </Button>

          {!noHidden && (
            <button
              ref={noRef}
              onClick={handleNo}
              className="rounded-full border-2 border-border bg-muted text-muted-foreground font-bold transition-all duration-200 hover:bg-muted/80 px-6 py-3"
              style={{
                transform: `scale(${noScale})`,
              }}
            >
              No 😢
            </button>
          )}
        </div>

        {noHidden && (
          <p className="text-muted-foreground text-sm mt-6 animate-bounce-in">
            The "No" button gave up. Your turn! 😏
          </p>
        )}
      </div>

      {/* Share menu */}
      <div className="absolute bottom-6 right-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="rounded-full gap-2">
              {copied ? <Check size={14} /> : <Share2 size={14} />}
              {copied ? "Copied!" : "Share"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={handleWhatsApp} className="gap-2 cursor-pointer">
              <MessageCircle size={16} /> WhatsApp
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleTelegram} className="gap-2 cursor-pointer">
              <Share2 size={16} /> Telegram
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleTwitter} className="gap-2 cursor-pointer">
              <Share2 size={16} /> Twitter / X
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleEmail} className="gap-2 cursor-pointer">
              <Mail size={16} /> Email
            </DropdownMenuItem>
            {typeof navigator.share === "function" && (
              <DropdownMenuItem onClick={handleNativeShare} className="gap-2 cursor-pointer">
                <Share2 size={16} /> More...
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={handleCopyLink} className="gap-2 cursor-pointer">
              <Link2 size={16} /> {copied ? "Copied!" : "Copy Link"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <p className="absolute bottom-6 left-6 text-muted-foreground text-xs">
        Made with ❤️
      </p>
    </div>
  );
}

export default SurprisePage;
