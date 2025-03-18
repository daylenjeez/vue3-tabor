import { defineComponent, type PropType, provide } from "vue";
import Page from "./components/page/index.vue";
import Tabs from "./components/tabs";
import type { RouterTabProps } from "./types";
import { INITIAL_TAB_TYPE } from "./helper/utils/constants";
import { Language, setLanguage } from "./utils/i18n";
import LanguageSwitch from "./components/ui/LanguageSwitch.vue";

export default defineComponent({
  name: "vue-tabor",
  components: {
    Tabs,
    Page,
    LanguageSwitch,
  },
  props: {
    maxAlive: {
      type: Number satisfies PropType<RouterTabProps["maxAlive"]>,
      required: false,
      default: 10,
    },
    hideClose: {
      type: Boolean satisfies PropType<RouterTabProps["hideClose"]>,
      required: false,
      default: false,
    },
    tabClass: {
      type: String satisfies PropType<RouterTabProps["tabClass"]>,
    },
    pageClass: {
      type: String satisfies PropType<RouterTabProps["pageClass"]>,
    },
    dropdownClass: {
      type: String satisfies PropType<RouterTabProps["dropdownClass"]>,
    },
    tabType: {
      type: String as PropType<RouterTabProps["tabType"]>,
      default: INITIAL_TAB_TYPE,
    },
    tabPrefix: {
      type: Object as PropType<RouterTabProps["tabPrefix"]>,
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
    provide("tabType", props.tabType);
    provide("language", props.language);

    return () => (
      <div class="rt-container">
        {props.showLanguageSwitch && <LanguageSwitch />}
        <Tabs tabPrefix={props.tabPrefix} />
        <Page />
      </div>
    );
  },
});
