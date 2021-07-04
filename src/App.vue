<template>
  <div id="app">
    editor
    <medium-editor
      :text="text"
      :options="options"
      custom-tag="div"
      v-on:edit="processEditOperation"
    />
    <hr />
    <code>{{ text }}</code>
  </div>
</template>

<script>
/* eslint-disable */
import "medium-editor/dist/css/medium-editor.css";
import "medium-editor/dist/css/themes/flat.css";
import editor from "vue2-medium-editor";
import FontSizeButton from "./fsb";
import "./medium-editor.scss";

var DisableContextMenuExtension = editor.MediumEditor.Extension.extend({
  name: "disable-context-menu",

  init: function () {
    console.log("1233");
    this.getEditorElements().forEach(function (element) {
      this.base.on(element, "contextmenu", this.handleContextmenu.bind(this));
    }, this);
  },

  handleContextmenu: function (event) {},
});

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
          "change-size": new FontSizeButton(),
          "disable-context-menu": new DisableContextMenuExtension(),
        },
        toolbar: { buttons: ["change-size", "bold"] },
      },
    };
  },
  mounted() {
    console.log(editor);
    console.log(this.extensions);
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
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

<style>
.medium-editor-element {
  outline: none;
}

a,
a:hover,
section.splash h1 span,
.medium-editor-toolbar li button,
.color-1,
.color-2 {
  color: #4fc08d;
}

body,
pre,
.medium-editor-button-active b,
code {
  color: #2c3e50;
}

.medium-editor-button-active.medium-editor-button-active.medium-editor-button-active {
  background-color: #4fc08d;
}

pre,
code {
  background: #f8f8f8;
  width: 80vw;
}

pre#cdn,
code.data,
pre#usage {
  max-width: 900px;
}

code.data {
  margin-top: 50px;
}

.medium-toolbar-arrow-over:before {
  border-color: transparent transparent #2c3e50 transparent;
}

.medium-editor-toolbar li button {
  border-right: 1px solid #2c3e50;
}

section.installation,
.medium-editor-toolbar,
.medium-editor-toolbar-anchor-preview,
.github-fork-ribbon {
  background: #2c3e50;
}

.medium-toolbar-arrow-under:after {
  border-color: #2c3e50 transparent transparent transparent;
}

#toolbar-placeholder {
  display: none;
}

.medium-editor-toolbar {
  transition: none;
}
</style>
