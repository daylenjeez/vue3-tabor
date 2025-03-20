import type { App, Plugin } from "vue";
import type { Router } from "vue-router";

import "./style/global.less";

import Tabor from "./tabor";
import { initTaborStore, type TaborStore, useTaborStore, TABOR_STORE_KEY } from "./store";
import type { TaborProps, Tab, TabConfig, TabType } from "./types";

/**
 * Plugin initialization options
 */
interface PluginOptions {
	router: Router;
	maxCache?: number;
}


/**
 * Init
 * @param {App} app
 * @param {PluginOptions} options
 */
const init = (app: App, options: PluginOptions) => {
	const { router } = options;
	const taborStore = initTaborStore(router, options);
	// Provide the store at the app level
	app.provide(TABOR_STORE_KEY, taborStore);
	app.config.globalProperties.$taborStore = taborStore;
};

const TaborPlugin: Plugin = {
	install(app: App, options: PluginOptions) {
		init(app, options);
		app.component("vue-tabor", Tabor);
	},
};

export type {
	Tab, TaborStore, TaborProps, TabType, PluginOptions, TabConfig
};

export { Tabor, useTaborStore };

export default TaborPlugin;
