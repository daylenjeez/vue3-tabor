import { defineComponent, type PropType, provide } from "vue";
import Page from "./components/page/index.vue";
import Tabs from "./components/tabs";
import type { TaborProps } from "./types";
import { INITIAL_TAB_TYPE } from "./helper/utils/constants";
import { Language, setLanguage } from "./utils/i18n";

export default defineComponent({
  name: "vue-tabor",
  components: {
    Tabs,
    Page,
  },
  props: {
    maxAlive: {
      type: Number satisfies PropType<TaborProps["maxAlive"]>,
      required: false,
      default: 10,
    },
    hideClose: {
      type: Boolean satisfies PropType<TaborProps["hideClose"]>,
      required: false,
      default: false,
    },
    tabClass: {
      type: String satisfies PropType<TaborProps["tabClass"]>,
    },
    pageClass: {
      type: String satisfies PropType<TaborProps["pageClass"]>,
    },
    dropdownClass: {
      type: String satisfies PropType<TaborProps["dropdownClass"]>,
    },
    tabType: {
      type: String as PropType<TaborProps["tabType"]>,
      default: INITIAL_TAB_TYPE,
    },
    tabPrefix: {
      type: Object as PropType<TaborProps["tabPrefix"]>,
    },
    language: {
      type: String as PropType<Language>,
      default: "zh",
    },
    showLanguageSwitch: {
      type: Boolean,
      default: true,
    },
  },

  setup(props) {
    if (props.language) {
      setLanguage(props.language);
    }

    provide("dropdownClass", props.dropdownClass);
    provide("tabClass", props.tabClass);
    provide("pageClass", props.pageClass);
    provide("tabType", props.tabType ?? INITIAL_TAB_TYPE);
    provide("language", props.language ?? "zh");

    return () => (
      <div class="rt-container">
        <Tabs tabPrefix={props.tabPrefix} />
        <Page />
      </div>
    );
  },
});
