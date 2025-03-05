<template>
  <div class="rt-pages"
       :class="pageClass">
    <router-view v-slot="{ Component }">
      <keep-alive :include="cachedKeys">
        <component :is="retrieveOrCacheComponent?.(Component)"
                   v-if="!refreshing"
                   :key="activeTabKey" />
      </keep-alive>
    </router-view>

    <RtIframe />
  </div>
</template>
<script lang="ts">
import type { RouterTabStore } from "@routerTab/store";
import { computed, defineComponent, inject, onMounted } from "vue";
import RtIframe from "./iframe";
import "./index.less";

export default defineComponent({
  name: "RtPages",
  components: {
    RtIframe,
  },
  setup() {
    const tabStore = inject<RouterTabStore>("tabStore");
    const pageClass = inject<string>("pageClass");

    onMounted(() => {
      if (!tabStore) {
        console.error("RouterTab: tabStore not provided. Did you install the plugin correctly?");
      }
    });

    const activeTab = computed(() => tabStore?.state.activeTab);
    const activeTabKey = computed(() => activeTab.value?.id);
    const refreshing = computed(() => tabStore?.cache.state.refreshing);

    const cachedKeys = computed(() => {
      const keys = tabStore?.cache.keys.value;

      return activeTab.value?.keepAlive
        ? keys
        : keys?.filter((k) => k !== activeTabKey.value);
    });

    return {
      activeTabKey,
      cachedKeys,
      refreshing,
      pageClass,
      retrieveOrCacheComponent: tabStore?.retrieveOrCacheComponent,
    };
  },
});
</script>
@routerTab/store
