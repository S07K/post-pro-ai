export const ENDPOINT = process.env.HOST || "http://localhost:5001";
export const APP_ID = process.env.NEXT_PUBLIC_APP_ID || "";
export const CONFIG_ID = process.env.NEXT_PUBLIC_CONFIG_ID || "";

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
