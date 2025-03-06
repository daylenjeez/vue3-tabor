import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import { defineComponent, h, provide } from 'vue';
import Tab from '@tabor/components/tabs/tab/index';
import { RouterTabStore } from '@tabor/store';

// 创建一个模拟的RouterTabStore
const createMockStore = () => {
  const mockStore: {
    state: {
      tabs: Array<{ id: string; name: string; fullPath: string }>;
      activeTab: { id: string; name: string; fullPath: string };
    };
    find: (id: string) => { id: string; name: string; fullPath: string } | undefined;
    open: ReturnType<typeof vi.fn>;
    close: ReturnType<typeof vi.fn>;
    closeOthers: ReturnType<typeof vi.fn>;
    refresh: ReturnType<typeof vi.fn>;
  } = {
    state: {
      tabs: [
        { id: 'tab1', name: 'Tab 1', fullPath: '/tab1' },
        { id: 'tab2', name: 'Tab 2', fullPath: '/tab2' }
      ],
      activeTab: { id: 'tab1', name: 'Tab 1', fullPath: '/tab1' }
    },
    find: vi.fn((id) => mockStore.state.tabs.find(tab => tab.id === id)),
    open: vi.fn(),
    close: vi.fn(),
    closeOthers: vi.fn(),
    refresh: vi.fn()
  };

  return mockStore as unknown as RouterTabStore;
};

// 创建一个包装组件，提供必要的依赖
const TabWrapper = defineComponent({
  props: {
    tabId: {
      type: String,
      required: true
    },
    tabName: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const store = createMockStore();
    provide('tabStore', store);
    provide('tabClass', 'custom-tab-class');
    provide('tabType', 'line');

    // 暴露store以便测试
    return () => {
      return h('div', { class: 'tab-wrapper' }, [
        h(Tab, {
          id: props.tabId,
          name: props.tabName
        })
      ]);
    };
  }
});

describe('Tab Component', () => {
  it('should render correctly with provided props', () => {
    const wrapper = mount(TabWrapper, {
      props: {
        tabId: 'tab1',
        tabName: 'Tab 1'
      }
    });

    // 检查基本渲染
    expect(wrapper.find('.rt-tab').exists()).toBe(true);
    expect(wrapper.find('.rt-tab--line').exists()).toBe(true);
    expect(wrapper.find('.custom-tab-class').exists()).toBe(true);

    // 检查标签名称
    expect(wrapper.text()).toContain('Tab 1');
  });

  it('should have active class when tab is active', () => {
    const wrapper = mount(TabWrapper, {
      props: {
        tabId: 'tab1', // tab1 is active in our mock store
        tabName: 'Tab 1'
      }
    });

    expect(wrapper.find('.rt-tab-active').exists()).toBe(true);
  });

  it('should not have active class when tab is not active', () => {
    const wrapper = mount(TabWrapper, {
      props: {
        tabId: 'tab2', // tab2 is not active in our mock store
        tabName: 'Tab 2'
      }
    });

    expect(wrapper.find('.rt-tab-active').exists()).toBe(false);
  });

  it('should call store.open when non-active tab is clicked', async () => {
    // 创建一个独立的store用于测试
    const store = createMockStore();

    const wrapper = mount({
      setup() {
        provide('tabStore', store);
        provide('tabClass', 'custom-tab-class');
        provide('tabType', 'line');

        return () => h(Tab, {
          id: 'tab2',
          name: 'Tab 2'
        });
      }
    });

    // 点击标签
    await wrapper.find('.rt-tab').trigger('click');

    // 验证store.open被调用
    expect(store.open).toHaveBeenCalledWith('/tab2');
  });

  it('should not call store.open when active tab is clicked', async () => {
    // 创建一个独立的store用于测试
    const store = createMockStore();

    const wrapper = mount({
      setup() {
        provide('tabStore', store);
        provide('tabClass', 'custom-tab-class');
        provide('tabType', 'line');

        return () => h(Tab, {
          id: 'tab1', // 活跃标签
          name: 'Tab 1'
        });
      }
    });

    // 点击标签
    await wrapper.find('.rt-tab').trigger('click');

    // 验证store.open没有被调用
    expect(store.open).not.toHaveBeenCalled();
  });

  it('should show close button when there are multiple tabs', () => {
    const wrapper = mount(TabWrapper, {
      props: {
        tabId: 'tab1',
        tabName: 'Tab 1'
      }
    });

    // 在我们的模拟store中有两个标签，所以应该显示关闭按钮
    // 注意：如果组件中使用了不同的类名，需要相应调整
    const closeButton = wrapper.findComponent({ name: 'RtTabClose' });
    expect(closeButton.exists()).toBe(true);
  });

  it('should show dropdown menu on right click', async () => {
    const wrapper = mount(TabWrapper, {
      props: {
        tabId: 'tab1',
        tabName: 'Tab 1'
      },
      attachTo: document.body // 附加到DOM以便正确处理事件
    });

    // 模拟右键点击
    const event = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      clientX: 100,
      clientY: 100
    };

    await wrapper.find('.rt-tab').trigger('contextmenu', event);

    // 验证事件处理
    expect(event.preventDefault).toHaveBeenCalled();
    expect(event.stopPropagation).toHaveBeenCalled();

    // 清理
    wrapper.unmount();
  });
}); 
