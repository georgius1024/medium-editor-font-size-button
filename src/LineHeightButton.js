import editor from "medium-editor";

const LineHeightButton = editor.Extension.extend({
  name: "line-height",

  init() {
    this.button = this.document.createElement("button");
    this.button.classList.add("medium-editor-action");
    this.button.innerHTML = `
      <div class="size-picker-widget">
        <input class="display" readonly>
        <div class="controls">
          <svg class="inc icon" viewBox="0 0 24 24">
            <path fill="currentColor" d="M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z" />
          </svg>
          <svg class="dec icon" viewBox="0 0 24 24">
            <path fill="currentColor" d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
          </svg>
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
    this.currentSize = Math.min(this.currentSize + 0.1, 4);
    this.applyCurrentSize();
  },
  handleDecrement() {
    this.currentSize = Math.max(this.currentSize - 0.1, 0.1);
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
      this.currentSize = Math.min(Math.max(newSize, 0.1), 4);
      this.applyCurrentSize();
      event.target.focus();
    };
    switch (event.key) {
      case "Enter":
        return fontSizeAction(+event.target.value);
      case "ArrowUp":
        return fontSizeAction(+this.currentSize + 0.1);
      case "ArrowDown":
        return fontSizeAction(+this.currentSize - 0.1);
    }
  },
  applyCurrentSize() {
    this.displayCurrentHeight();
    const cssLineHeight = Number(this.currentSize).toFixed(1);
    const selection = this.base.getSelectedParentElement();
    this.base.selectElement(selection);
    selection.style.lineHeight = cssLineHeight;
    this.base.checkContentChanged();
  },
});

export default LineHeightButton;
