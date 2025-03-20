import "./index.less";

import InitialClose from "@tabor/components/ui/initial/icon/close";
import { TABOR_STORE_KEY, type TaborStore } from "@tabor/store";
import type { TabId } from "@tabor/types";
import { defineComponent, inject, type PropType } from "vue";

export default defineComponent({
  name: "TaborTabClose",
  props: {
    id: {
      type: String satisfies PropType<TabId>,
      required: true,
    },
  },
  setup(props) {
    const store = inject<TaborStore>(TABOR_STORE_KEY);

    const close = (e: MouseEvent) => {
      store?.close({ id: props.id });
      e.stopPropagation();
    };

    return () => (
      <div class="tabor-remove-icon" onClick={close}>
        <InitialClose />
      </div>
    );
  },
});
