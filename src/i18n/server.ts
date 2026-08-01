import { cookies, headers } from "next/headers";
import {
  localeCookieName,
  localeFromAcceptLanguage,
  parseLocale,
  type Locale,
} from "@/i18n/config";

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const saved = parseLocale(cookieStore.get(localeCookieName)?.value);
  if (saved) return saved;
  const requestHeaders = await headers();
  return localeFromAcceptLanguage(requestHeaders.get("accept-language"));
}
