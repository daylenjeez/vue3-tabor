// import { mount } from '@vue/test-utils';
// import { describe, it, expect } from 'vitest';
// import { defineComponent, h, provide, ref, computed } from 'vue';
// import Iframe from '@tabor/components/page/iframe/index';
// import type { TaborStore } from '@tabor/store';
// import type { Tab } from '@tabor/types';

// // 创建一个模拟的RouterTabStore
// const createMockStore = () => {
//   const tabs = ref<Tab[]>([
//     {
//       id: 'iframe1',
//       name: 'Iframe 1',
//       fullPath: '/iframe1',
//       keepAlive: true,
//       iframeAttributes: { src: 'https://example.com/1' }
//     },
//     {
//       id: 'iframe2',
//       name: 'Iframe 2',
//       fullPath: '/iframe2',
//       keepAlive: false,
//       iframeAttributes: { src: 'https://example.com/2' }
//     }
//   ]);

//   const activeTab = ref<Tab>(tabs.value[0]);

//   const mockStore = {
//     state: {
//       tabs: tabs.value,
//       activeTab: activeTab.value
//     },
//     iframeTabs: computed(() => tabs.value)
//   };

//   return mockStore as unknown as TaborStore;
// };

// // 创建一个包装组件，提供必要的依赖
// const IframeWrapper = defineComponent({
//   props: {
//     activeTabId: {
//       type: String,
//       default: 'iframe1'
//     }
//   },
//   setup(props) {
//     const store = createMockStore();
//     // 设置活跃标签
//     store.state.activeTab = store.iframeTabs.value.find(tab => tab.id === props.activeTabId) || store.state.activeTab;

//     provide('tabStore', store);

//     return () => h(Iframe);
//   }
// });

// describe('Iframe Component', () => {
//   it('should render iframe for active tab', () => {
//     const wrapper = mount(IframeWrapper, {
//       props: {
//         activeTabId: 'iframe1'
//       }
//     });

//     // 检查iframe容器
//     expect(wrapper.find('.tabor-iframe-container').exists()).toBe(true);

//     // 检查iframe元素
//     const iframes = wrapper.findAll('iframe');
//     expect(iframes.length).toBe(1);

//     // 检查iframe属性
//     const iframe = iframes[0];
//     expect(iframe.attributes('src')).toBe('https://example.com/1');
//   });

//   it('should render keepAlive iframes even when not active', () => {
//     const wrapper = mount(IframeWrapper, {
//       props: {
//         activeTabId: 'iframe2' // iframe2是活跃的，但iframe1应该保留因为它有keepAlive
//       }
//     });

//     // 应该有两个iframe：一个活跃的和一个keepAlive的
//     const iframes = wrapper.findAll('iframe');
//     expect(iframes.length).toBe(2);

//     // 检查第一个iframe (keepAlive但不活跃)
//     const iframe1 = iframes.find(iframe => iframe.attributes('src') === 'https://example.com/1');
//     expect(iframe1).toBeDefined();
//     expect(iframe1?.isVisible()).toBe(false); // 不活跃，所以不可见

//     // 检查第二个iframe (活跃)
//     const iframe2 = iframes.find(iframe => iframe.attributes('src') === 'https://example.com/2');
//     expect(iframe2).toBeDefined();
//     expect(iframe2?.isVisible()).toBe(true); // 活跃，所以可见
//   });

//   it('should not render non-keepAlive iframes when not active', () => {
//     // 创建一个新的标签，不设置keepAlive
//     const wrapper = mount(IframeWrapper, {
//       props: {
//         activeTabId: 'iframe1' // iframe1是活跃的，iframe2没有keepAlive所以不应该渲染
//       }
//     });

//     // 只应该有一个iframe (活跃的)
//     const iframes = wrapper.findAll('iframe');
//     expect(iframes.length).toBe(1);

//     // 检查iframe
//     expect(iframes[0].attributes('src')).toBe('https://example.com/1');
//   });
// }); 
