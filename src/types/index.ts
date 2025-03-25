import type { CSSProperties, IframeHTMLAttributes, Component } from "vue";
import type { RouteLocationNormalized } from "vue-router";
import type { Language } from '../utils/i18n';

export type TaborRoute = {
  path: string;
  fullPath: string;
  name?: string | symbol | ((route: RouteLocationNormalized) => string);
  routeName?: string;
  meta?: {
    tabConfig?: TabConfig;
  };
}

export type TabKey =
  | "path"
  | "fullPath"
  | ((route: RouteLocationNormalized) => string);

/**
 * Iframe HTML attributes that can be used in tabs
 */
export type IframeAttributes = Pick<
  IframeHTMLAttributes,
  "src" | "width" | "height" | "loading" | "name" | "marginheight"
>;

/**
 * Configuration for a tab
 * @interface TabConfig
 * @property {TabKey} key - Key for the tab
 * @property {string} name - Name for the tab
 * @property {boolean} keepAlive - Whether to keep the tab alive
 * @property {string} icon - Icon for the tab
 * @property {IframeAttributes} iframeAttributes - Iframe attributes for the tab
 */
export interface TabConfig {
  key?: TabKey;
  name?: string | ((route: RouteLocationNormalized) => string);
  keepAlive?: boolean;
  icon?: string;
  iframeAttributes?: IframeAttributes;
}

/**
 * Tab information
 */
export interface Tab {
  id: string;
  name: string | symbol | ((route: RouteLocationNormalized) => string);
  icon?: string;
  keepAlive?: boolean;
  fullPath: string;
  allowClose?: boolean;
  iframeAttributes?: IframeAttributes;
  routeName?: string;
}

export type TabId = Tab["id"];

/**
 * Tab with position index
 */
export interface TabWithIndex extends Tab {
  index: number;
}

/**
 * Options for navigating to a tab
 */
export interface ToOptions {
  id?: TabId;
  fullPath?: string;
}

/**
 * Ways to identify and get a tab
 */
export type TabGetter =
  | {
    id?: TabId;
    fullPath?: string;
  }
  | string;

export type TabType = "line" | "card";

/**
 * Tabor component props
 * @interface TaborProps
 * @property {number} maxAlive - Maximum number of cached tabs
 * @property {boolean} hideClose - Whether to hide close button
 * @property {Function} beforeClose - Hook called before closing a tab
 * @property {string} tabClass - CSS class for tabs
 * @property {string} pageClass - CSS class for pages
 * @property {string} dropdownClass - CSS class for dropdown
 * @property {TabType} tabType - Type of tab style
 * @property {boolean} draggable - Whether tabs can be dragged
 * @property {boolean} restore - Whether to restore tabs after refresh
 * @property {CustomCssVariables & CSSProperties} style - Custom styles
 * @property {Component | ((tab: Tab) => Component | VNode)} tabPrefix - Vue component or function returning component to use as tab prefix
 * @property {Language} language - The language to use for the UI
 */
export interface TaborProps {
  maxAlive: number;
  hideClose?: boolean;
  beforeClose?: (tab: Tab) => Promise<boolean>;
  tabClass?: string;
  pageClass?: string;
  dropdownClass?: string;
  tabType?: TabType;
  draggable?: boolean;
  restore?: boolean;
  style?: CustomCssVariables & CSSProperties;
  tabPrefix?: Component;
  language?: Language;
}

/**
 * Custom CSS variables for styling RouterTab
 */
export interface CustomCssVariables {
  "--tab-background-color"?: string;
  "--tab-color"?: string;
  "--tab-border-color"?: string;
  "--tab-border-radius"?: string;
}

/**
 * Configuration for right-click menu
 */
export type RightClickConfig = Record<string, unknown> | boolean;

/**
 * Supported UI frameworks
 */
export type Ui = "initial" | "elementPlus" | "ant" | "naviUi" | "tailWind";

/**
 * Props for opening a new tab
 */
export interface OpenProps {
  replace?: boolean;
  refresh?: boolean;
  tabConfig?: TabConfig;
}

declare module "vue" {
  export interface GlobalComponents {
    Tabor: typeof import("../tabor").default;
  }
}
