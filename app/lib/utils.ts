export const ENDPOINT = process.env.HOST || "http://localhost:5001";

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
