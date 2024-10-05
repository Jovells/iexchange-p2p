export const getEnv = (): "dev" | "production" | "local" => {
  const envVar = process.env.NEXT_PUBLIC_XMTP_ENVIRONMENT;
  if (envVar === "production") {
    return envVar;
  }
  if (envVar === "local") {
    return envVar;
  }
  return "dev";
};

export const isAppEnvAlpha = (): boolean => {
  return window.location.hostname.includes("alpha");
};
export const isAppEnvTestnet = (): boolean => {
  return window.location.hostname.includes("testnet");
};

export const tagStr = (): string | null => {
  return getEnv() === "production" ? null : getEnv().toLocaleUpperCase();
};

export const getGoogleTagId = (): string => {
  return process.env.NEXT_PUBLIC_GOOGLE_TAG_ID ?? "";
};
