import { VNode } from 'vue';

declare global {
  namespace JSX {
    interface Element extends VNode { }
    interface ElementClass {
      $props: any;
    }
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }
}
