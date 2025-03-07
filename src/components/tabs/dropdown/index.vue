<template>
  <div v-if="visible"
       class="rt-dropdown-menu"
       :style="{ top: position.y + 'px', left: position.x + 'px' }"
       @contextmenu="handleRightClick">
    <ul>
      <li @click="handleAction('refresh')">
        <span>刷新</span>
      </li>
      <li @click="!disabledActions.includes('close') && handleAction('close')"
          :class="{ 'rt-dropdown-item-disabled': disabledActions.includes('close') }">
        <span>关闭</span>
      </li>
      <li class="rt-dropdown-divider"></li>
      <li @click="!disabledActions.includes('closeOthers') && handleAction('closeOthers')"
          :class="{ 'rt-dropdown-item-disabled': disabledActions.includes('closeOthers') }">
        <span>关闭其他</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

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
    }
  },
  emits: ['action'],
  setup(props, { emit }) {
    const handleAction = (action: string) => {
      // 如果该操作被禁用，则不触发事件
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
      handleAction,
      handleRightClick
    };
  },
});
</script>

<style scoped>
.rt-dropdown-menu {
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

.rt-dropdown-menu ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.rt-dropdown-menu li {
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

.rt-dropdown-menu li.rt-dropdown-item-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.rt-dropdown-menu li:not(.rt-dropdown-item-disabled):hover {
  background-color: rgba(90, 103, 216, 0.08);
  color: var(--primary-color);
}

.rt-dropdown-icon {
  margin-right: 6px;
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 12px;
}

.rt-dropdown-divider {
  height: 1px;
  margin: 3px 6px;
  overflow: hidden;
  background-color: var(--tab-border-color, #e2e8f0);
  padding: 0 !important;
  pointer-events: none;
  min-height: auto !important;
}

.rt-dropdown-divider:hover {
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
