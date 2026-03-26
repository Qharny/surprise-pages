import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Sparkles, Gift, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { occasions, themes, encodeSurpriseData, generateSlug } from "@/lib/surprise";

const Index = () => {
  const navigate = useNavigate();
  const [senderName, setSenderName] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [occasion, setOccasion] = useState("valentine");
  const [message, setMessage] = useState("");
  const [theme, setTheme] = useState("romantic");

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
            Create a Special Surprise ❤️
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 font-medium">
            Valentine, Birthday, Confession… make it unforgettable ✨
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
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          {/* Theme */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Sparkles size={16} /> Choose a Vibe
            </label>
            <div className="grid grid-cols-3 gap-2">
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
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              Custom Message <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <Textarea
              placeholder="Write something sweet…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="rounded-xl resize-none"
              rows={3}
              maxLength={300}
            />
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
