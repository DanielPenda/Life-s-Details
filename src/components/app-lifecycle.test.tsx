import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppLifecycle } from "@/components/app-lifecycle";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("AppLifecycle", () => {
  beforeEach(() => {
    Reflect.deleteProperty(navigator, "serviceWorker");
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn().mockReturnValue({ matches: false }),
    });
  });

  it("keeps install access visible after the native prompt is dismissed", async () => {
    const prompt = vi.fn().mockResolvedValue(undefined);
    const installEvent = new Event("beforeinstallprompt", {
      cancelable: true,
    });
    Object.assign(installEvent, {
      prompt,
      userChoice: Promise.resolve({ outcome: "dismissed", platform: "web" }),
    });

    render(<AppLifecycle />);
    expect(await screen.findByRole("button", { name: "Install app" })).toBeTruthy();

    act(() => window.dispatchEvent(installEvent));
    fireEvent.click(screen.getByRole("button", { name: "Install app" }));

    await waitFor(() => expect(prompt).toHaveBeenCalledOnce());
    expect(screen.getByRole("button", { name: "Install app" })).toBeTruthy();
  });

  it("offers an update and activates the waiting release", async () => {
    const postMessage = vi.fn();
    const waitingWorker = { postMessage } as unknown as ServiceWorker;
    const registration = {
      waiting: waitingWorker,
      installing: null,
      update: vi.fn().mockResolvedValue(undefined),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as ServiceWorkerRegistration;
    const serviceWorker = {
      controller: {} as ServiceWorker,
      register: vi.fn().mockResolvedValue(registration),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as ServiceWorkerContainer;
    Object.defineProperty(navigator, "serviceWorker", {
      configurable: true,
      value: serviceWorker,
    });

    render(<AppLifecycle />);

    expect(await screen.findByText("Update available")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Update now" }));
    expect(postMessage).toHaveBeenCalledWith({ type: "SKIP_WAITING" });
  });
});
