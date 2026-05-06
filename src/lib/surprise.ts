import LZString from "lz-string";

export interface SurpriseData {
  senderName: string;
  receiverName: string;
  occasion: string;
  message: string;
  theme: string;
}

export const occasions = [
  { id: "birthday", label: "Birthday", emoji: "🎂" },
  { id: "anniversary", label: "Anniversary", emoji: "💍" },
  { id: "confession", label: "Crush Confession", emoji: "😏" },
  { id: "valentine", label: "Valentine", emoji: "💖" },
  { id: "graduation", label: "Graduation", emoji: "🎓" },
  { id: "apology", label: "Apology", emoji: "🙏" },
  { id: "congratulations", label: "Congratulations", emoji: "🎉" },
  { id: "prank", label: "Prank", emoji: "😂" },
  { id: "mothersday", label: "Mother's Day", emoji: "💐" },
  { id: "fathersday", label: "Father's Day", emoji: "👨‍👧" },
  { id: "custom", label: "Custom", emoji: "🎨" },
] as const;

export const themes = [
  { id: "cute", label: "Cute", emoji: "🐱" },
  { id: "romantic", label: "Romantic", emoji: "🌹" },
  { id: "funny", label: "Funny", emoji: "😂" },
  { id: "anime", label: "Anime", emoji: "💫" },
  { id: "minimalist", label: "Minimalist", emoji: "🖤" },
  { id: "luxury", label: "Luxury", emoji: "✨" },
  { id: "african", label: "African", emoji: "🌍" },
  { id: "meme", label: "Meme", emoji: "🤣" },
] as const;

export function encodeSurpriseData(data: SurpriseData): string {
  const compact = {
    s: data.senderName,
    r: data.receiverName,
    o: data.occasion,
    m: data.message,
    t: data.theme,
  };
  return LZString.compressToEncodedURIComponent(JSON.stringify(compact));
}

export function decodeSurpriseData(encoded: string): SurpriseData | null {
  try {
    const decompressed = LZString.decompressFromEncodedURIComponent(encoded);
    if (decompressed) {
      const compact = JSON.parse(decompressed);
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
    }
    // Fallback: legacy base64
    let b64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4) b64 += "=";
    const compact = JSON.parse(decodeURIComponent(escape(atob(b64))));
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
  return `${clean(sender)}-to-${clean(receiver)}`;
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
    case "graduation":
      return {
        yesLabel: "Celebrate! 🎓",
        noLabel: "Nah 😴",
        noMessages: [
          "You worked SO hard for this! 📚",
          "All those late nights! ☕",
          "Don't you want your cap? 🎓",
          "The diploma is waiting! 📜",
          "Your parents are watching... 👀",
          "THROW THE CAP ALREADY! 🎉",
          "🎓🎓🎓 JUST DO IT 🎓🎓🎓",
        ],
      };
    case "apology":
      return {
        yesLabel: "I Forgive You 🤍",
        noLabel: "Not Yet 😤",
        noMessages: [
          "I really am sorry... 🥺",
          "I know I messed up 😔",
          "Please give me a chance 🙏",
          "I'll do better, I promise 💪",
          "My heart hurts without you 💔",
          "I won't stop trying... 😢",
          "Please... I mean it from my heart 🤍",
        ],
      };
    case "congratulations":
      return {
        yesLabel: "Thank You! 🎉",
        noLabel: "Too Humble 😅",
        noMessages: [
          "Don't be shy! You earned it! 💪",
          "Come on, take the credit! 🏆",
          "Everyone's clapping! 👏",
          "You're amazing and you know it ⭐",
          "Accept the praise! 🌟",
          "Okay but seriously WELL DONE 🎊",
          "🎉🎉🎉 JUST SAY THANKS 🎉🎉🎉",
        ],
      };
    case "prank":
      return {
        yesLabel: "Ha Ha OK 😂",
        noLabel: "I'm Scared 😰",
        noMessages: [
          "It's just a prank bro 😂",
          "Don't be scared! 👻",
          "Come onnn it's funny! 🤣",
          "You're being pranked! Deal with it 😏",
          "THERE'S NO ESCAPE 💀",
          "You walked right into this one 🪤",
          "GOTCHA! Now click the button 😈",
        ],
      };
    case "mothersday":
      return {
        yesLabel: "Love You Mom 💗",
        noLabel: "Aww Mom 🥺",
        noMessages: [
          "But you're the best mom ever! 💐",
          "Remember all those hugs? 🤗",
          "Mom, please... 🥺",
          "You raised me so well! 💖",
          "I owe you everything 🌷",
          "Don't break my heart, mom 💔",
          "Okay just say YES already 💗",
        ],
      };
    case "fathersday":
      return {
        yesLabel: "Love You Dad 💙",
        noLabel: "Come On Dad 😅",
        noMessages: [
          "But you're my hero! 🦸",
          "Remember teaching me to ride a bike? 🚲",
          "Dad jokes incoming if you say no 😂",
          "You're the GOAT, dad 🐐",
          "I learned everything from you 💙",
          "Don't make me beg, dad 🙏",
          "Just accept the love already! 💙",
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
    case "graduation":
      return `Congratulations on graduating, ${receiver}! 🎓`;
    case "apology":
      return `${receiver}, I'm truly sorry... 🤍`;
    case "congratulations":
      return `${receiver}, you did it! So proud of you! 🎉`;
    case "prank":
      return `${receiver}, I have something VERY important... 😏`;
    case "mothersday":
      return `${receiver}, Happy Mother's Day! 💐`;
    case "fathersday":
      return `${receiver}, Happy Father's Day! 👨‍👧`;
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
    case "graduation":
      return `${sender} is so proud of you! 🎓🌟`;
    case "apology":
      return `${sender} feels so much better now 🤍✨`;
    case "congratulations":
      return `${sender} is cheering for you! 🎊🏆`;
    case "prank":
      return `LOL ${sender} totally got you! 😂🤣`;
    case "mothersday":
      return `${sender} loves you more than words, mom! 💐💗`;
    case "fathersday":
      return `${sender} thinks you're the best dad ever! 💙🏆`;
    default:
      return `You made ${sender} so happy! 🎉❤️`;
  }
}
