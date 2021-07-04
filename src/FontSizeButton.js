import editor from "vue2-medium-editor";

const MediumEditor = editor.MediumEditor;

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
    this.on(this.base.origElements, "click", this.updateCurrentSize.bind(this));
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
  updateCurrentSize() {
    const range = MediumEditor.selection.getSelectionRange(this.document);
    this.currentSize = window.getComputedStyle(
      range.startContainer.parentElement
    ).fontSize;
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
    this.currentSize = `${+this.currentSize.slice(0, -2) + 1}px`;
    this.applyCurrentSize();
  },
  handleDecrement() {
    this.currentSize = `${+this.currentSize.slice(0, -2) - 1}px`;
    this.applyCurrentSize();
  },
  handleKeyInput(event) {
    const savedSelection = this.button.querySelector(".display").selection;
    if (!savedSelection) {
      return;
    }
    const fontSizeAction = (callback) => {
      event.preventDefault();
      event.stopPropagation();
      this.base.importSelection(savedSelection, true);
      this.currentSize = event.target.value;
      callback();
      event.target.focus();
    };
    switch (event.key) {
      case "Enter":
        fontSizeAction(() => {
          this.currentSize = event.target.value;
          this.applyCurrentSize();
        });
        break;
      case "ArrowUp":
        fontSizeAction(() => {
          this.currentSize = `${+this.currentSize.slice(0, -2) + 1}px`;
          this.applyCurrentSize();
        });
        break;
      case "ArrowDown":
        fontSizeAction(() => {
          this.currentSize = `${+this.currentSize.slice(0, -2) - 1}px`;
          this.applyCurrentSize();
        });
        break;
    }
  },
  applyCurrentSize() {
    let selectionState = this.base.exportSelection();
    if (selectionState.start === selectionState.end) {
      const range = MediumEditor.selection.getSelectionRange(this.document);
      this.base.selectElement(range.startContainer.parentElement);
      const start = range.startContainer.parentElement;
      if (start.nodeType === 3 || start.nodeName === "BR") {
        this.base.selectElement(start.parentElement);
      } else {
        this.base.selectElement(start);
      }
      selectionState = this.base.exportSelection();
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

export default FontSizeButton;