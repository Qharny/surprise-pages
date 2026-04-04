import LZString from "lz-string";

export interface SurpriseData {
  senderName: string;
  receiverName: string;
  occasion: string;
  message: string;
  theme: string;
}

export const occasions = [
  { id: "valentine", label: "Valentine", emoji: "💖" },
  { id: "birthday", label: "Birthday", emoji: "🎂" },
  { id: "confession", label: "Crush Confession", emoji: "😏" },
  { id: "anniversary", label: "Anniversary", emoji: "💍" },
  { id: "custom", label: "Custom", emoji: "🎨" },
] as const;

export const themes = [
  { id: "cute", label: "Cute", emoji: "🐱" },
  { id: "romantic", label: "Romantic", emoji: "🌹" },
  { id: "funny", label: "Funny", emoji: "😂" },
] as const;

export function encodeSurpriseData(data: SurpriseData): string {
  // Use single-letter keys for compact URLs
  const compact = {
    s: data.senderName,
    r: data.receiverName,
    o: data.occasion,
    m: data.message,
    t: data.theme,
  };
  return btoa(unescape(encodeURIComponent(JSON.stringify(compact))))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function decodeSurpriseData(encoded: string): SurpriseData | null {
  try {
    // Restore base64 padding and chars
    let b64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4) b64 += "=";
    const compact = JSON.parse(decodeURIComponent(escape(atob(b64))));
    // Support both compact and legacy formats
    if (compact.s) {
      return {
        senderName: compact.s,
        receiverName: compact.r,
        occasion: compact.o,
        message: compact.m || "",
        theme: compact.t,
      };
    }
    return compact as SurpriseData;
  } catch {
    return null;
  }
}

export function generateSlug(sender: string, receiver: string): string {
  const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  return `${clean(sender)}-loves-${clean(receiver)}`;
}

export interface OccasionButtons {
  yesLabel: string;
  noLabel: string;
  noMessages: string[];
}

export function getOccasionButtons(occasion: string): OccasionButtons {
  switch (occasion) {
    case "valentine":
      return {
        yesLabel: "Yes 💖",
        noLabel: "No 😢",
        noMessages: [
          "Are you sure? 🥺",
          "Think again! 💭",
          "Don't do me like this 😭",
          "Pretty please? 🙏",
          "I won't give up! 💪",
          "Last chance... 😢",
          "Just click Yes already 😭❤️",
        ],
      };
    case "birthday":
      return {
        yesLabel: "Open Gift 🎁",
        noLabel: "Maybe Later",
        noMessages: [
          "But it's wrapped so nicely! 🎀",
          "Come on, just a peek? 👀",
          "The gift is getting sad 😢",
          "It's calling your name! 📦",
          "You really don't want it? 🥺",
          "Fine... but it's still here 🎁",
          "JUST OPEN IT ALREADY 🎉",
        ],
      };
    case "confession":
      return {
        yesLabel: "Say Yes 😍",
        noLabel: "Run Away 🏃",
        noMessages: [
          "You can't run from feelings! 💨",
          "Come back! 😭",
          "I'm still here waiting... 🥺",
          "My heart is chasing you! 💕",
          "You can run but you can't hide 🫣",
          "Please stop running! 😩",
          "Okay I caught you. Now say yes 😏",
        ],
      };
    case "anniversary":
      return {
        yesLabel: "Forever Yours 💍",
        noLabel: "Need Space 😬",
        noMessages: [
          "After all these years?! 😱",
          "Remember our first date? 🥺",
          "But we've been through so much! 💔",
          "My heart can't take this 😭",
          "Think of all the memories! 📸",
          "You don't really mean that... 🥹",
          "Come on, you know you love me 💕",
        ],
      };
    default:
      return {
        yesLabel: "Yes ✨",
        noLabel: "No 😢",
        noMessages: [
          "Are you sure? 🥺",
          "Think again! 💭",
          "Don't do me like this 😭",
          "Pretty please? 🙏",
          "I won't give up! 💪",
          "Last chance... 😢",
          "Just say yes already ✨",
        ],
      };
  }
}

export function getOccasionMessage(occasion: string, sender: string, receiver: string): string {
  switch (occasion) {
    case "valentine":
      return `${receiver}, will you be my Valentine? ❤️`;
    case "birthday":
      return `Happy Birthday, ${receiver}! 🎉`;
    case "confession":
      return `${receiver}, I have something to tell you... 💕`;
    case "anniversary":
      return `Happy Anniversary, ${receiver}! 💍`;
    default:
      return `${receiver}, this is for you! ✨`;
  }
}

export function getSuccessMessage(occasion: string, sender: string): string {
  switch (occasion) {
    case "valentine":
      return `You just made ${sender}'s day! ❤️🎉`;
    case "birthday":
      return `${sender} is so happy you're celebrating! 🎂🎉`;
    case "confession":
      return `${sender} is over the moon right now! 🌙💕`;
    case "anniversary":
      return `Here's to many more years! 💍✨`;
    default:
      return `You made ${sender} so happy! 🎉❤️`;
  }
}
