import type { Directive, DirectiveBinding } from "vue";

interface ElementWithClickOutsideHandler extends HTMLElement {
  _clickOutsideHandler?: (event: MouseEvent) => void;
}

const clickOutside: Directive = {
  beforeMount(el: ElementWithClickOutsideHandler, binding: DirectiveBinding) {
    const handler = (event: MouseEvent) => {
      // Type assertion to ensure `event.target` is a Node
      const target = event.target as Node;
      if (el === target || el.contains(target)) return;

      binding.value(event);
    };

    el._clickOutsideHandler = handler;
    document.addEventListener("click", handler, true);
  },
  unmounted(el: ElementWithClickOutsideHandler) {
    if (el._clickOutsideHandler) {
      document.removeEventListener("click", el._clickOutsideHandler, true);
    }
  },
};

export default clickOutside;
