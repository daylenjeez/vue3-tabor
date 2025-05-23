import { beforeEach, describe, expect, it } from "vitest";
import type { Router } from "vue-router";

import Tabs from "../../components/tabs";
import type { TaborStore } from "../../store";
import { beforeEachFn, type getWrapper } from "../unit";

describe("check tabs", async () => {
  let router: Router;
  let taborStore: TaborStore;
  let wrapper: ReturnType<typeof getWrapper>;

  beforeEach(async () => {
    const item = await beforeEachFn();
    router = item.router;
    taborStore = item.taborStore;
    wrapper = item.wrapper;
  });

  it("should render tabs", () => expect(Tabs).toBeDefined());

  it("tab components 数量需跟 tabs 数量保持一致，且顺序一致，且activeId正确", async () => {
    await router.push("/initial");
    await router.push("/initial?id=1");
    await router.push("/path?id=1");
    await router.push("/path?id=1&name=1");
    await router.push("/fullpath?id=1");
    await router.push("/fullpath?id=3");

    const tabComponents = wrapper.findAllComponents({ name: "TaborTab" });

    const tabs = taborStore.state.tabs;

    //长度一致
    expect(tabComponents.length).equal(tabs.length).equal(6);
    //顺序一致
    tabComponents.forEach((tab, index) => {
      const tabLabel = tab.getComponent({ name: "TaborTabLabel" });
      expect(tabLabel.text()).toBe(tabs[index].name); //TODO:jsx
    });
    //activeId正确
    const hasActiveTab = wrapper
      .findAllComponents({ name: "TaborTab" })
      .some((tab) => {
        const classes = tab.classes();

        if (classes.some((item) => item === "tabor-tab-active")) {
          const tabLabel = tab.getComponent({ name: "TaborTabLabel" });
          return tabLabel.text() === taborStore.state.activeTab?.name;
        }
        return false;
      });

    expect(hasActiveTab).toBeTruthy();
  });
});
