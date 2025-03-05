import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import DropdownMenu from '@routerTab/components/tabs/dropdown/index.vue';

describe('DropdownMenu Component', () => {
  it('should not render when visible is false', () => {
    const wrapper = mount(DropdownMenu, {
      props: {
        visible: false,
        position: { x: 100, y: 100 },
        disabledActions: []
      }
    });

    expect(wrapper.find('.rt-dropdown-menu').exists()).toBe(false);
  });

  it('should render when visible is true', () => {
    const wrapper = mount(DropdownMenu, {
      props: {
        visible: true,
        position: { x: 100, y: 100 },
        disabledActions: []
      }
    });

    expect(wrapper.find('.rt-dropdown-menu').exists()).toBe(true);
  });

  it('should position the menu according to props', () => {
    const position = { x: 150, y: 200 };
    const wrapper = mount(DropdownMenu, {
      props: {
        visible: true,
        position,
        disabledActions: []
      }
    });

    const menu = wrapper.find('.rt-dropdown-menu');
    expect(menu.attributes('style')).toContain(`top: ${position.y}px`);
    expect(menu.attributes('style')).toContain(`left: ${position.x}px`);
  });

  it('should emit action event when menu item is clicked', async () => {
    const wrapper = mount(DropdownMenu, {
      props: {
        visible: true,
        position: { x: 100, y: 100 },
        disabledActions: []
      }
    });

    // 找到第一个菜单项（刷新）并点击
    await wrapper.find('li').trigger('click');

    // 检查是否触发了action事件
    expect(wrapper.emitted()).toHaveProperty('action');
    expect(wrapper.emitted('action')?.[0]).toEqual(['refresh']);
  });

  it('should not emit action for disabled items', async () => {
    const wrapper = mount(DropdownMenu, {
      props: {
        visible: true,
        position: { x: 100, y: 100 },
        disabledActions: ['close']
      }
    });

    // 找到关闭菜单项（第二个li）并点击
    const closeItem = wrapper.findAll('li')[1];
    expect(closeItem.classes()).toContain('rt-dropdown-item-disabled');

    await closeItem.trigger('click');

    // 检查是否没有触发action事件
    const actionEvents = wrapper.emitted('action') || [];
    const hasCloseAction = actionEvents.some(event => event[0] === 'close');
    expect(hasCloseAction).toBe(false);
  });

  it('should prevent default on right click', async () => {
    const wrapper = mount(DropdownMenu, {
      props: {
        visible: true,
        position: { x: 100, y: 100 },
        disabledActions: []
      }
    });

    const event = {
      preventDefault: vi.fn(),
      stopPropagation: vi.fn()
    };

    // 触发右键点击
    await wrapper.find('.rt-dropdown-menu').trigger('contextmenu', event);

    // 验证preventDefault和stopPropagation被调用
    expect(event.preventDefault).toHaveBeenCalled();
    expect(event.stopPropagation).toHaveBeenCalled();
  });
}); 
