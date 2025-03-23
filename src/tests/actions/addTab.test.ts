import type { Cache, TaborStore } from "@tabor/store";
import { beforeEach, describe, type ExpectStatic, it, vi, afterEach } from "vitest";
import type { Router } from "vue-router";

import { beforeEachFn, sameLength } from "../unit";
import { nextTick } from "vue";

const expectActiveTab = (expect: ExpectStatic, taborStore: TaborStore) => {
  expect(taborStore.state.activeTab).toEqual(taborStore.state.tabs.at(-1));
  expect(taborStore.state.activeTab?.id).toEqual(
    taborStore.state.tabs.at(-1)?.id,
  );
};

describe("Should add tab when router pushed", async () => {
  let router: Router;
  let taborStore: TaborStore;

  beforeEach(async () => {
    const item = await beforeEachFn();
    router = item.router;
    taborStore = item.taborStore;
  });

  it(`默认没有配置 key 时，应该默认使用 'fullPath' 的类型`, async ({
    expect,
  }) => {
    await router.push("/initial?id=1&name=amy");

    expect(taborStore.state.tabs.at(-1)).toEqual({
      fullPath: "/initial?id=1&name=amy",
      id: "/initial?id=1&name=amy",
      keepAlive: true,
      name: "initial",
    });

    expectActiveTab(expect, taborStore);
  });

  it("配置 key:path 时，包含 query 的 path，id需要去除 query", async ({
    expect,
  }) => {
    await router.push("/path?id=1");

    expect(taborStore.state.tabs.at(-1)).toEqual({
      fullPath: "/path?id=1",
      id: "/path",
      keepAlive: true,
      name: "path",
    });

    expectActiveTab(expect, taborStore);
  });

  it("配置 key:path 时，包含 params 的 path，id不能去除 params", async ({
    expect,
  }) => {
    await router.push("/pathWithParams/2");

    expect(taborStore.state.tabs.at(-1)).toEqual({
      fullPath: "/pathWithParams/2",
      id: "/pathWithParams/2",
      keepAlive: true,
      name: "pathWithParams",
    });

    expectActiveTab(expect, taborStore);
  });

  it("配置 key:fullpath 时，包含 query 的 fullpath，不能去除 query", async ({
    expect,
  }) => {
    await router.push("/fullpath?id=1");

    expect(taborStore.state.tabs.at(-1)).toEqual({
      fullPath: "/fullpath?id=1",
      id: "/fullpath?id=1",
      keepAlive: true,
      name: "fullpath",
    });

    expectActiveTab(expect, taborStore);
  });
});

describe("Check add Tab when the same route", async () => {
  let router: Router;
  let taborStore: TaborStore;
  let cache: Cache;
  let expectLength: ReturnType<typeof sameLength>;

  beforeEach(async () => {
    const item = await beforeEachFn();
    router = item.router;
    taborStore = item.taborStore;
    cache = taborStore.cache;
    expectLength = sameLength(cache, taborStore);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("fullPath：相同path，相同query，应该同一条", async ({ expect }) => {
    taborStore.clear();
    await router.push("/initial?id=1&name=amy");
    vi.advanceTimersByTime(20);
    await router.push({ path: "/initial", query: { id: "1", name: "amy" } });
    vi.advanceTimersByTime(20);

    expectLength(expect, 1);
    expectActiveTab(expect, taborStore);
  });

  it("fullPath：相同path，不同query，应该新增一条", async ({ expect }) => {
    await router.push("/initial?id=1&name=amy");
    vi.advanceTimersByTime(20);
    await router.push("/initial?id=1");
    vi.advanceTimersByTime(20);

    expectLength(expect, 2);
    expectActiveTab(expect, taborStore);
  });

  it("fullPath：相同path，不同params，应该新增一条", async ({ expect }) => {
    await router.push("/fullpathWithParams/1");
    vi.advanceTimersByTime(20);
    await router.push("/fullpathWithParams/2");
    vi.advanceTimersByTime(20);

    expectLength(expect, 2);
    expectActiveTab(expect, taborStore);
  });

  it("path：相同path，相同query，应该同一条", async ({ expect }) => {
    await router.push("/path?id=1&name=amy");
    vi.advanceTimersByTime(20);
    await router.push({ path: "/path", query: { id: "1", name: "amy" } });
    vi.advanceTimersByTime(20);

    expectLength(expect, 1);
  });

  it("path：相同path，不同query，应该同一条", async ({ expect }) => {
    await router.push("/path?id=1&name=amy");
    vi.advanceTimersByTime(20);
    await router.push({ path: "/path", query: { id: "1" } });
    vi.advanceTimersByTime(20);

    await nextTick();
    expectLength(expect, 1);
  });

  it("path：相同path，不同params，应该新增一条", async ({ expect }) => {
    await router.push("/pathWithParams/1");
    vi.advanceTimersByTime(20);
    await router.push({ name: "pathWithParams", params: { id: "2" } });
    vi.advanceTimersByTime(20);

    expectLength(expect, 2);
    expect(taborStore.state.activeTab).equal(taborStore.state.tabs.at(-1));
    expect(cache.state.activeKey).toEqual("/pathWithParams/2");
  });

  it("custom：相同query的id，应该同一条", async ({ expect }) => {
    await router.push("/custom?id=1&name=amy");
    vi.advanceTimersByTime(20);
    await router.push({ path: "/custom", query: { id: "1", name: "jean" } });
    vi.advanceTimersByTime(20);

    await nextTick();

    expectLength(expect, 1);
    expect(taborStore.state.activeTab?.id).toEqual("/custom?id=1");
    expect(cache.state.activeKey).toEqual("/custom?id=1");
  });

  it("custom：不同params的id，应该同一条", async ({ expect }) => {
    await router.push("/customWithParams/1");
    vi.advanceTimersByTime(20);
    await router.push({ name: "customWithParams", params: { id: 2 } });
    vi.advanceTimersByTime(20);

    await nextTick();
    expectLength(expect, 1);
    expect(taborStore.state.activeTab?.id).toEqual("/customWithParams");
    expect(cache.state.activeKey).toEqual("/customWithParams");
  });
});
