import "./index.less";

import type { RouterTabStore } from "@tabor/store";
import { computed, defineComponent, inject, type PropType } from "vue";

import RtTab from "./tab";
import type { RouterTabProps, TabType } from "@tabor/types";
import { INITIAL_TAB_TYPE } from "@tabor/helper/utils/constants";

export default defineComponent({
  name: "RtTabs",
  props: {
    tabPrefix: {
      type: Object as PropType<RouterTabProps["tabPrefix"]>,
    },
  },
  setup(props) {
    const store = inject<RouterTabStore>("tabStore");
    const tabType = inject<TabType>("tabType") ?? INITIAL_TAB_TYPE;

    const tabs = computed(() => store?.state.tabs ?? []);
    const classNames = computed(() => ["rt-tabs", `rt-tabs--${tabType}`]);

    return () => (
      <div class={classNames.value}>
        {tabs.value.map((tab) => (
          <RtTab prefix={props.tabPrefix} {...tab} key={tab.id} />
        ))}
      </div>
    );
  },
});
