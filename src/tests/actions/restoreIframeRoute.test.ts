import { describe, it, beforeEach } from "vitest";
import { initTaborStore, type TaborStore } from "@tabor/store";

import { getRouter } from "../unit";

describe("restore iframe route from localStorage", () => {
  let taborStore: TaborStore;
  let router: ReturnType<typeof getRouter>;

  beforeEach(() => {
    localStorage.clear();
    router = getRouter();
    taborStore = initTaborStore(router);
  });

  it("should restore valid iframe route on first navigation", async ({ expect }) => {
    const storedRoute = {
      path: "/iframe-restore",
      name: "rt-iframe--iframe-restore",
      meta: {
        tabConfig: { iframeAttributes: { src: "https://example.com/iframe" } },
        routeName: "rt-iframe--iframe-restore",
      },
    };
    localStorage.setItem("tabor-iframe-route", JSON.stringify(storedRoute));

    await router.push("/");

    const resolved = router.resolve({ path: "/iframe-restore" });
    expect(resolved.matched.length).toBeGreaterThan(0);
  });

  it("should reject invalid iframe route schema and remove it", async ({ expect }) => {
    localStorage.setItem("tabor-iframe-route", JSON.stringify({ path: "/bad", name: "" }));

    await router.push("/");

    expect(localStorage.getItem("tabor-iframe-route")).toBeNull();
    const resolved = router.resolve({ path: "/bad" });
    expect(resolved.matched.length).toBe(0);
  });

  it("should reject iframe route with invalid src protocol", async ({ expect }) => {
    const storedRoute = {
      path: "/iframe-js",
      name: "rt-iframe--iframe-js",
      meta: {
        tabConfig: { iframeAttributes: { src: "javascript:alert(1)" } },
        routeName: "rt-iframe--iframe-js",
      },
    };
    localStorage.setItem("tabor-iframe-route", JSON.stringify(storedRoute));

    await router.push("/");

    expect(localStorage.getItem("tabor-iframe-route")).toBeNull();
    const resolved = router.resolve({ path: "/iframe-js" });
    expect(resolved.matched.length).toBe(0);
  });
});
