import type { App, Plugin } from "vue";
import type { RouteLocationNormalized, Router } from "vue-router";

import "./style/global.less";

import Tabor from "./tabor";
import { initTaborStore, type TaborStore, useTaborStore } from "./store";
import type { RouterTabProps, Tab, TabConfig, TabType } from "./types";

/**
 * Plugin initialization options
 */
interface PluginOptions {
	router: Router;
	maxCache?: number;
}

/**
 * Update the tab when the route changes
 * @param {RouteLocationNormalized} guard
 * @param {RouterTabStore} store
 */
export const updateTabOnRouteChange = (
	guard: RouteLocationNormalized,
	store: TaborStore,
) => {
	const tabId = store.getTabIdByRoute(guard);

	if (tabId && store.has(tabId)) {
		const tab = store.find(tabId);
		if (tab) store.setActive(tab);
	} else {
		const tab = store.createTab(guard);
		if (tab) store.addTab(tab, { setActive: true });
	}
};

/**
 * Init
 * @param {App} app
 * @param {PluginOptions} options
 */
const init = (app: App, options: PluginOptions) => {
	const { router } = options;
	const tabStore = initTaborStore(router, options);
	app.config.globalProperties.$tabStore = tabStore;
};

const TaborPlugin: Plugin = {
	install(app: App, options: PluginOptions) {
		init(app, options);
		app.component("vue-tabor", Tabor);
	},
};

export type {
	Tab, TaborStore, RouterTabProps, TabType, PluginOptions, TabConfig
};

export { Tabor, useTaborStore };

export default TaborPlugin;
