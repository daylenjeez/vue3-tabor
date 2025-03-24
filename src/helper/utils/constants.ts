import { TabConfig } from "@tabor/types";

export const INITIAL_TAB_CONFIG = {
  key: 'fullPath' as const,
  keepAlive: true,
} satisfies TabConfig;


export const INITIAL_TAB_TYPE = "line" as const;
