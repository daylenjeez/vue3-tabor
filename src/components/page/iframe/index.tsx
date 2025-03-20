import { TABOR_STORE_KEY, type TaborStore } from "@tabor/store";
import {
  computed,
  defineComponent,
  inject,
} from "vue";

export default defineComponent({
  name: "Iframe",

  setup() {
    const taborStore = inject<TaborStore>(TABOR_STORE_KEY);

    const iframes = computed(() => taborStore?.iframeTabs.value);

    return () => (
      <div class="tabor-iframe-container">
        {iframes.value?.map((iframe) => {
          const activeTabId = taborStore?.state.activeTab?.id;
          const shouldKeep = iframe.id === activeTabId || iframe.keepAlive;

          const shouldShow = iframe.id === activeTabId;

          return shouldKeep ? (
            <iframe
              key={iframe.id}
              v-show={shouldShow}
              width="100%"
              height="100%"
              {...iframe.iframeAttributes}
            />
          ) : null;
        })}
      </div>
    );
  },
});
