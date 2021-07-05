import editor from "vue2-medium-editor";

const MediumEditor = editor.MediumEditor;

const FontNameButton = editor.MediumEditor.Extension.extend({
  name: "font-name",

  init() {
    this.button = this.document.createElement("button");
    this.button.classList.add("medium-editor-action");
    const fonts = ["Arial", "Avenir", "Courier"];
    this.button.innerHTML = `
      <div class="font-picker-widget">
        <select class="font-name" >
          ${fonts.map((font) => `<option value="${font}">${font}</option>`)}
        </select>
      </div>`;
    this.currentFont = "";
    this.on(
      this.button.querySelector(".font-name"),
      "click",
      this.applyFont.bind(this)
    );
    this.on(this.base.origElements, "click", this.updateCurrentFont.bind(this));
    this.base.subscribe("positionToolbar", this.saveSelection.bind(this));
  },
  getButton() {
    return this.button;
  },
  updateCurrentFont() {
    const range = MediumEditor.selection.getSelectionRange(this.document);
    this.currentFont = window.getComputedStyle(
      range.startContainer.parentElement
    ).fontFamily;

    this.displayCurrentFont();
  },
  displayCurrentFont() {
    this.button
      .querySelector(".font-name")
      .querySelector(`[value="${this.currentFont}"]`).selected = true;
  },
  saveSelection() {
    this.button.querySelector(".font-name").selection =
      this.base.exportSelection();
  },
  applyFont() {
    this.currentFont = this.button.querySelector(".font-name").value;
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
      spanElement.style.fontFamily = this.currentFont;
      parent.parentNode.replaceChild(spanElement, fontElement);
    } else {
      this.document.execCommand("undo", false);
      parent.style.fontFamily = this.currentFont;
    }
    this.base.importSelection(selectionState, true);
    this.displayCurrentFont();
    this.base.checkContentChanged();
  },
});

export default FontNameButton;
