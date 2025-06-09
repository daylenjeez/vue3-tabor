<template>
  <div v-if="visible"
       class="tabor-dropdown-menu"
       :style="{ top: position.y + 'px', left: position.x + 'px' }"
       @contextmenu="handleRightClick">
    <ul>
      <li @click="handleAction('refresh')">
        <span>{{ translations.refresh }}</span>
      </li>
      <li v-if="!hideActions.includes('close')"
          @click="!disabledActions.includes('close') && handleAction('close')"
          :class="{ 'tabor-dropdown-item-disabled': disabledActions.includes('close') }">
        <span>{{ translations.close }}</span>
      </li>
      <li v-if="!hideActions.includes('closeOthers')"
          class="tabor-dropdown-divider"></li>
      <li v-if="!hideActions.includes('closeOthers')"
          @click="!disabledActions.includes('closeOthers') && handleAction('closeOthers')"
          :class="{ 'tabor-dropdown-item-disabled': disabledActions.includes('closeOthers') }">
        <span>{{ translations.closeOthers }}</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { t, getLanguage, Language, setLanguage } from '@tabor/utils/i18n';

export default defineComponent({
  name: 'DropdownMenu',
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    position: {
      type: Object as () => { x: number; y: number },
      required: true,
    },
    disabledActions: {
      type: Array as () => string[],
      default: () => []
    },
    hideActions: {
      type: Array as () => string[],
      default: () => []
    },
    language: {
      type: String as () => Language,
      default: 'zh'
    }
  },
  emits: ['action'],
  setup(props: any, { emit }: any) {
    // Set language based on props
    if (props.language && props.language !== getLanguage()) {
      setLanguage(props.language);
    }

    // Create translations object
    const translations = {
      refresh: t('refresh'),
      close: t('close'),
      closeOthers: t('closeOthers')
    };

    const handleAction = (action: string) => {
      if (props.disabledActions.includes(action)) {
        return;
      }
      emit('action', action);
    };

    const handleRightClick = (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
    };

    return {
      translations,
      handleAction,
      handleRightClick,
      hideActions: props.hideActions
    };
  },
});
</script>

<style scoped>
.tabor-dropdown-menu {
  position: fixed;
  background-color: var(--tab-active-background-color, white);
  border: 1px solid var(--tab-border-color, #e2e8f0);
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 9999;
  min-width: 100px;
  padding: 4px 0;
  font-size: 13px;
  overflow: visible;
  animation: fadeIn 0.15s ease-out;
}

.tabor-dropdown-menu ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.tabor-dropdown-menu li {
  padding: 6px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: var(--tab-text-color, #64748b);
  transition: all 0.15s ease;
  min-height: 20px;
  line-height: 1.4;
  border-radius: 3px;
  margin: 0 3px;
}

.tabor-dropdown-menu li.tabor-dropdown-item-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.tabor-dropdown-menu li:not(.tabor-dropdown-item-disabled):hover {
  background-color: rgba(90, 103, 216, 0.08);
  color: var(--primary-color);
}

.tabor-dropdown-icon {
  margin-right: 6px;
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 12px;
}

.tabor-dropdown-divider {
  height: 1px;
  margin: 3px 6px;
  overflow: hidden;
  background-color: var(--tab-border-color, #e2e8f0);
  padding: 0 !important;
  pointer-events: none;
  min-height: auto !important;
}

.tabor-dropdown-divider:hover {
  background-color: var(--tab-border-color, #e2e8f0) !important;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
