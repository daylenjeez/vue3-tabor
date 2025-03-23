<template>
  <div class="tabor-pages"
       :class="pageClass">
    <router-view v-slot="{ Component }">
      <keep-alive :include="cachedKeys">
        <component :is="retrieveOrCacheComponent?.(Component)"
                   v-if="!refreshing"
                   :key="activeTabKey" />
      </keep-alive>
    </router-view>

    <Iframe />
  </div>
</template>
<script lang="ts">
import { TABOR_STORE_KEY, type TaborStore } from "@tabor/store";
import { computed, defineComponent, inject, onMounted } from "vue";
import Iframe from "./iframe";
import "./index.less";

export default defineComponent({
  name: "RtPages",
  components: {
    Iframe,
  },
  setup() {
    const taborStore = inject<TaborStore>(TABOR_STORE_KEY);
    const pageClass = inject<string>("pageClass");

    onMounted(() => {
      if (!taborStore) {
        console.error("[vue3-tabor]: taborStore not provided. Did you install the plugin correctly?");
      }
    });

    const activeTab = computed(() => taborStore?.state.activeTab);
    const activeTabKey = computed(() => activeTab.value?.id);
    const refreshing = computed(() => taborStore?.cache.state.refreshing);

    const cachedKeys = computed(() => {
      const keys = taborStore?.cache.keys.value;

      return activeTab.value?.keepAlive
        ? keys
        : keys?.filter((k) => k !== activeTabKey.value);
    });

    return {
      activeTabKey,
      cachedKeys,
      refreshing,
      pageClass,
      retrieveOrCacheComponent: taborStore?.retrieveOrCacheComponent,
    };
  },
});
</script>
@tabor/store
