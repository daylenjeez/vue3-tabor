import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';
import clickOutside from '@routerTab/directives/clickOutside';

// 创建一个简单的测试组件
const TestComponent = defineComponent({
  directives: {
    clickOutside
  },
  props: {
    onClickOutside: {
      type: Function,
      required: true
    }
  },
  template: `
    <div>
      <div class="inside" v-click-outside="onClickOutside">Inside Element</div>
      <div class="outside">Outside Element</div>
    </div>
  `
});

describe('clickOutside directive', () => {
  let onClickOutsideMock: any;

  beforeEach(() => {
    // 创建一个新的mock函数用于每个测试
    onClickOutsideMock = vi.fn();

    // 清除之前的所有模拟调用
    vi.clearAllMocks();
  });

  it('should not trigger when clicking inside the element', async () => {
    const wrapper = mount(TestComponent, {
      props: {
        onClickOutside: onClickOutsideMock
      },
      attachTo: document.body // 附加到DOM以便正确处理事件
    });

    // 点击内部元素
    await wrapper.find('.inside').trigger('click');

    // 断言回调函数没有被调用
    expect(onClickOutsideMock).not.toHaveBeenCalled();

    // 清理
    wrapper.unmount();
  });

  it('should trigger when clicking outside the element', async () => {
    const wrapper = mount(TestComponent, {
      props: {
        onClickOutside: onClickOutsideMock
      },
      attachTo: document.body // 附加到DOM以便正确处理事件
    });

    // 模拟document上的点击事件，因为Vue Test Utils的trigger可能无法正确冒泡到document
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true
    });

    // 获取外部元素并触发真实的DOM事件
    const outsideElement = wrapper.find('.outside').element;
    outsideElement.dispatchEvent(event);

    // 等待事件处理
    await nextTick();

    // 断言回调函数被调用
    expect(onClickOutsideMock).toHaveBeenCalled();

    // 清理
    wrapper.unmount();
  });

  it('should remove event listener when component is unmounted', async () => {
    // 创建一个spy来监视document.removeEventListener
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

    const wrapper = mount(TestComponent, {
      props: {
        onClickOutside: onClickOutsideMock
      },
      attachTo: document.body // 附加到DOM以便正确处理事件
    });

    // 卸载组件
    wrapper.unmount();

    // 断言removeEventListener被调用
    expect(removeEventListenerSpy).toHaveBeenCalled();

    // 恢复原始方法
    removeEventListenerSpy.mockRestore();
  });
}); 
