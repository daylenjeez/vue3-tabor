import { type CSSProperties, defineComponent, type PropType } from "vue";

export default defineComponent({
  name: "ElementClose",
  props: {
    style: {
      type: Object as PropType<CSSProperties>,
      required: false,
      default: () => ({}),
    },
  },
  setup(props) {
    return () => (
      <div style={{ width: "1em", height: "1em", ...props.style }}>
        <svg viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275q-.275-.275-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7q.275-.275.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275q.275.275.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7q-.275.275-.7.275t-.7-.275L12 13.4Z"
          />
        </svg>
      </div>
    );
  },
});
