import editor from "vue2-medium-editor";

const LineHeightButton = editor.MediumEditor.Extension.extend({
  name: "line-height",

  init() {
    this.button = this.document.createElement("button");
    this.button.classList.add("medium-editor-action");
    this.button.innerHTML = `
      <div class="size-picker-widget">
        <input class="display" readonly>
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
    this.on(
      this.button.querySelector(".inc"),
      "click",
      this.handleIncrement.bind(this)
    );
    this.on(
      this.button.querySelector(".dec"),
      "click",
      this.handleDecrement.bind(this)
    );
    this.on(
      this.base.origElements,
      "click",
      this.measureCurrentLineHeight.bind(this)
    );
    this.on(
      this.button.querySelector(".display"),
      "keydown",
      this.handleKeyInput.bind(this)
    );
    this.base.subscribe("positionToolbar", this.saveSelection.bind(this));
  },
  getButton() {
    return this.button;
  },
  measureCurrentLineHeight() {
    const selection = this.base.getSelectedParentElement();
    let lineHeight = window.getComputedStyle(selection).lineHeight;
    if (selection.style.lineHeight) {
      lineHeight = selection.style.lineHeight;
    }

    if (lineHeight === "normal") {
      this.currentSize = 1;
    } else if (lineHeight.includes("px")) {
      const fontSize = window.getComputedStyle(selection).fontSize.slice(0, -2);
      this.currentSize = lineHeight.slice(0, -2) / fontSize || 1;
    } else {
      this.currentSize = Number(lineHeight) || 1;
    }
    this.displayCurrentHeight();
  },
  displayCurrentHeight() {
    this.button.querySelector(".display").value = Number(
      this.currentSize
    ).toFixed(1);
  },
  saveSelection() {
    this.button.querySelector(".display").selection =
      this.base.exportSelection();
  },
  handleIncrement() {
    this.currentSize = this.currentSize + 0.1;
    this.applyCurrentSize();
  },
  handleDecrement() {
    this.currentSize = this.currentSize - 0.1;
    this.applyCurrentSize();
  },
  handleKeyInput(event) {
    const savedSelection = this.button.querySelector(".display").selection;
    if (!savedSelection) {
      return;
    }
    const fontSizeAction = (newSize) => {
      event.preventDefault();
      event.stopPropagation();
      this.base.importSelection(savedSelection, true);
      this.currentSize = newSize.toFixed(1);
      this.applyCurrentSize();
      event.target.focus();
    };
    switch (event.key) {
      case "Enter":
        return fontSizeAction(+event.target.value);
      case "ArrowUp":
        return fontSizeAction(this.currentSize + 0.1);
      case "ArrowDown":
        return fontSizeAction(this.currentSize - 0.1);
    }
  },
  applyCurrentSize() {
    function isBlockElement(element) {
      return ["P", "DIV", "BUTTON"].includes(element.tagName);
    }
    const findBlockElement = (element) => {
      while (!isBlockElement(element) && element !== this.base.origElements) {
        element = element.parentElement;
      }
      if (element !== this.base.origElements) {
        return element;
      }
    };
    this.displayCurrentHeight();
    const selectionState = this.base.exportSelection();
    if (selectionState.start === selectionState.end) {
      const selection = findBlockElement(this.base.getSelectedParentElement());
      if (selection) {
        this.base.selectElement(selection);
        selection.style.lineHeight = this.currentSize;
      } else {
        this.base.origElements.innerHTML = `<div style="line-height:${this.currentSize}">${this.base.origElements.innerHTML}</div>`;
      }
      this.base.checkContentChanged();
      return;
    }

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
    parent.outerHTML = `<div style="line-height:${this.currentSize.toFixed(
      1
    )}">${fontElement.innerHTML}</div>`;
    this.base.importSelection(selectionState, true);
    this.displayCurrentHeight();
    this.base.checkContentChanged();
  },
});

export default LineHeightButton;
