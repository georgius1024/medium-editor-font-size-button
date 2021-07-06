import editor from "vue2-medium-editor";

function withPixels(size) {
  if (String(size).slice(-2) !== "px") {
    return `${size}px`;
  }
  return size;
}

function withoutPixels(size) {
  if (size.slice(-2) === "px") {
    return +size.slice(0, -2);
  }
  return +size;
}

const FontSizeButton = editor.MediumEditor.Extension.extend({
  name: "font-size",

  init() {
    this.button = this.document.createElement("button");
    this.button.classList.add("medium-editor-action");
    this.button.innerHTML = `
      <div class="size-picker-widget">
        <input class="display">
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
      this.measureCurrentFontSize.bind(this)
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
  measureCurrentFontSize() {
    const selection = this.base.getSelectedParentElement();
    this.currentSize = window.getComputedStyle(selection).fontSize;
    this.displayCurrentSize();
  },
  displayCurrentSize() {
    this.button.querySelector(".display").value = this.currentSize;
  },
  saveSelection() {
    this.button.querySelector(".display").selection =
      this.base.exportSelection();
  },
  handleIncrement() {
    this.currentSize = withPixels(withoutPixels(this.currentSize) + 1);
    this.applyCurrentSize();
  },
  handleDecrement() {
    this.currentSize = withPixels(withoutPixels(this.currentSize) - 1);
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
      this.currentSize = newSize;
      this.applyCurrentSize();
      event.target.focus();
    };
    switch (event.key) {
      case "Enter":
        return fontSizeAction(withPixels(event.target.value));
      case "ArrowUp":
        return fontSizeAction(withPixels(withoutPixels(this.currentSize) + 1));
      case "ArrowDown":
        return fontSizeAction(withPixels(withoutPixels(this.currentSize) - 1));
    }
  },
  applyCurrentSize() {
    const selectionState = this.base.exportSelection();
    if (selectionState.start === selectionState.end) {
      const selection = this.base.getSelectedParentElement();
      this.base.selectElement(selection);
      selection.style.fontSize = this.currentSize;
    } else {
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
    }
    this.displayCurrentSize();
    this.base.checkContentChanged();
  },
});

export default FontSizeButton;
