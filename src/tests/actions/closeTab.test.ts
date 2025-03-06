import type { RouterTabStore } from "@tabor/store";
import { beforeEach, describe, it } from "vitest";
import type { Router } from "vue-router";

import { beforeEachFn, sameLength } from "../unit";

describe("Check tab closed", async () => {
  let router: Router;
  let routerTab: RouterTabStore;
  let expectLength: ReturnType<typeof sameLength>;

  beforeEach(async () => {
    const item = await beforeEachFn();
    router = item.router;
    routerTab = item.routerTab;
    expectLength = sameLength(routerTab.cache, routerTab);
  });

  it("close tab by id", async ({ expect }) => {
    await router.push("/initial?id=1");
    await router.push("/path?id=1");
    expectLength(expect, 2);
    await routerTab.close("/initial?id=1");
    expectLength(expect, 1);
  });

  it("close current tab", async ({ expect }) => {
    await router.push("/initial?id=3");
    await router.push("/initial?id=1&name=amy");
    expectLength(expect, 2);
    await routerTab.close();
    expectLength(expect, 1);
  });

  it("close last tab", async ({ expect }) => {
    await router.push("/initial?id=1&name=amy");
    expectLength(expect, 1);
    await routerTab.close();
    expectLength(expect, 0);
  });

  it("close tab by route", async ({ expect }) => {
    await router.push("/initial?id=1");
    await router.push("/path?id=1");
    expectLength(expect, 2);
    await routerTab.close(router.currentRoute.value.fullPath);

    expectLength(expect, 1);
    expect(routerTab.state.activeTab?.id).toEqual("/initial?id=1");
  });

  it("close no funded tab", async ({ expect }) => {
    await router.push("/initial?id=1");
    await router.push("/path?id=1");
    expectLength(expect, 2);
    await routerTab.close("/initial?id=2");

    expectLength(expect, 2);
  });

  it("close active tab if param is undefined", async ({ expect }) => {
    await router.push("/initial?id=1");
    await router.push("/path?id=1");

    await routerTab.open("/initial?id=1");
    expect(routerTab.state.activeTab?.id).toEqual("/initial?id=1");
    expectLength(expect, 2);
    await routerTab.close();
    expect(routerTab.state.activeTab?.id).toEqual("/path");
    expectLength(expect, 1);
  });

  it("after tab is active when current tab closed", async ({ expect }) => {
    await router.push("/initial?id=1");
    await router.push("/path?id=1");
    await routerTab.open("/initial?id=1");
    expect(routerTab.state.activeTab?.id).toEqual("/initial?id=1");
    expectLength(expect, 2);

    await routerTab.close("/initial?id=1");
    expect(routerTab.state.activeTab?.id).toEqual("/path");
    expectLength(expect, 1);
  });

  it("before tab is active when current tab closed and has not after tab", async ({
    expect,
  }) => {
    await router.push("/initial?id=1");
    await router.push("/path?id=1");

    await routerTab.open("/path?id=1");
    expectLength(expect, 2);
    expect(routerTab.state.activeTab?.id).toEqual("/path");

    await routerTab.close({ id: "/path" });
    expectLength(expect, 1);
    expect(routerTab.state.activeTab?.id).toEqual("/initial?id=1");
  });

  it("navigate to custom tab when add config", async ({ expect }) => {
    await router.push("/initial?id=1");
    await router.push("/initial?id=2");
    await router.push("/initial?id=3");
    await router.push("/path?id=1");
    expectLength(expect, 4);
    expect(routerTab.state.activeTab?.id).toEqual("/path");

    await routerTab.close({ fullPath: "/path?id=1" }, { id: "/initial?id=2" });
    expectLength(expect, 3);
    expect(routerTab.state.activeTab?.id).toEqual("/initial?id=2");
  });

  it("close tab but open the same tab", async ({ expect }) => {
    await router.push("/initial?id=1");
    await router.push("/initial?id=2");
    await router.push("/initial?id=3");
    await router.push("/path?id=1");

    expectLength(expect, 4);
    expect(routerTab.state.activeTab?.id).toEqual("/path");

    routerTab.open("/initial?id=2");

    await routerTab.close("/path?id=1", { fullPath: "/path?id=1" });

    expectLength(expect, 4);
    expect(routerTab.state.activeTab?.id).toEqual("/path");
  });

  it("close others", async ({ expect }) => {
    await router.push("/initial?id=1");
    await router.push("/initial?id=2");
    await router.push("/initial?id=3");
    await router.push("/path?id=1");
    expectLength(expect, 4);
    expect(routerTab.state.activeTab?.id).toEqual("/path");

    await routerTab.closeOthers("/path");
    expectLength(expect, 0); //{path:'/'} 被清除掉了
    expect(routerTab.state.activeTab?.id).toEqual("/path");
  });

  it("close others when params tab is not exist", async ({ expect }) => {
    await router.push("/initial?id=1");
    await router.push("/initial?id=2");
    await router.push("/initial?id=3");
    await router.push("/path?id=1");
    expectLength(expect, 4);
    expect(routerTab.state.activeTab?.id).toEqual("/path");

    await routerTab.closeOthers("/wwwww");
    expectLength(expect, 4);
    expect(routerTab.state.activeTab?.id).toEqual("/path");
  });

  it("close others but is not active tab", async ({ expect }) => {
    await router.push("/initial?id=1");
    await router.push("/initial?id=2");
    await router.push("/initial?id=3");
    await router.push("/path?id=1");
    expectLength(expect, 4);
    expect(routerTab.state.activeTab?.id).toEqual("/path");

    await routerTab.closeOthers("/initial?id=2");
    expectLength(expect, 0); //{path:'/'} 被清除掉了
    expect(routerTab.state.activeTab?.id).toEqual("/initial?id=2");
  });

  it("close others when has not params", async ({ expect }) => {
    await router.push("/initial?id=1");
    await router.push("/initial?id=2");
    await router.push("/initial?id=3");
    await router.push("/path?id=1");
    expectLength(expect, 4);
    expect(routerTab.state.activeTab?.id).toEqual("/path");

    await routerTab.closeOthers();
    expectLength(expect, 0); //{path:'/'} 被清除掉了
    expect(routerTab.state.activeTab?.id).toEqual("/path");
  });
});
