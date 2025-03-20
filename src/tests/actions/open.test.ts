// import type { TaborStore } from "@tabor/store";
// import { beforeEach, describe, it } from "vitest";

// import { beforeEachFn, sameLength } from "../unit";

// describe("test open api", async () => {
//   let taborStore: TaborStore;
//   let expectLength: ReturnType<typeof sameLength>;

//   beforeEach(async () => {
//     const item = await beforeEachFn();
//     taborStore = item.taborStore as TaborStore;
//     expectLength = sameLength(taborStore.cache, taborStore);
//   });

//   it("open a new router", async ({ expect }) => {
//     await taborStore.open("/initial?id=1&name=amy");
//     expect(taborStore.state.activeTab?.id).toEqual("/initial?id=1&name=amy");
//     await taborStore.open("/initial?id=2");
//     expect(taborStore.state.activeTab?.id).toEqual("/initial?id=2");
//   });

//   it("open a current tab", async ({ expect }) => {
//     await taborStore.open("/initial?id=1&name=amy");
//     await taborStore.open("/initial?id=2");

//     expect(taborStore.state.activeTab?.id).toEqual("/initial?id=2");

//     await taborStore.open("/initial?id=1&name=amy");
//     expectLength(expect, 2);
//     expect(taborStore.state.activeTab?.id).toEqual("/initial?id=1&name=amy");
//   });

//   it("replace a current tab", async ({ expect }) => {
//     await taborStore.open("/initial?id=1&name=amy");
//     await taborStore.open("/initial?id=2");

//     expect(taborStore.state.activeTab?.id).toEqual("/initial?id=2");

//     await taborStore.open("/initial?id=1&name=amy", { replace: true });
//     expectLength(expect, 2);
//     expect(taborStore.state.activeTab?.id).toEqual("/initial?id=1&name=amy");
//   });

//   it("open a current tab,but different query", async ({ expect }) => {
//     await taborStore.open("/initial?id=1&name=amy");
//     await taborStore.open("/path?id=2");

//     expect(taborStore.state.activeTab?.id).toEqual("/path");

//     await taborStore.open("/path?id=3", { replace: true });
//     expectLength(expect, 2);
//     expect(taborStore.state.activeTab?.id).toEqual("/path");
//   });
// });
