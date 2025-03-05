import type { Cache, RouterTabStore } from "@routerTab/store";
import { beforeEach, describe, type ExpectStatic, it } from "vitest";
import type { Router } from "vue-router";

import { beforeEachFn, sameLength } from "../unit";

const expectActiveTab = (expect: ExpectStatic, routerTab: RouterTabStore) => {
  expect(routerTab.state.activeTab).toEqual(routerTab.state.tabs.at(-1));
  expect(routerTab.state.activeTab?.id).toEqual(
    routerTab.state.tabs.at(-1)?.id,
  );
};

describe("Should add tab when router pushed", async () => {
  let router: Router;
  let routerTab: RouterTabStore;

  beforeEach(async () => {
    const item = await beforeEachFn();
    router = item.router;
    routerTab = item.routerTab;
  });

  it(`默认没有配置 key 时，应该默认使用 'fullPath' 的类型`, async ({
    expect,
  }) => {
    await router.push("/initial?id=1&name=amy");

    expect(routerTab.state.tabs.at(-1)).toEqual({
      fullPath: "/initial?id=1&name=amy",
      id: "/initial?id=1&name=amy",
      keepAlive: true,
      name: "initial",
    });

    expectActiveTab(expect, routerTab);
  });

  it("配置 key:path 时，包含 query 的 path，id需要去除 query", async ({
    expect,
  }) => {
    await router.push("/path?id=1");

    expect(routerTab.state.tabs.at(-1)).toEqual({
      fullPath: "/path?id=1",
      id: "/path",
      keepAlive: true,
      name: "path",
    });

    expectActiveTab(expect, routerTab);
  });

  it("配置 key:path 时，包含 params 的 path，id不能去除 params", async ({
    expect,
  }) => {
    await router.push("/pathWithParams/2");

    expect(routerTab.state.tabs.at(-1)).toEqual({
      fullPath: "/pathWithParams/2",
      id: "/pathWithParams/2",
      keepAlive: true,
      name: "pathWithParams",
    });

    expectActiveTab(expect, routerTab);
  });

  it("配置 key:fullpath 时，包含 query 的 fullpath，不能去除 query", async ({
    expect,
  }) => {
    await router.push("/fullpath?id=1");

    expect(routerTab.state.tabs.at(-1)).toEqual({
      fullPath: "/fullpath?id=1",
      id: "/fullpath?id=1",
      keepAlive: true,
      name: "fullpath",
    });

    expectActiveTab(expect, routerTab);
  });
});

describe("Check add Tab when the same route", async () => {
  let router: Router;
  let routerTab: RouterTabStore;
  let cache: Cache;
  let expectLength: ReturnType<typeof sameLength>;

  beforeEach(async () => {
    const item = await beforeEachFn();
    router = item.router;
    routerTab = item.routerTab;
    cache = routerTab.cache;
    expectLength = sameLength(cache, routerTab);
  });

  it("fullPath：相同path，相同query，应该同一条", async ({ expect }) => {
    routerTab.clear();
    await router.push("/initial?id=1&name=amy");
    await router.push({ path: "/initial", query: { id: "1", name: "amy" } });

    expectLength(expect, 1);
    expectActiveTab(expect, routerTab);
  });

  it("fullPath：相同path，不同query，应该新增一条", async ({ expect }) => {
    await router.push("/initial?id=1&name=amy");
    await router.push("/initial?id=1");

    expectLength(expect, 2);
    expectActiveTab(expect, routerTab);
  });

  it("fullPath：相同path，不同params，应该新增一条", async ({ expect }) => {
    await router.push("/fullpathWithParams/1");
    await router.push("/fullpathWithParams/2");

    expectLength(expect, 2);
    expectActiveTab(expect, routerTab);
  });

  it("path：相同path，相同query，应该同一条", async ({ expect }) => {
    await router.push("/path?id=1&name=amy");
    await router.push({ path: "/path", query: { id: "1", name: "amy" } });

    expectLength(expect, 1);
  });

  it("path：相同path，不同query，应该同一条", async ({ expect }) => {
    await router.push("/path?id=1&name=amy");
    await router.push({ path: "/path", query: { id: "1" } });

    expectLength(expect, 1);
  });

  it("path：相同path，不同params，应该新增一条", async ({ expect }) => {
    await router.push("/pathWithParams/1");
    await router.push({ name: "pathWithParams", params: { id: "2" } });

    expectLength(expect, 2);
    expect(routerTab.state.activeTab).equal(routerTab.state.tabs.at(-1));
    expect(cache.state.activeKey).toEqual("/pathWithParams/2");
  });

  it("custom：相同query的id，应该同一条", async ({ expect }) => {
    await router.push("/custom?id=1&name=amy");
    await router.push({ path: "/custom", query: { id: "1", name: "jean" } });

    expectLength(expect, 1);
    expect(routerTab.state.activeTab?.id).toEqual("/custom?id=1");
    expect(cache.state.activeKey).toEqual("/custom?id=1");
  });

  it("custom：不同params的id，应该同一条", async ({ expect }) => {
    await router.push("/customWithParams/1");
    await router.push({ name: "customWithParams", params: { id: 2 } });

    expectLength(expect, 1);
    expect(routerTab.state.activeTab?.id).toEqual("/customWithParams");
    expect(cache.state.activeKey).toEqual("/customWithParams");
  });
});
