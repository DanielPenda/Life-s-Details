import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Life's Details",
    short_name: "Life's Details",
    description: "Book and manage mobile car detailing in Aalter and nearby areas.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f6f3ed",
    theme_color: "#0f3d3e",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icons/app-icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/app-icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/app-icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
