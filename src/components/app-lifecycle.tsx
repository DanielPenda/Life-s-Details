"use client";

import { Check, Download, RefreshCw, Share, X } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { useTranslations } from "@/i18n/locale-provider";

type InstallChoice = {
  outcome: "accepted" | "dismissed";
  platform: string;
};

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<InstallChoice>;
}

type NavigatorWithStandalone = Navigator & { standalone?: boolean };

function isStandaloneMode() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    Boolean((window.navigator as NavigatorWithStandalone).standalone)
  );
}

function isAppleMobile() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

export function AppLifecycle() {
  const pathname = usePathname();
  const t = useTranslations();
  const [ready, setReady] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallHelp, setShowInstallHelp] = useState(false);
  const [appleMobile, setAppleMobile] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    setReady(true);
    setInstalled(isStandaloneMode());
    setAppleMobile(isAppleMobile());

    const captureInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };
    const markInstalled = () => {
      setInstalled(true);
      setInstallPrompt(null);
      setShowInstallHelp(false);
    };

    window.addEventListener("beforeinstallprompt", captureInstallPrompt);
    window.addEventListener("appinstalled", markInstalled);

    if (!("serviceWorker" in navigator)) {
      return () => {
        window.removeEventListener("beforeinstallprompt", captureInstallPrompt);
        window.removeEventListener("appinstalled", markInstalled);
      };
    }

    let registration: ServiceWorkerRegistration | undefined;
    let installingWorker: ServiceWorker | null = null;
    let updateTimer: ReturnType<typeof setInterval> | undefined;
    let reloading = false;

    const showWaitingWorker = () => {
      if (registration?.waiting && navigator.serviceWorker.controller) {
        setWaitingWorker(registration.waiting);
      }
    };
    const handleInstallingState = () => {
      if (
        installingWorker?.state === "installed" &&
        navigator.serviceWorker.controller
      ) {
        setWaitingWorker(installingWorker);
      }
    };
    const handleUpdateFound = () => {
      installingWorker?.removeEventListener("statechange", handleInstallingState);
      installingWorker = registration?.installing ?? null;
      installingWorker?.addEventListener("statechange", handleInstallingState);
    };
    const checkForUpdate = () => {
      if (document.visibilityState === "visible") {
        void registration?.update();
      }
    };
    const reloadForUpdate = () => {
      if (!reloading) {
        reloading = true;
        window.location.reload();
      }
    };

    void navigator.serviceWorker
      .register("/sw.js", { scope: "/", updateViaCache: "none" })
      .then((currentRegistration) => {
        registration = currentRegistration;
        registration.addEventListener("updatefound", handleUpdateFound);
        showWaitingWorker();
        void registration.update();
        updateTimer = setInterval(checkForUpdate, 60 * 60 * 1000);
      })
      .catch(() => {
        // Installation remains progressively enhanced if registration fails.
      });

    window.addEventListener("focus", checkForUpdate);
    document.addEventListener("visibilitychange", checkForUpdate);
    navigator.serviceWorker.addEventListener("controllerchange", reloadForUpdate);

    return () => {
      window.removeEventListener("beforeinstallprompt", captureInstallPrompt);
      window.removeEventListener("appinstalled", markInstalled);
      window.removeEventListener("focus", checkForUpdate);
      document.removeEventListener("visibilitychange", checkForUpdate);
      navigator.serviceWorker.removeEventListener("controllerchange", reloadForUpdate);
      registration?.removeEventListener("updatefound", handleUpdateFound);
      installingWorker?.removeEventListener("statechange", handleInstallingState);
      if (updateTimer) clearInterval(updateTimer);
    };
  }, []);

  const requestInstall = async () => {
    trackEvent(analyticsEvents.appInstallPrompt, {
      method: installPrompt ? "native" : appleMobile ? "ios_help" : "browser_help",
    });

    if (!installPrompt) {
      setShowInstallHelp(true);
      return;
    }

    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    setInstallPrompt(null);
    if (choice.outcome === "accepted") {
      trackEvent(analyticsEvents.appInstallAccepted);
    }
  };

  const applyUpdate = () => {
    trackEvent(analyticsEvents.appUpdateApplied);
    waitingWorker?.postMessage({ type: "SKIP_WAITING" });
  };

  if (!ready || pathname.startsWith("/admin")) return null;

  return (
    <>
      {!installed ? (
        <button
          className={`pwa-install-trigger${waitingWorker ? " pwa-install-trigger-raised" : ""}`}
          onClick={() => void requestInstall()}
          title={t("pwa.installTitle")}
          type="button"
        >
          <Download aria-hidden="true" size={18} />
          {t("pwa.install")}
        </button>
      ) : null}

      {waitingWorker ? (
        <section aria-live="polite" className="pwa-update-banner">
          <div>
            <RefreshCw aria-hidden="true" size={20} />
            <span>
              <strong>{t("pwa.updateAvailable")}</strong>
              <small>{t("pwa.updateReady")}</small>
            </span>
          </div>
          <button className="button button-light" onClick={applyUpdate} type="button">
            <RefreshCw aria-hidden="true" size={17} />
            {t("pwa.updateNow")}
          </button>
        </section>
      ) : null}

      {showInstallHelp ? (
        <div className="pwa-dialog-backdrop" role="presentation">
          <section
            aria-labelledby="install-app-title"
            aria-modal="true"
            className="pwa-install-dialog"
            role="dialog"
          >
            <button
              aria-label={t("pwa.close")}
              className="pwa-dialog-close"
              onClick={() => setShowInstallHelp(false)}
              title={t("pwa.closeTitle")}
              type="button"
            >
              <X aria-hidden="true" size={20} />
            </button>
            {appleMobile ? (
              <Share aria-hidden="true" size={25} />
            ) : (
              <Download aria-hidden="true" size={25} />
            )}
            <h2 id="install-app-title">{t("pwa.installTitle")}</h2>
            <p>
              {appleMobile
                ? t("pwa.iosHelp")
                : t("pwa.browserHelp")}
            </p>
            <button
              className="button button-primary"
              onClick={() => setShowInstallHelp(false)}
              type="button"
            >
              <Check aria-hidden="true" size={18} />
              {t("pwa.gotIt")}
            </button>
          </section>
        </div>
      ) : null}
    </>
  );
}
