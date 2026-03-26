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
  return btoa(encodeURIComponent(JSON.stringify(data)));
}

export function decodeSurpriseData(encoded: string): SurpriseData | null {
  try {
    return JSON.parse(decodeURIComponent(atob(encoded)));
  } catch {
    return null;
  }
}

export function generateSlug(sender: string, receiver: string): string {
  const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  return `${clean(sender)}-loves-${clean(receiver)}`;
}

export const noMessages = [
  "Are you sure? 🥺",
  "Think again! 💭",
  "Don't do me like this 😭",
  "Pretty please? 🙏",
  "I won't give up! 💪",
  "Last chance... 😢",
  "Just click Yes already 😭❤️",
];

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
