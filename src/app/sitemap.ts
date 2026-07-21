import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

const routes = ["", "/services", "/book", "/contact", "/privacy", "/terms"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${env.NEXT_PUBLIC_SITE_URL}${route}`,
    lastModified: new Date(),
  }));
}
