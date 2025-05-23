import "./index.less";

import type { Tab } from "@tabor/types";
import { defineComponent, type PropType } from "vue";

export default defineComponent({
  name: "TaborTabLabel",
  props: {
    name: {
      type: [String, Symbol] satisfies PropType<Tab["name"]>,
      required: false,
      default: void 0,
    },
  },
  setup(props) {
    return () => (
      <div class="tabor-tab-label">
        <span>{props.name}</span>
      </div>
    );
  },
});
