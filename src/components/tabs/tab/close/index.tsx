import "./index.less";

import InitialClose from "@tabor/components/ui/initial/icon/close";
import type { RouterTabStore } from "@tabor/store";
import type { TabId } from "@tabor/types";
import { defineComponent, inject, type PropType } from "vue";

export default defineComponent({
  name: "RtTabClose",
  props: {
    id: {
      type: String satisfies PropType<TabId>,
      required: true,
    },
  },
  setup(props) {
    const store = inject<RouterTabStore>("tabStore");

    const close = (e: MouseEvent) => {
      store?.close({ id: props.id });
      e.stopPropagation();
    };

    return () => (
      <div class="remove-icon" onClick={close}>
        <InitialClose />
      </div>
    );
  },
});
