import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Sparkles, Gift, Send, MessageCircleHeart, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { occasions, themes, encodeSurpriseData, generateSlug } from "@/lib/surprise";

const MESSAGE_MAX = 300;

const placeholdersByOccasion: Record<string, string[]> = {
  valentine: [
    "You make my heart skip a beat 💓",
    "Every moment with you is magical ✨",
    "You're the reason I believe in love 🌹",
  ],
  birthday: [
    "Wishing you the happiest birthday ever! 🎂",
    "May all your dreams come true today 🌟",
    "Another year of being awesome! 🥳",
  ],
  confession: [
    "I've been wanting to tell you something… 💕",
    "You make every day brighter just by being you ☀️",
    "I can't stop thinking about you 🦋",
  ],
  anniversary: [
    "Every day with you is a gift 💍",
    "Here's to forever with you 🥂",
    "You still give me butterflies 🦋",
  ],
  graduation: [
    "So proud of everything you've achieved! 🎓",
    "You worked so hard for this moment! 📚",
    "The world is yours now! 🌍",
  ],
  apology: [
    "I'm truly sorry for what happened 🤍",
    "I hope you can find it in your heart to forgive me 🙏",
    "I'll do better, I promise 💪",
  ],
  congratulations: [
    "You absolutely crushed it! 🏆",
    "So proud of you, superstar! ⭐",
    "You deserve all the celebration! 🎊",
  ],
  prank: [
    "This is totally serious btw 😏",
    "Don't worry, nothing bad... 👀",
    "I have a VERY important question 🤔",
  ],
};

const Index = () => {
  const navigate = useNavigate();
  const [senderName, setSenderName] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [occasion, setOccasion] = useState("birthday");
  const [message, setMessage] = useState("");
  const [theme, setTheme] = useState("romantic");
  const [showPreview, setShowPreview] = useState(false);

  const placeholders = placeholdersByOccasion[occasion] || placeholdersByOccasion.birthday;
  const randomPlaceholder = useMemo(
    () => placeholders[Math.floor(Math.random() * placeholders.length)],
    [occasion]
  );

  const charCount = message.length;
  const charPercent = (charCount / MESSAGE_MAX) * 100;

  const handleGenerate = () => {
    if (!senderName.trim() || !receiverName.trim()) return;

    const data = {
      senderName: senderName.trim(),
      receiverName: receiverName.trim(),
      occasion,
      message: message.trim(),
      theme,
    };

    const encoded = encodeSurpriseData(data);
    const slug = generateSlug(data.senderName, data.receiverName);
    navigate(`/s/${slug}?d=${encoded}`);
  };

  const handleSuggestionClick = (text: string) => {
    setMessage(text);
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="gradient-hero py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          {[...Array(6)].map((_, i) => (
            <Heart
              key={i}
              className="absolute text-primary-foreground animate-float"
              style={{
                left: `${15 + i * 15}%`,
                top: `${10 + (i % 3) * 25}%`,
                animationDelay: `${i * 0.5}s`,
                fontSize: `${20 + i * 5}px`,
              }}
              size={20 + i * 8}
            />
          ))}
        </div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-display text-primary-foreground mb-4 animate-bounce-in">
            Create a Special Surprise ✨
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 font-medium">
            Birthday, Graduation, Apology, Prank… make any moment unforgettable 🎉
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="max-w-xl mx-auto px-4 -mt-10 relative z-20 pb-20">
        <div className="bg-card rounded-2xl shadow-xl p-6 md:p-8 space-y-6 border border-border">
          {/* Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Your Name</label>
              <Input
                placeholder="e.g. Manasseh"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="rounded-xl"
                maxLength={50}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Their Name</label>
              <Input
                placeholder="e.g. Ama"
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
                className="rounded-xl"
                maxLength={50}
              />
            </div>
          </div>

          {/* Occasion */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Gift size={16} /> Pick an Occasion
            </label>
            <div className="grid grid-cols-3 gap-2">
              {occasions.map((o) => (
                <button
                  key={o.id}
                  onClick={() => setOccasion(o.id)}
                  className={`p-3 rounded-xl text-sm font-semibold transition-all duration-200 border-2 ${
                    occasion === o.id
                      ? "border-primary bg-primary/10 text-foreground scale-105"
                      : "border-border bg-card text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  <span className="text-lg">{o.emoji}</span>
                  <br />
                  <span className="text-xs">{o.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Theme */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Sparkles size={16} /> Choose a Vibe
            </label>
            <div className="grid grid-cols-4 gap-2">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`p-3 rounded-xl text-sm font-semibold transition-all duration-200 border-2 ${
                    theme === t.id
                      ? "border-primary bg-primary/10 text-foreground scale-105"
                      : "border-border bg-card text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  <span className="text-lg">{t.emoji}</span>
                  <br />
                  <span className="text-xs">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Message */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
              <MessageCircleHeart size={16} /> Custom Message
              <span className="text-muted-foreground font-normal text-xs">(optional)</span>
            </label>

            {/* Suggestion chips */}
            <div className="flex flex-wrap gap-2">
              {placeholders.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSuggestionClick(p)}
                  className="text-xs px-3 py-1.5 rounded-full border border-border bg-muted/50 text-muted-foreground hover:bg-primary/10 hover:border-primary/50 hover:text-foreground transition-all duration-200"
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="relative">
              <Textarea
                placeholder={randomPlaceholder}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value.slice(0, MESSAGE_MAX));
                  if (e.target.value.length <= MESSAGE_MAX) {
                    setMessage(e.target.value);
                  }
                }}
                className="rounded-xl resize-none pr-4 pb-8"
                rows={3}
                maxLength={MESSAGE_MAX}
              />
              {/* Character counter */}
              <div className="absolute bottom-2 right-3 flex items-center gap-2">
                <span
                  className={`text-xs font-medium transition-colors ${
                    charPercent > 90
                      ? "text-destructive"
                      : charPercent > 70
                      ? "text-secondary"
                      : "text-muted-foreground"
                  }`}
                >
                  {charCount}/{MESSAGE_MAX}
                </span>
              </div>
              {/* Progress bar */}
              {charCount > 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-xl overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      charPercent > 90
                        ? "bg-destructive"
                        : charPercent > 70
                        ? "bg-secondary"
                        : "bg-primary"
                    }`}
                    style={{ width: `${charPercent}%` }}
                  />
                </div>
              )}
            </div>

            {/* Live preview toggle */}
            {message.trim() && (
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
                {showPreview ? "Hide preview" : "Preview message"}
              </button>
            )}

            {/* Message preview */}
            {showPreview && message.trim() && (
              <div className="rounded-xl border border-border bg-muted/30 p-4 animate-fade-in">
                <p className="text-xs text-muted-foreground mb-1">How it'll look:</p>
                <div className="rounded-lg bg-card p-3 shadow-sm border border-border">
                  <p className="italic text-foreground">"{message.trim()}"</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    — {senderName.trim() || "Your Name"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Generate */}
          <Button
            onClick={handleGenerate}
            disabled={!senderName.trim() || !receiverName.trim()}
            className="w-full text-lg py-6 rounded-xl font-bold animate-pulse-glow"
            size="lg"
          >
            <Send className="mr-2" size={20} />
            Generate Surprise 🚀
          </Button>
        </div>

        <p className="text-center text-muted-foreground text-xs mt-6">
          Made with ❤️ — Create your playful surprise in 10 seconds
        </p>
      </section>
    </div>
  );
};

export default Index;
