<script>
import "animate.css";
export default {
  functional: true,
  props: {
    isNext: {
      default: true,
    },
  },
  render(h, context) {
    var data = {
      props: {
        appear: true,
        appearActiveClass: "animate__animated animate__fadeInRight",
        enterActiveClass: context.props.isNext ? "animate__animated animate__fadeInRight" : "animate__animated animate__fadeInLeft",
        leaveActiveClass: context.props.isNext ? "animate__animated animate__fadeOutLeft" : "animate__animated animate__fadeOutRight",
        name: "data-driven-transition",
        duration: 1000,
        mode: "out-in",
      },
    };
    return h("transition-group", data, context.children);
  },
};
</script>
