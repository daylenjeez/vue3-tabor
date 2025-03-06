import type { RouterTabStore } from "@tabor/store";
import { beforeEach, describe, it } from "vitest";

import { beforeEachFn, sameLength } from "../unit";

describe("test open api", async () => {
  let routerTab: RouterTabStore;
  let expectLength: ReturnType<typeof sameLength>;

  beforeEach(async () => {
    const item = await beforeEachFn();
    routerTab = item.routerTab;
    expectLength = sameLength(routerTab.cache, routerTab);
  });

  it("open a new router", async ({ expect }) => {
    await routerTab.open("/initial?id=1&name=amy");
    expect(routerTab.state.activeTab?.id).toEqual("/initial?id=1&name=amy");
    await routerTab.open("/initial?id=2");
    expect(routerTab.state.activeTab?.id).toEqual("/initial?id=2");
  });

  it("open a current tab", async ({ expect }) => {
    await routerTab.open("/initial?id=1&name=amy");
    await routerTab.open("/initial?id=2");

    expect(routerTab.state.activeTab?.id).toEqual("/initial?id=2");

    await routerTab.open("/initial?id=1&name=amy");
    expectLength(expect, 2);
    expect(routerTab.state.activeTab?.id).toEqual("/initial?id=1&name=amy");
  });

  it("replace a current tab", async ({ expect }) => {
    await routerTab.open("/initial?id=1&name=amy");
    await routerTab.open("/initial?id=2");

    expect(routerTab.state.activeTab?.id).toEqual("/initial?id=2");

    await routerTab.open("/initial?id=1&name=amy", { replace: true });
    expectLength(expect, 2);
    expect(routerTab.state.activeTab?.id).toEqual("/initial?id=1&name=amy");
  });

  it("open a current tab,but different query", async ({ expect }) => {
    await routerTab.open("/initial?id=1&name=amy");
    await routerTab.open("/path?id=2");

    expect(routerTab.state.activeTab?.id).toEqual("/path");

    await routerTab.open("/path?id=3", { replace: true });
    expectLength(expect, 2);
    expect(routerTab.state.activeTab?.id).toEqual("/path");
  });
});
