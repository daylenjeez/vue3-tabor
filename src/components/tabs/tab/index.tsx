import "./index.less";

import type { RouterTabStore } from "@tabor/store";
import type { Tab, TabType } from "@tabor/types";
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

// 创建全局共享状态，用于跟踪当前打开的菜单
const activeDropdownId = ref<string | null>(null);

export default defineComponent({
  name: "RtTab",
  directives: {
    clickOutside, // Register the directive
  },
  props: {
    name: {
      type: [String, Symbol] satisfies PropType<Tab["name"]>,
      required: true,
    },
    id: {
      type: String satisfies PropType<Tab["id"]>,
      required: true,
    },
    prefix: {
      type: [Object, Function] as PropType<
        Component | ((tab: Tab) => Component | VNode)
      >,
    },
  },
  setup(props) {
    const store = inject<RouterTabStore>("tabStore");
    const tabClass = inject<string>("tabClass");
    const tabType = inject<TabType>("tabType") ?? "line";
    const language = inject<Language>("language") ?? "zh";
    const tabsLength = computed(() => store?.state.tabs.length ?? 0);
    const isActive = computed(() => store?.state.activeTab?.id === props.id);
    const showClose = computed(() => tabsLength.value > 1);

    const dropdownVisible = ref(false);
    const dropdownPosition = ref({ x: 0, y: 0 });

    computed(() => {
      if (activeDropdownId.value !== props.id) {
        dropdownVisible.value = false;
      }
    });

    const classNames = computed(() => [
      "rt-tab",
      `rt-tab--${tabType}`,
      isActive.value && "rt-tab-active",
    ]);

    const click = () => {
      // 点击任何标签时，关闭所有下拉菜单
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

      // 计算合适的位置，确保菜单不会超出视窗
      let x = event.clientX;
      let y = event.clientY;

      // 考虑菜单宽度和窗口右边界，避免菜单超出窗口右侧
      const menuWidth = 120; // 估计菜单宽度
      if (x + menuWidth > window.innerWidth) {
        x = window.innerWidth - menuWidth - 5; // 留5px边距
      }

      // 考虑菜单高度和窗口下边界，避免菜单超出窗口底部
      const menuHeight = 110; // 估计菜单高度（适应新的间距设置）
      if (y + menuHeight > window.innerHeight) {
        y = window.innerHeight - menuHeight - 5; // 留5px边距
      }

      // 更新菜单位置
      dropdownPosition.value = { x, y };
      dropdownVisible.value = true;

      // 更新激活的下拉菜单ID
      activeDropdownId.value = props.id;

      console.log("Right clicked, menu position:", dropdownPosition.value);
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
          console.log(`未处理的操作: ${action}`);
      }
    };

    const renderPrefix = () => {
      if (!props.prefix) return null;

      const tab = store?.find(props.id);
      if (!tab) return null;

      return h(props.prefix, { tab });
    };

    return () => {
      // 创建DropdownMenu，如果可见则用withDirectives处理
      let dropdownMenu = null;
      if (dropdownVisible.value && activeDropdownId.value === props.id) {
        // 计算哪些操作需要禁用
        const disabledActions: string[] = [];

        // 如果只有一个标签页，禁用"关闭"操作
        if (tabsLength.value <= 1) {
          disabledActions.push("close");
        }

        if (tabsLength.value <= 1) {
          disabledActions.push("closeOthers");
        }

        dropdownMenu = withDirectives(
          h(DropdownMenu, {
            visible: dropdownVisible.value,
            position: dropdownPosition.value,
            disabledActions: disabledActions,
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
          {props.prefix && <div class="rt-tab--prefix">{renderPrefix()}</div>}
          <Tablabel name={props.name} />
          {showClose.value && <Close id={props.id} />}
          {dropdownMenu}
        </div>
      );
    };
  },
});
