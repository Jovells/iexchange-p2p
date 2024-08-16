export const socials = [
  {
    name: "twitter",
    href: "https://x.com/iExchangeP2P",
    icon: {
      light: "/images/icons/socials/light/x.svg",
      dark: "/images/icons/socials/dark/x.svg",
    },
  },
  {
    name: "telegram",
    href: "https://t.me/iExchangeCommunity",
    icon: {
      light: "/images/icons/socials/light/telegram.svg",
      dark: "/images/icons/socials/dark/telegram.svg",
    },
  },
  {
    name: "youtube",
    href: "https://youtube.com/c/iExchange",
    icon: {
      light: "/images/icons/socials/light/youtube.svg",
      dark: "/images/icons/socials/dark/youtube.svg",
    },
  },
];

export type Social = typeof socials[number];