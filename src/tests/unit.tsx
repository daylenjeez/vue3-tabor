import { mount } from "@vue/test-utils";
import type { ExpectStatic } from "vitest";
import {
  createMemoryHistory,
  createRouter,
  type RouteLocationNormalized,
  type Router,
} from "vue-router";

import RouterTabPlugin from "..";
import { type RouterTabStore, useTabStore } from "../store";
import type { Cache } from "../store/cache";

export const getRouter = () =>
  createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: "/", component: () => import("./pages/home"), name: "home" },
      {
        path: "/initial",
        component: () => import("./pages/initial"),
        name: "initial",
      },
      {
        path: "/path",
        component: () => import("./pages/path"),
        name: "path",
        meta: { tabConfig: { key: "path" } },
      },
      {
        path: "/pathWithParams/:id",
        component: () => import("./pages/pathWithParams"),
        name: "pathWithParams",
        meta: { tabConfig: { key: "path" } },
      },
      {
        path: "/fullpath",
        component: () => import("./pages/fullpath"),
        name: "fullpath",
        meta: { tabConfig: { key: "fullPath" } },
      },
      {
        path: "/fullpathWithParams/:id",
        component: () => import("./pages/fullpathWithParams"),
        name: "fullpathWithParams",
        meta: { tabConfig: { key: "fullPath" } },
      },
      {
        path: "/custom",
        component: () => import("./pages/custom"),
        name: "custom",
        meta: {
          tabConfig: {
            key: (router: RouteLocationNormalized) => {
              const { path, query } = router;
              return `${path}?id=${query.id}`;
            },
          },
        },
      },
      {
        path: "/customWithParams/:id",
        component: () => import("./pages/customWithParams"),
        name: "customWithParams",
        meta: {
          tabConfig: {
            key: () => {
              return "/customWithParams";
            },
          },
        },
      },
      {
        path: "/noKeepAlivePath",
        component: () => import("./pages/noKeepAlive"),
        name: "noKeepAlive",
        meta: { tabConfig: { keepAlive: false } },
      },
      {
        path: "/keepAlivePath",
        component: () => import("./pages/keepAlive"),
        name: "keepAlive",
      },
    ],
  });

export const getWrapper = (router: Router) =>
  mount(
    {
      render() {
        return (
          <div>
            <vue-tabor />
          </div>
        );
      },
    },
    { global: { plugins: [router, [RouterTabPlugin, { router }]] } },
  );

export const beforeEachFn = async () => {
  const router = getRouter();
  const wrapper = await getWrapper(router);
  const routerTab = useTabStore(router);

  return {
    router,
    wrapper,
    routerTab,
  };
};

export const sameLength = (cache: Cache, routerTab: RouterTabStore) => {
  return (expect: ExpectStatic, length: number) => {
    expect(cache.keys.value).length(length + 1); //router会默认加个{path:'/'}
    expect(routerTab.state.tabs.length).toBe(length + 1);
  };
};
