import "./index.less";

import { TABOR_STORE_KEY, type TaborStore } from "@tabor/store";
import type { Tab, TaborProps, TabType } from "@tabor/types";
import DropdownMenu from "../dropdown/index.vue";
import {
  type Component,
  computed,
  defineComponent,
  inject,
  ref,
  type PropType,
  type VNode,
  h,
  withDirectives,
} from "vue";
import { Language } from "@tabor/utils/i18n";

import Close from "./close";
import Tablabel from "./label";
import clickOutside from "@tabor/directives/clickOutside";
import { RouteLocationNormalized } from "vue-router";

// create global shared state, used to track the current opened menu
const activeDropdownId = ref<string | null>(null);

export default defineComponent({
  name: "TaborTab",
  directives: {
    clickOutside, // Register the directive
  },
  props: {
    name: {
      type: [String, Symbol, Function] as PropType<Tab["name"]>,
      required: true,
    },
    id: {
      type: String satisfies PropType<Tab["id"]>,
      required: true,
    },
    hideClose: {
      type: Boolean satisfies PropType<TaborProps["hideClose"]>,
      default: false,
    },
    fullPath: {
      type: String satisfies PropType<Tab["fullPath"]>,
      required: true,
    },
    prefix: {
      type: [Object, Function] as PropType<
        Component | ((tab: Tab) => Component | VNode)
      >,
    },
  },
  setup(props) {
    const store = inject<TaborStore>(TABOR_STORE_KEY);
    const tabClass = inject<string>("tabClass");
    const tabType = inject<TabType>("tabType");
    const language = inject<Language>("language");
    const tabsLength = computed(() => store?.state.tabs.length ?? 0);
    const isActive = computed(() => store?.state.activeTab?.id === props.id);
    const tab = computed(() => store?.find(props.id));
    const showClose = computed(() => tabsLength.value > 1 && !tab.value?.hideClose && !props.hideClose);

    const name = computed(() => {
      if (typeof props.name === "function") {
        const route = store?.$router.resolve(props.fullPath);
        if (route) {
          return props.name(route as RouteLocationNormalized)
        } else {
          console.warn(`Route not found for fullPath: ${props.fullPath}`);
          return String(props.name);
        }
      }
      return props.name;
    });

    const dropdownVisible = ref(false);
    const dropdownPosition = ref({ x: 0, y: 0 });

    computed(() => {
      if (activeDropdownId.value !== props.id) {
        dropdownVisible.value = false;
      }
    });

    const classNames = computed(() => [
      "tabor-tab",
      `tabor-tab--${tabType}`,
      isActive.value && "tabor-tab-active",
    ]);

    const click = () => {
      activeDropdownId.value = null;

      if (isActive.value) return;
      const tab = store?.find(props.id);
      if (tab) store?.open(tab.fullPath);
    };

    const handleClickOutside = () => {
      dropdownVisible.value = false;
      activeDropdownId.value = null;
    };

    const handleRightClick = (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      // calculate the appropriate position, ensure the menu does not exceed the viewport
      let x = event.clientX;
      let y = event.clientY;

      // consider the menu width and the right boundary of the window, avoid the menu exceeding the right side of the window
      const menuWidth = 120; // estimated menu width
      if (x + menuWidth > window.innerWidth) {
        x = window.innerWidth - menuWidth - 5; // leave 5px margin
      }

      // consider the menu height and the bottom boundary of the window, avoid the menu exceeding the bottom side of the window
      const menuHeight = 110; // estimated menu height (adapted to the new spacing settings)
      if (y + menuHeight > window.innerHeight) {
        y = window.innerHeight - menuHeight - 5; // leave 5px margin
      }

      // update the menu position
      dropdownPosition.value = { x, y };
      dropdownVisible.value = true;

      // update the active dropdown menu ID
      activeDropdownId.value = props.id;
    };

    const handleDropdownAction = (action: string) => {
      dropdownVisible.value = false;
      activeDropdownId.value = null;

      const tab = store?.find(props.id);
      if (!tab) return;

      switch (action) {
        case "refresh":
          store?.refresh(props.id);
          break;
        case "close":
          store?.close(props.id);
          break;
        case "closeOthers": {
          store?.closeOthers(props.id);
          break;
        }
        default:
          break;
      }
    };

    const renderPrefix = () => {
      if (!props.prefix) return null;

      const tab = store?.find(props.id);
      if (!tab) return null;

      return h(props.prefix, { tab });
    };

    return () => {
      // create DropdownMenu, if visible, use withDirectives to process
      let dropdownMenu = null;
      if (dropdownVisible.value && activeDropdownId.value === props.id) {
        // calculate which operations need to be disabled
        const disabledActions: string[] = [];
        const hideActions: string[] = [];

        // if there is only one tab, disable the "close" operation
        if (tabsLength.value <= 1) {
          disabledActions.push("close");
        }

        if (tabsLength.value <= 1) {
          disabledActions.push("closeOthers");
        }

        if (props.hideClose) {
          hideActions.push("close");
          hideActions.push("closeOthers");
        }

        dropdownMenu = withDirectives(
          h(DropdownMenu, {
            visible: dropdownVisible.value,
            position: dropdownPosition.value,
            disabledActions: disabledActions,
            hideActions: hideActions,
            language: language,
            onAction: handleDropdownAction,
          }),
          [[clickOutside, handleClickOutside]]
        );
      }

      return (
        <div
          class={[...classNames.value, tabClass]}
          onClick={click}
          onContextmenu={handleRightClick}
        >
          {props.prefix && <div class="tabor-tab--prefix">{renderPrefix()}</div>}
          <Tablabel name={name.value} />
          {showClose.value && <Close id={props.id} />}
          {dropdownMenu}
        </div>
      );
    };
  },
});
