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
/* eslint-disable */
import "medium-editor/dist/css/medium-editor.css";
import "medium-editor/dist/css/themes/flat.css";
import editor from "vue2-medium-editor";
import FontSizeButton from "./fsb";
//import "./medium-editor.scss";

const MediumEditor = editor.MediumEditor;
var TestExtension = editor.MediumEditor.Extension.extend({
  name: "test-ext",

  init() {
    this.button = this.document.createElement("button");
    this.button.classList.add("medium-editor-action");
    this.button.innerHTML = `
      <div class="size-picker-widget">
        <div class="display"></div>
        <div class="controls">
          <div class="inc icon">
            <svg style="width:12px;height:12px" viewBox="0 0 24 24">
              <path fill="currentColor" d="M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z" />
            </svg>
          </div>
          <div class="dec icon">
            <svg style="width:12px;height:12px" viewBox="0 0 24 24">
              <path fill="currentColor" d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
            </svg>
          </div>
        </div>
      </div>`;
    this.currentSize = "";
    //this.on(this.button, "click", this.handleClick.bind(this));
    this.on(
      this.button.querySelector(".inc"),
      "click",
      this.handleInc.bind(this)
    );
    this.on(
      this.button.querySelector(".dec"),
      "click",
      this.handleDec.bind(this)
    );

    this.on(this.base.origElements, "click", this.updateCurrentSize.bind(this));
  },
  getButton() {
    return this.button;
  },
  updateCurrentSize() {
    const range = MediumEditor.selection.getSelectionRange(this.document);
    this.currentSize = window.getComputedStyle(
      range.startContainer.parentElement
    ).fontSize;
    this.displayCurrentSize();
  },
  displayCurrentSize() {
    this.button.querySelector(".display").innerText = this.currentSize;
  },
  handleInc() {
    this.handleClick(+1);
  },
  handleDec() {
    this.handleClick(-1);
  },
  handleClick(dec) {
    const range = MediumEditor.selection.getSelectionRange(this.document);
    if (range.startOffset === range.endOffset) {
      this.base.selectElement(range.startContainer.parentElement)
      const start = range.startContainer.parentElement
      if (start.nodeType === 3 || start.nodeName === 'BR') {
        this.base.selectElement(range.startContainer.parentElement.parentElement)
      }
    }
    const selectionState = this.base.exportSelection();

    const fontName = "imaginary";
    this.document.execCommand("fontName", false, fontName);
    const fontElement = this.document.querySelector('font[face="imaginary"]');
    let parent = fontElement;

    while (
      parent.innerText === parent.parentElement.innerText &&
      parent.parentElement !== this.base.origElements
    ) {
      parent = parent.parentElement;
    }
    this.currentSize = `${+this.currentSize.slice(0, -2) + dec}px`;

    if (fontElement === parent) {
      const spanElement = this.document.createElement("span");
      spanElement.innerText = fontElement.innerText;
      spanElement.style.fontSize = this.currentSize;
      parent.parentNode.replaceChild(spanElement, fontElement);
    } else {
      this.document.execCommand("undo", false);
      parent.style.fontSize = this.currentSize;
    }
    this.base.importSelection(selectionState, true);
    this.displayCurrentSize();
    this.base.checkContentChanged();
  },
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
          "test-ext": new TestExtension(),
        },
        toolbar: {
          buttons: ["test-ext", "bold"],
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
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.size-picker-widget {
  display: flex;
  flex-direction: row;
  align-items: center;
  .display {
    padding: 4px;
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
/* 
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
} */
</style>
