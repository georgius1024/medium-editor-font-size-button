<template>
  <div id="app">
    editor
    <medium-editor
      :text="text"
      :options="options"
      custom-tag="div"
      @edit="processEditOperation"
    />
    <hr />
    <code>{{ text }}</code>
  </div>
</template>

<script>
import "medium-editor/dist/css/medium-editor.css";
import "medium-editor/dist/css/themes/mani.css";
import editor from "vue2-medium-editor";
import FontSizeButton from "./FontSizeButton";
import FontNameButton from "./FontNameButton";

export default {
  name: "App",
  components: {
    "medium-editor": editor,
  },
  data() {
    return {
      text: `<p style="font-size: 36px;">Click <span style="font-size: 27px;">here</span>&nbsp; to edit it or <span style="color: rgb(240, 50, 230);">highlight</span> the text to style it</p>`,
      options: {
        extensions: {
          "font-size": new FontSizeButton(),
          "font-name": new FontNameButton(),
        },
        toolbar: {
          buttons: [
            "font-name",
            "bold",
            "italic",
            "underline",
            "anchor",
            "unorderedlist",
            "justifyLeft",
            "justifyCenter",
            "justifyRight",
            "removeFormat",
            "font-size",
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
      },
    };
  },
  methods: {
    processEditOperation(operation) {
      this.text = operation.api.origElements.innerHTML;
    },
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
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
}

.medium-editor-placeholder:after {
  text-align: center;
  left: 0;
  right: 0;
}
</style>
