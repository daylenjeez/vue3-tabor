import "./index.less";

import { TABOR_STORE_KEY, type TaborStore } from "@tabor/store";
import { computed, defineComponent, inject, type PropType } from "vue";

import Tab from "./tab";
import type { TaborProps, TabType } from "@tabor/types";

export default defineComponent({
  name: "Tabs",
  props: {
    tabPrefix: {
      type: Object as PropType<TaborProps["tabPrefix"]>,
    },
    hideClose: {
      type: Boolean satisfies PropType<TaborProps["hideClose"]>,
      default: false,
    },
  },
  setup(props) {
    const store = inject<TaborStore>(TABOR_STORE_KEY);
    const tabType = inject<TabType>("tabType");

    const tabs = computed(() => store?.state.tabs ?? []);
    const classNames = computed(() => ["tabor-tabs", `tabor-tabs--${tabType}`]);

    return () => (
      <div class={classNames.value}>
        {tabs.value.map((tab) => (
          <Tab prefix={props.tabPrefix} {...tab} key={tab.id} hideClose={props.hideClose} />
        ))}
      </div>
    );
  },
});
