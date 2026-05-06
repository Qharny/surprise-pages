import { useState, useCallback, useRef } from "react";
import sadCatImg from "@/assets/sad-cat.png";
import { useSearchParams } from "react-router-dom";

import { Share2, Check, MessageCircle, Mail, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import BirthdayCelebration from "@/components/celebrations/BirthdayCelebration";
import ValentineCelebration from "@/components/celebrations/ValentineCelebration";
import ConfessionCelebration from "@/components/celebrations/ConfessionCelebration";
import AnniversaryCelebration from "@/components/celebrations/AnniversaryCelebration";
import GraduationCelebration from "@/components/celebrations/GraduationCelebration";
import ApologyCelebration from "@/components/celebrations/ApologyCelebration";
import CongratulationsCelebration from "@/components/celebrations/CongratulationsCelebration";
import PrankCelebration from "@/components/celebrations/PrankCelebration";
import MothersDayCelebration from "@/components/celebrations/MothersDayCelebration";
import FathersDayCelebration from "@/components/celebrations/FathersDayCelebration";
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
  type SurpriseData,
} from "@/lib/surprise";

/* ── Screen effect types for dynamic reactions ── */
type ScreenEffect = "shake" | "blur" | "zoom" | "invert" | null;

const screenEffectSequence: ScreenEffect[] = [
  null, null, null, // first 3 clicks: no effect
  "shake",
  "blur",
  "zoom",
  "invert",
];

function getScreenEffectClass(effect: ScreenEffect): string {
  switch (effect) {
    case "shake": return "animate-shake";
    case "blur": return "backdrop-blur-effect";
    case "zoom": return "screen-zoom-effect";
    case "invert": return "screen-invert-effect";
    default: return "";
  }
}

/* ── Dynamic reaction emojis based on no count ── */
function getReactionEmojis(noCount: number): string[] {
  if (noCount <= 1) return ["😊", "💭"];
  if (noCount <= 3) return ["😅", "😬", "💦"];
  if (noCount <= 5) return ["😤", "🔥", "💢"];
  return ["😈", "💀", "⚡", "🌪️"];
}

const SurprisePage = () => {
  const [searchParams] = useSearchParams();
  const encoded = searchParams.get("d");
  const data = encoded ? decodeSurpriseData(encoded) : null;

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-center">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className="absolute text-xl opacity-10 animate-float"
              style={{
                left: `${15 + i * 18}%`,
                top: `${10 + (i % 3) * 25}%`,
                animationDelay: `${i * 0.8}s`,
              }}
            >
              💔
            </span>
          ))}
        </div>

        <img
          src={sadCatImg}
          alt="Sad cat holding a broken heart"
          width={200}
          height={200}
          className="animate-sad-breathe mb-6 drop-shadow-lg"
        />

        <h1 className="text-2xl md:text-3xl font-display text-gradient mb-3 animate-bounce-in">
          Oops!
        </h1>
        <p className="text-muted-foreground text-lg mb-2 animate-fade-in">
          This surprise link is invalid or expired 😢
        </p>
        <p className="text-muted-foreground/70 text-sm mb-8 animate-fade-in">
          Maybe the surprise was already opened, or the link got lost along the way.
        </p>

        <a
          href="/"
          className="rounded-full bg-primary text-primary-foreground font-bold px-8 py-3 transition-all hover:scale-105 animate-bounce-in"
        >
          Create a New Surprise ❤️
        </a>
      </div>
    );
  }

  return <SurpriseInteraction data={data} />;
};

function SurpriseInteraction({ data }: { data: SurpriseData }) {
  const [noCount, setNoCount] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [screenEffect, setScreenEffect] = useState<ScreenEffect>(null);
  const noRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const buttons = getOccasionButtons(data.occasion);
  const yesScale = 1 + noCount * 0.15;
  const noScale = Math.max(0.4, 1 - noCount * 0.12);
  const noHidden = noCount >= buttons.noMessages.length;

  const currentMessage =
    noCount === 0
      ? getOccasionMessage(data.occasion, data.senderName, data.receiverName)
      : buttons.noMessages[Math.min(noCount - 1, buttons.noMessages.length - 1)];

  const reactionEmojis = getReactionEmojis(noCount);

  const handleNo = useCallback(() => {
    const next = noCount + 1;
    setNoCount(next);

    // Apply screen effect
    const effect = screenEffectSequence[Math.min(next, screenEffectSequence.length - 1)];
    if (effect) {
      setScreenEffect(effect);
      setTimeout(() => setScreenEffect(null), 600);
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

  const themeEmoji = data.theme === "cute" ? "🐱"
    : data.theme === "funny" ? "😂"
    : data.theme === "anime" ? "💫"
    : data.theme === "minimalist" ? "🖤"
    : data.theme === "luxury" ? "✨"
    : data.theme === "african" ? "🌍"
    : data.theme === "meme" ? "🤣"
    : "🌹";

  if (accepted) {
    const CelebrationComponent = {
      valentine: ValentineCelebration,
      birthday: BirthdayCelebration,
      confession: ConfessionCelebration,
      anniversary: AnniversaryCelebration,
      graduation: GraduationCelebration,
      apology: ApologyCelebration,
      congratulations: CongratulationsCelebration,
      prank: PrankCelebration,
      mothersday: MothersDayCelebration,
      fathersday: FathersDayCelebration,
    }[data.occasion] || ValentineCelebration;

    return <CelebrationComponent data={data} />;
  }

  return (
    <div
      ref={containerRef}
      className={`min-h-screen relative flex flex-col items-center justify-center px-4 text-center bg-background overflow-hidden ${
        getScreenEffectClass(screenEffect)
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

        <p className="text-xl md:text-2xl text-foreground font-bold mb-4 min-h-[2em] transition-all duration-300">
          {currentMessage}
        </p>

        {/* Dynamic reaction emojis */}
        {noCount > 0 && (
          <div className="flex justify-center gap-2 mb-6 animate-bounce-in">
            {reactionEmojis.map((e, i) => (
              <span
                key={`${noCount}-${i}`}
                className="text-2xl animate-float"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                {e}
              </span>
            ))}
          </div>
        )}

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
            {buttons.yesLabel}
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
              {buttons.noLabel}
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
