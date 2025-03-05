import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "KeepAliveRouter",
  setup() {
    const deactivatedCalled = ref(false);
    const unmountedCalled = ref(false);

    return { deactivatedCalled, unmountedCalled };
  },
  unmounted() {
    this.unmountedCalled = true;
  },
  deactivated() {
    this.deactivatedCalled = true;
  },
  activated() {
    this.deactivatedCalled = false;
  },
  render() {
    const router = useRouter();
    return router.currentRoute.value.fullPath;
  }
});
