import type { RouterTabStore } from "@tabor/store";
import {
  computed,
  defineComponent,
  inject,
} from "vue";

export default defineComponent({
  name: "RtIframe",

  setup() {
    const tabStore = inject<RouterTabStore>("tabStore");

    const iframes = computed(() => tabStore?.iframeTabs.value);
    //TODO: 需要考虑iframe刷新

    return () => (
      <div class="rt-iframe-container">
        {iframes.value?.map((iframe) => {
          const activeTabId = tabStore?.state.activeTab?.id;
          // 条件 1：是否需要保留组件 (活跃 或 keepAlive)
          const shouldKeep = iframe.id === activeTabId || iframe.keepAlive;

          // 条件 2：是否当前活跃需要显示
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
