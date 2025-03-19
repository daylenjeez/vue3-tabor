import { createTab, createTabId } from "@tabor/helper/utils";
import { INITIAL_TAB_CONFIG } from "@tabor/helper/utils/constants";
import type {
  OpenProps,
  Tab,
  TabConfig,
  TabGetter,
  TabId,
  ToOptions,
} from "@tabor/types";
import {
  isString,
  renameComponentType,
  throwError,
  withPostAction,
} from "@tabor/utils";
import { computed, inject, InjectionKey, provide, reactive, type VNode } from "vue";
import type {
  RouteLocationNormalizedLoaded,
  RouteLocationRaw,
  Router,
} from "vue-router";

import { useCache } from "./cache";
import Page from "../components/page/index.vue";

const TABOR_STORE_KEY = Symbol('tabor-store') satisfies InjectionKey<ReturnType<typeof createTaborStore>>;

interface TabStoreOptions {
  maxCache?: number;
}

// change storage key
const IFRAME_ROUTE_STORAGE_KEY = 'tabor-iframe-route';

// modify interface to simplify structure
interface StoredIframeRoute {
  path: string;
  name: string;
  meta: {
    tabConfig: TabConfig;
    routeName: string;
  };
}

/**
 * create tab store
 * @param router 
 * @param options 
 * @returns Tabor Store
 */
export const createTaborStore = (router: Router, options: TabStoreOptions = {}) => {
  const { maxCache = 10 } = options;

  const state = reactive<{
    tabs: Tab[];
    activeTab?: Tab;
    shouldClose: boolean;
  }>({ tabs: [], activeTab: void 0, shouldClose: true });

  const currentTab = computed(() => state.activeTab);
  const currentTabId = computed(() => state.activeTab?.id);
  const iframeTabs = computed(() => state.tabs.filter((tab) => tab.iframeAttributes));

  const cache = useCache({ max: maxCache });


  /**
   * get tab index by tabId
   * @param {TabId} tabId
   * @returns {number} index
   */
  const indexOf = (tabId: TabId) => {
    const index = state.tabs.findIndex(({ id }) => id === tabId);
    if (index < 0)
      throwError(`Tab not found, please check the tab id: ${tabId}`);
    return index;
  };

  /**
   * has tab by tabId
   * @param {TabId} tabId
   * @returns {boolean} hasTab
   */
  const has = (tabId?: TabId) => state.tabs.some(({ id }) => id === tabId);

  /**
   * find tab by tabId
   * @param {TabId} tabId - The ID of the tab to retrieve.
   * @returns {Tab | undefined} The found tab or undefined.
   */
  const find = (tabId: TabId) => state.tabs.find(({ id }) => id === tabId);

  /**
   * modify tab by tabId
   * @param {TabId} tabId
   * @param {Tab} tab
   * @returns {Tab | undefined} tab
   */
  const modify = (tabId: TabId, tab: Tab) => {
    const index = indexOf(tabId);
    if (index < 0)
      return throwError(`Tab not found, please check the tab id: ${tabId}`);
    state.tabs[index] = tab;
    return tab;
  };

  /**
   * get tabId by fullpath
   * @param {string} fullPath
   * @returns {Tab | undefined} tab
   */
  const getTabByFullpath = (fullPath: string) =>
    state.tabs.find((tab) => tab.fullPath === fullPath);

  /**
   * set active tab
   * @param {Tab} tab
   * @returns {Tab|undefined}
   */
  const setActive = (tab: Tab) => {
    if (!tab) return throwError(`Tab not found, please check the tab: ${tab}`);
    state.activeTab = tab;
    cache.setActiveKey(tab.id);
    return tab;
  };

  /**
   * add tab
   * @param {Tab} tab
   * @param {{ setActive?: boolean }} options //TODO: add options
   * @returns {Number}
   */
  const addTab = (tab: Tab, options?: { setActive?: boolean }) => {
    const index = state.tabs.push(tab);
    cache.add(tab.id);

    if (options?.setActive) setActive(tab);
    return index;
  };

  /**
   * remove tab by index
   * @param {number} index
   * @returns {Tab | undefined}
   */
  const removeTabByIndex = (index: number) => {
    if (index < 0)
      return throwError(
        `Index is less than 0, please check the index: ${index}`,
      );
    return state.tabs.splice(index, 1)[0];
  };

  /**
   * remove tab and cache
   * @param {TabId} tabId
   * @returns {TabWithIndex | undefined} tab
   */
  const removeTabById = (tabId: TabId) => {
    const index = indexOf(tabId);
    if (index < 0) return void 0;

    const removedTab = removeTabByIndex(index);

    cache.remove(tabId);

    if (removedTab?.iframeAttributes && removedTab.routeName) {
      router.removeRoute(removedTab.routeName);
    }

    return removedTab ? { ...removedTab, index } : void 0;
  };

  /**
   * router push
   * @param {RouteLocationRaw} to
   * @returns {Promise<RouteLocationNormalized>}
   */
  const routerPush = async (to: RouteLocationRaw) => router.push(to);

  /**
   * router replace
   * @param {RouteLocationRaw} to
   * @returns {Promise<RouteLocationNormalized>} route
   */
  const routerReplace = (to: RouteLocationRaw) => router.replace(to);

  /**
   * refresh tab
   * @param {TabId} tabId
   */
  const refresh = (tabId?: TabId) => {
    if (!tabId) return;
    const tab = find(tabId);
    if (!tab)
      return throwError(`Tab not found, please check the tab id: ${tabId}`);
    cache.refresh(tabId);
  };

  /**
   * save iframe route to localStorage
   * @param {StoredIframeRoute} route - route to save
   */
  const saveIframeRoute = (route: StoredIframeRoute) => {
    try {
      // replace existing storage
      localStorage.setItem(IFRAME_ROUTE_STORAGE_KEY, JSON.stringify(route));
    } catch (error) {
      console.error('Failed to save iframe route to localStorage:', error);
    }
  };

  /**
   * check if route exists
   */
  const doesRouteExist = (to: RouteLocationRaw) => {
    // use router.resolve to resolve route
    const resolvedRoute = router.resolve(to);

    // check if matched route exists
    return resolvedRoute.matched.length > 0;
  };

  /**
   * restore iframe route from localStorage
   */
  const restoreIframeRoute = () => {
    try {
      const storedRoute = localStorage.getItem(IFRAME_ROUTE_STORAGE_KEY);
      if (!storedRoute) return;

      const route: StoredIframeRoute = JSON.parse(storedRoute);

      // check if route exists
      const doesExist = doesRouteExist({ path: route.path });
      if (!doesExist) {
        // add route
        router.addRoute({
          path: route.path,
          name: route.name,
          meta: route.meta,
          component: Page,
        });
      }
    } catch (error) {
      console.error('Failed to restore iframe route from localStorage:', error);
    }
  };


  // use router guard to ensure iframe route is restored before route parsing
  let routeRestored = false;
  router.beforeEach((to, _, next) => {
    // restore route only on the first navigation
    if (!routeRestored) {
      restoreIframeRoute();
      routeRestored = true;

      // if the current route is the same as the restored iframe route, need to parse again
      const storedRoute = localStorage.getItem(IFRAME_ROUTE_STORAGE_KEY);
      if (storedRoute) {
        try {
          const route: StoredIframeRoute = JSON.parse(storedRoute);
          if (to.path === route.path) {
            // navigate to the current URL again to parse the newly added route
            next({ path: to.fullPath, replace: true });
            return;
          }
        } catch (e) {
          console.error('Error parsing stored route:', e);
        }
      }
    }
    next();
  });

  /**
   * @param {RouteLocationRaw} to
   * @param {Options} options
   * @returns {Promise<RouteLocationNormalized>} route
   */
  const open = async (
    to: RouteLocationRaw,
    options: OpenProps = {
      replace: false,
      refresh: false,
    },
  ) => {
    const { replace, tabConfig } = options;

    const routeExist = doesRouteExist(to);

    if (!routeExist && tabConfig?.iframeAttributes) {
      const path = typeof to === "string" ? to : to.path;
      if (!path)
        return throwError(`Path not found, please check the path: ${to}`);
      const name = `rt-iframe-${path.replace(/\//g, '-')}`;

      const route = {
        path: path,
        name,
        meta: {
          tabConfig,
          routeName: name,
        },
        component: Page,
      };

      // add route dynamically
      router.addRoute(route);

      // save iframe route to localStorage, each time a new route is added, it will replace the old one
      saveIframeRoute({
        path: path,
        name,
        meta: {
          tabConfig,
          routeName: name,
        }
      });
    }

    if (replace) return routerReplace(to);
    const route = await routerPush(to);


    if (options.refresh && route) {
      const tabId = getTabIdByRoute(route.to);
      if (tabId) refresh(tabId);
    }
    return route;
  };

  /**
   * open tab by tab id
   * @param {TabId} tabId
   * @returns {ReturnType<RouterPush>| undefined}
   */
  const openTabById = (tabId: TabId) => {
    const tab = find(tabId);
    if (!tab)
      return throwError(`Tab not found, please check the tab id: ${tabId}`);
    return routerPush(tab.fullPath);
  };

  /**
   * open near tab
   * @param {{index:number}} removedTab
   * @returns {ReturnType<RouterPush>| undefined}
   */
  const openNearTab = async (removedTab: { index: number }) => {
    const { index: afterIndex } = removedTab;

    const afterTab =
      state.tabs[afterIndex] ?? state.tabs[afterIndex - 1] ?? void 0;

    if (afterTab) await open(afterTab.fullPath);
  };

  /**
   * get tabId by route
   * @param {RouteLocationNormalizedLoaded} route
   * @returns {TabId} tabId
   */
  const getTabIdByRoute = (route: RouteLocationNormalizedLoaded) => {
    const key =
      (route.meta?.tabConfig as TabConfig)?.key ?? INITIAL_TAB_CONFIG.key;
    const tabId = createTabId(key, route);
    return tabId;
  };

  /**
   * get tabId by remove item
   * @param {TabGetter} item
   * @returns {TabId | undefined}
   */
  const getTabIdByRemoveItem = (item: TabGetter) => {
    let tabId: TabId | undefined;
    const tabGetter = typeof item === "string" ? { fullPath: item } : item;

    if ("id" in tabGetter) tabId = tabGetter.id;
    if ("fullPath" in tabGetter)
      tabId = tabGetter.fullPath
        ? getTabByFullpath(tabGetter.fullPath)?.id
        : void 0;

    if (!tabId)
      return throwError(`Tab not found, please check the param: ${item}`);
    return tabId;
  };

  /**
   * remove tab,The last tab cannot be closed
   * @param {{ id?: TabId; fullPath?: string }} item tabId or route
   * @returns {TabWithIndex  | undefined}
   */
  const remove = (item: { id?: TabId; fullPath?: string }) => {
    const tabId = getTabIdByRemoveItem(item);
    if (!tabId) return void 0;
    if (state.tabs.length === 1 && state.tabs[0].id === tabId) {
      return throwError(`The last tab cannot be closed：${item}`);
    }
    return removeTabById(tabId);
  };

  /**
   * clear tabs
   **/
  const clear = withPostAction(
    () => {
      state.tabs = [];
    },
    () => {
      cache.reset();
    },
  );

  /**
   * get remove item
   * @param {TabGetter|undefined} item tabId or fullpath
   * @returns { id?: TabId, fullPath?: string }
   */
  const getRemoveItem = (item?: TabGetter) => {
    if (!item && !state.activeTab?.id) return void 0;
    const _item = isString(item) ? { fullPath: item } : item;
    return _item ? _item : { id: state.activeTab?.id };
  };

  /**
   * set should close
   * @param val boolean
   */
  const setShouldClose = (val: boolean) => {
    state.shouldClose = val;
  };

  /**
   * close tab and after tab
   * @param {TabGetter|undefined} item tabId or fullpath
   * @param {ToOptions} toOptions
   * @returns {TabWithIndex | undefined}
   */
  const close = async (item?: TabGetter, toOptions?: ToOptions) => {
    if (!state.shouldClose) return;
    const _item = getRemoveItem(item);
    if (!_item) return void 0;
    const removedTab = remove(_item);

    if (toOptions && (toOptions.id || toOptions.fullPath)) {
      const { id, fullPath } = toOptions;
      if (id === item)
        return throwError(
          "The id of the tab to be closed cannot be the same as the id of the tab to be opened,if you want to open the tab, please use the fullPath parameter.",
        );
      const _fullPath = id ? find(id)?.fullPath : fullPath;

      if (!_fullPath)
        return throwError(
          `The fullPath of the tab to be opened is not found, please check ${id ? id : fullPath}.`,
        );

      await routerPush(_fullPath);
      return removedTab;
    }

    if (removedTab && removedTab.id === state.activeTab?.id)
      await openNearTab(removedTab);

    return removedTab;
  };

  /**
   * close others tabs
   * @param {TabId} currentTabId
   */
  const closeOthers = (tabId?: TabId) => {
    if (!tabId && !state.activeTab?.id) return;
    const _tabId = tabId ?? state.activeTab?.id;

    if (!has(_tabId)) return;
    for (const item of [...state.tabs]) {
      if (item.id !== _tabId) removeTabById(item.id);
    }


    if (!_tabId) return;

    const afterActiveTab = find(_tabId);

    if (afterActiveTab) setActive(afterActiveTab);
  };

  const retrieveOrCacheComponent = (Component: VNode) => {
    const key = currentTabId.value;

    if (!Component || !key) return Component;

    if (cache.hasComponent(key)) return cache.getComponent(key);

    if (currentTab.value?.iframeAttributes) return void 0;

    if (currentTab.value?.keepAlive) {
      const renamedComponent = renameComponentType(Component, key);
      cache.addComponent(key, renamedComponent);
      cache.add(key);
      return cache.getComponent(key);
    }
    return Component;
  };

  router.afterEach((to) => {
    const tabId = getTabIdByRoute(to);

    if (!tabId || !has(tabId)) {
      const tab = createTab(to);
      if (tab) addTab(tab, { setActive: true });
      return;
    }

    const tab = find(tabId);

    if (!tab)
      return throwError(`Tab not found, please check the tab id: ${tabId}`);

    // there may be a situation where the tabId is the same but the fullPath is different, in this case, the page needs to be refreshed (to avoid keepalive)
    const fullPathIsSame = to.fullPath === tab.fullPath;

    const newTab = fullPathIsSame
      ? tab
      : modify(tabId, { ...tab, fullPath: to.fullPath }) ?? tab;

    setActive(newTab);
    if (!fullPathIsSame) refresh(tabId);
  });

  return {
    $router: router,
    state,
    createTab,
    indexOf,
    find,
    getTabByFullpath,
    getTabIdByRoute,
    setActive,
    addTab,
    removeTabByIndex,
    removeTabById,
    routerPush,
    routerReplace,
    openTabById,
    openNearTab,
    remove,
    refresh,
    clear,
    getRemoveItem,
    setShouldClose,

    currentTab,
    currentTabId,
    open,
    close,
    closeOthers,
    has,
    retrieveOrCacheComponent,
    cache,
    iframeTabs
  };
};

/**
 * Tabor Store
 */
export type TaborStore = ReturnType<typeof createTaborStore>;

/**
 * initialize tabor store
 * @param router 
 * @param options 
 * @returns Tabor Store
 */
export const initTaborStore = (router: Router, options: TabStoreOptions = {}) => {
  const store = createTaborStore(router, options);
  provide(TABOR_STORE_KEY, store);
  return store;
};

/**
 * use tabor store in setup
 * @returns Tabor Store
 */
export const useTaborStore = () => {
  const store = inject<TaborStore>(TABOR_STORE_KEY);
  if (!store) throwError('Tabor store not found');
  return store;
};
