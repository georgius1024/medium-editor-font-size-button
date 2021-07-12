<template>
  <div>
    <slot></slot>
          <medium-editor
            v-once
            ref="title"
            :text="text"
            :options="options()"
            custom-tag="div"
            @edit="updateTitle"
          />    
  </div>
</template>
<script>
import "medium-editor/dist/css/medium-editor.css";
import "medium-editor/dist/css/themes/mani.css";
import editor from "vue2-medium-editor";
import FontSizeButton from "./FontSizeButton";
import FontNameButton from "./FontNameButton";
import LineHeightButton from "./LineHeightButton";
export default {
  name: "Editor",
  components: {
    "medium-editor": editor,
  },
  methods: {
    options() {
      return {
        extensions: {
          "font-size": new FontSizeButton(),
          "font-name": new FontNameButton(),
          "line-height": new LineHeightButton(),
        },
        toolbar: {
          buttons: [
            "font-name",
            "font-size",
            "line-height",
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
          sticky: true,
          align: "center",
          updateOnEmptySelection: true,
        },
        placeholder: {
          text: "Type your text ПРЯМО ТУТ!!!",
          hideOnClick: true,
        },
      };
    },
    updateTitle(operation) {
      this.text = this.displayTitle = operation.api.origElements.innerHTML;
    },
    updateText(operation) {
      this.paragraphs = this.displayDescription =
        operation.api.origElements.innerHTML;
    },
    updateButton(operation) {
      this.button = this.displayButton = operation.api.origElements.innerHTML;
    },
    reset() {
      this.text = this.$refs.title.$el.innerHTML;
      this.paragraphs = this.$refs.description.$el.innerHTML;
      this.button = this.$refs.button.$el.innerHTML;
      this.key = this.key + 1;
    },
    handleTitleCreated(editor) {
      console.log(editor)
      editor.setContent(this.text, 0)
    },
    paintLinks() {
      const getTextWithFixedLinksColor = (text, color) => {
        const doc = new DOMParser().parseFromString(text, "text/html");
        const links = Array.from(doc.querySelectorAll("a"));
        links.forEach((link) => {
          link.style.color = color;
        });
        return doc.body.innerHTML;
      };
      this.text = getTextWithFixedLinksColor(this.text, this.linkColor);
      this.paragraphs = getTextWithFixedLinksColor(
        this.paragraphs,
        this.linkColor
      );
      this.button = getTextWithFixedLinksColor(this.button, this.linkColor);
      this.key = this.key + 1;
    },
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
.font-picker-widget {
  .font-name {
    background-color: transparent;
    padding: 4px;
    outline: none;
    border: none;
    &:focus,
    &:focus-visible {
      outline: 1px solid white;
    }
    &:hover {
      outline: 1px solid white;
    }
    & > * {
      margin: 4px;
      outline: none;
      border: none;
    }
  }
}
.size-picker-widget {
  display: flex;
  flex-direction: row;
  align-items: center;
  .display {
    padding: 4px;
    width: 40px;
    border: none;
    background-color: transparent;
    color: inherit;
    margin-right: 2px;
    &:focus,
    &:focus-visible {
      outline: 1px solid white;
    }
    &:hover {
      outline: 1px solid white;
    }
  }
  .controls {
    display: flex;
    flex-direction: column;
    align-items: center;
    .icon {
      width: 12px;
      height: 12px;
      cursor: pointer;
      &:hover {
        outline: 1px solid white;
      }
    }
  }
}
</style>

<style>
.medium-editor-element {
  outline: none;
  min-height: unset;
}

.medium-editor-placeholder:after {
  text-align: center;
  left: 0;
  right: 0;
}
</style>
<style>
.button {
  background-color: #ccc;
  padding: 6px;
  border: 1px solid #ccc;
  display: inline-flex;
  align-items: center;
}
</style>
