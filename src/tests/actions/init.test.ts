import type { TaborStore } from "@tabor/store";
import { beforeEach, describe, expectTypeOf, it } from "vitest";

import type { Tab } from "../../types";
import { beforeEachFn } from "../unit";

describe("init", () => {
  let taborStore: TaborStore;

  beforeEach(async () => {
    const item = await beforeEachFn();
    taborStore = item.taborStore as TaborStore;
  });

  it("vue-tabor is defined", ({ expect }) => {
    expect(taborStore).toBeDefined();
  });

  it("should have 'tabs' property of type Tab[] in useRouterTab", () => {
    expectTypeOf(taborStore.state.tabs).toEqualTypeOf<Tab[]>();
  });

  // it("should have 'close' property of type Close in useRouterTab", () => {
  //   expectTypeOf(routerTab.close).toEqualTypeOf<Close>();
  // });

  // it("should have 'closeOthers' property of type CloseOthers in useRouterTab", () => {
  //   expectTypeOf(routerTab.closeOthers).toEqualTypeOf<CloseOthers>();
  // });

  // it("should have 'open' property of type Open in useRouterTab", () => {
  //   expectTypeOf(routerTab.open).toEqualTypeOf<Open>();
  // });
});
