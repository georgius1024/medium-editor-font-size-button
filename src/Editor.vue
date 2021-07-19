<template>
  <div>
    <div ref="editor" v-once class="editor" v-html="value" />
  </div>
</template>
<script>
import MediumEditor from "medium-editor";
import "medium-editor/dist/css/medium-editor.css";
import "./Editor.scss";
import FontSizeButton from "./FontSizeButton";
import FontNameButton from "./FontNameButton";
import LineHeightButton from "./LineHeightButton";
import CustomFieldButton from "./CustomFieldButton";

//import LinkForm from "./LinkForm";

export default {
  name: "Editor",
  props: {
    value: {
      type: String,
      required: true,
    },
    options: {
      type: Object,
      default() {
        return {
          extensions: {
            "font-size": new FontSizeButton(),
            "font-name": new FontNameButton(),
            "line-height": new LineHeightButton(),
            "custom-field": new CustomFieldButton(),
            //"link-form": new LinkForm(),
          },
          toolbar: {
            buttons: [
              "font-name",
              "font-size",
              "line-height",
              "custom-field",
              "bold",
              "italic",
              "underline",
              "anchor",
              "unorderedlist",
              "justifyLeft",
              "justifyCenter",
              "justifyRight",
              "removeFormat",
            ],
            static: true,
            sticky1: true,
            align: "center",
            positionStaticToolbar(container) {
              const scrollTop =
                (this.document.documentElement &&
                  this.document.documentElement.scrollTop) ||
                this.document.body.scrollTop;
              const toolbarElement = this.getToolbarElement();
              const containerRect = container.getBoundingClientRect();
              const toolbarHeight = toolbarElement.offsetHeight;
              toolbarElement.style.top = `${Math.max(
                0,
                containerRect.top + scrollTop - toolbarHeight - 20
              )}px`;
              const toolbarWidth = toolbarElement.offsetWidth;
              const offsetLeft = containerRect.left - toolbarWidth / 4;
              toolbarElement.style.left = `${offsetLeft}px`;
            },
            updateOnEmptySelection: true,
          },
          placeholder: {
            text: "Type your text ПРЯМО ТУТ!!!",
            hideOnClick: true,
          },
        };
      },
      required: false,
    },
  },
  data() {
    return {
      editor: null,
    };
  },
  watch: {
    value(newValue, oldValue) {
      if (oldValue !== newValue) {
        const selection = this.editor.exportSelection();
        this.editor.setContent(newValue);
        this.editor.importSelection(selection);
      }
    },
  },
  created() {
    this.inputEvent = () => this.$emit("input", this.$refs.editor.innerHTML);
  },
  mounted() {
    this.editor = new MediumEditor(this.$refs.editor, this.options);
    this.editor.subscribe("editableInput", this.inputEvent);
  },
  beforeDestroy() {
    this.editor.unsubscribe("editableInput", this.inputEvent);
  },
  methods: {
    updated(value) {
      this.$emit("input", value);
    },
  },
};
</script>
<style lang="scss" scoped>
.editor {
  display: block;
}
</style>
