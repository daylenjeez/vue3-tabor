import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import { defineComponent, h, provide } from 'vue';
import Tab from '@tabor/components/tabs/tab/index';
import { RouterTabStore } from '@tabor/store';
import { createRouter, createWebHistory, RouteLocationNormalized, Router } from 'vue-router';

// 创建一个模拟的TaborStore
const createMockStore = () => {
    // 创建一个简单的VueRouter实例
    const router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/tab1', name: 'tab1', component: {} ,meta:{tabConfig:{name:'tab1',key:'path'}}},
        { path: '/tab2', name: 'tab2', component: {} ,meta:{tabConfig:{name:'tab2',key:'path'}}},
        { path: '/tab3', name: 'tab3', component: {} ,meta:{tabConfig:{name:(route:RouteLocationNormalized)=>`${route.query.name}`,key:'fullpath'}}}
      ]
    });
    
  const mockStore: {
    state: {
      tabs: Array<{ id: string; name: string | ((route: RouteLocationNormalized) => string); fullPath: string }>;
      activeTab: { id: string; name: string | ((route: RouteLocationNormalized) => string); fullPath: string };
    };
    find: (id: string) => { id: string; name: string | ((route: RouteLocationNormalized) => string); fullPath: string } | undefined;
    open: ReturnType<typeof vi.fn>;
    close: ReturnType<typeof vi.fn>;
    closeOthers: ReturnType<typeof vi.fn>;
    refresh: ReturnType<typeof vi.fn>;
    $router: Router;
  } = {
    state: {
      tabs: [
        { id: 'tab1', name: 'Tab 1', fullPath: '/tab1' },
        { id: 'tab2', name: 'Tab 2', fullPath: '/tab2' },
        { id: 'tab3', name: (route: RouteLocationNormalized) => `${route.query.name}`, fullPath: '/tab3?name={name}' }
      ],
      activeTab: { id: 'tab1', name: 'Tab 1', fullPath: '/tab1' }
    },
    find: vi.fn((id) => mockStore.state.tabs.find(tab => tab.id === id)),
    open: vi.fn(),
    close: vi.fn(),
    closeOthers: vi.fn(),
    refresh: vi.fn(),
    $router: router
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
    },
    fullPath: {
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
          name: props.tabName,
          id: props.tabId,
          fullPath: props.fullPath
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
        tabName: 'Tab 1',
        fullPath: '/tab1'
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
        tabName: 'Tab 1',
        fullPath: '/tab1'
      }
    });

    expect(wrapper.find('.rt-tab-active').exists()).toBe(true);
  });

  it('should not have active class when tab is not active', () => {
    const wrapper = mount(TabWrapper, {
      props: {
        tabId: 'tab2', // tab2 is not active in our mock store
        tabName: 'Tab 2',
        fullPath: '/tab2'
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
          name: 'Tab 2',
          fullPath: '/tab2'
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
          name: 'Tab 1',
          fullPath: '/tab1'
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
        tabName: 'Tab 1',
        fullPath: '/tab1'
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
        tabName: 'Tab 1',
        fullPath: '/tab1'
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

  it('should handle function name prop correctly', async () => {
    // 创建一个独立的store用于测试
    const store = createMockStore();


    // 创建名称函数
    const nameFunction = vi.fn((route) => `Route: ${route.query.name}`);

    const wrapper = mount({
      setup() {
        provide('tabStore', store);
        provide('tabClass', 'custom-tab-class');
        provide('tabType', 'line');

        return () => h(Tab, {
          id: 'tab3',
          name: nameFunction,
          fullPath: '/tab3?name=test'
        });
      }
    });

    // 等待组件更新
    await wrapper.vm.$nextTick();

    // 验证名称函数被调用，且使用了resolve后的路由对象
    expect(nameFunction).toHaveBeenCalled();
    
    // 验证渲染的文本包含函数返回的字符串
    expect(wrapper.text()).toContain('Route: test');
  });
}); 
