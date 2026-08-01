import { describe, expect, it } from "vitest";
import manifest from "@/app/manifest";
import { GET as getServiceWorker } from "@/app/sw.js/route";

describe("PWA configuration", () => {
  it("provides install metadata and phone-sized icons", () => {
    const appManifest = manifest();

    expect(appManifest.display).toBe("standalone");
    expect(appManifest.start_url).toBe("/");
    expect(appManifest.scope).toBe("/");
    expect(appManifest.icons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ sizes: "192x192", purpose: "any" }),
        expect.objectContaining({ sizes: "512x512", purpose: "maskable" }),
      ]),
    );
  });

  it("serves a non-cached worker with the immediate update protocol", async () => {
    const response = getServiceWorker();
    const source = await response.text();

    expect(response.headers.get("cache-control")).toContain("no-cache");
    expect(response.headers.get("content-type")).toContain(
      "application/javascript",
    );
    expect(response.headers.get("x-app-version")).toBeTruthy();
    expect(source).toContain('event.data?.type === "SKIP_WAITING"');
    expect(source).toContain("self.skipWaiting()");
    expect(source).toContain("self.clients.claim()");
  });
});
