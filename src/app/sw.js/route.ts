const deploymentVersion =
  process.env.VERCEL_GIT_COMMIT_SHA ??
  process.env.VERCEL_DEPLOYMENT_ID ??
  process.env.NEXT_PUBLIC_APP_VERSION ??
  "development";

export const dynamic = "force-dynamic";

export function GET() {
  const source = `
const VERSION = ${JSON.stringify(deploymentVersion)};

self.addEventListener("install", () => {
  // Updated workers wait until the client explicitly accepts the release.
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", (event) => {
  if (event.request.method === "GET" && event.request.mode === "navigate") {
    event.respondWith(fetch(event.request));
  }
});
`;

  return new Response(source, {
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Content-Type": "application/javascript; charset=utf-8",
      "Service-Worker-Allowed": "/",
      "X-App-Version": deploymentVersion,
    },
  });
}
