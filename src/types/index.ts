import type { CSSProperties, IframeHTMLAttributes, Component } from "vue";
import type { RouteLocationNormalized } from "vue-router";

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
 */
export interface TabConfig {
  key?: TabKey;
  name?: string;
  keepAlive?: boolean;
  icon?: string;
  iframeAttributes?: IframeAttributes;
}

/**
 * Tab information
 */
export interface Tab {
  id: string;
  name: string | symbol;
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
 * RouterTab component props
 * @interface RouterTabProps
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
 */
export interface RouterTabProps {
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
