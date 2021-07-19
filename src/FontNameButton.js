import editor from "vue2-medium-editor";

const FontNameButton = editor.MediumEditor.Extension.extend({
  name: "font-name",

  fonts: {
    Arial: "'Arial', sans-serif",
    Avenir: "'Avenir', sans-serif",
    Courier: "'Courier', monospace",
    "Faster One": "'Faster One', cursive",
    Kodchasan: "'Kodchasan', sans-serif",
    "Krona One": "'Krona One', sans-serif",
    Lato: "'Lato', sans-serif",
    Montserrat: "'Montserrat', sans-serif",
    "Open Sans": "'Open Sans', sans-serif",
    Poppins: "'Poppins', sans-serif",
    Roboto: "'Roboto', sans-serif",
    "Roboto Mono": "'Roboto Mono', monospace",
    Sniglet: "'Sniglet', cursive",
    Ubuntu: "'Ubuntu', sans-serif",
    "Ubuntu Mono": "'Ubuntu Mono', monospace",
  },

  init() {
    this.button = this.document.createElement("button");
    this.button.classList.add("medium-editor-action");
    this.button.innerHTML = `
      <div class="font-picker-widget">
        <select class="font-name" >
          ${Object.keys(this.fonts)
            .map((font) => `<option value="${font}">${font}</option>`)
            .join("\n")}
        </select>
      </div>`;
    this.currentFont = "";
    this.on(
      this.button.querySelector(".font-name"),
      "click",
      this.applyFont.bind(this)
    );
    this.on(this.base.origElements, "click", this.detectCurrentFont.bind(this));
    this.base.subscribe("positionToolbar", this.saveSelection.bind(this));
  },
  getButton() {
    return this.button;
  },
  detectCurrentFont() {
    const selection = this.base.getSelectedParentElement();
    this.currentFont = window.getComputedStyle(selection).fontFamily;
    this.displayCurrentFont();
  },
  displayCurrentFont() {
    const [currentFont] = this.currentFont.split('"').join('').split(',')
    this.button
      .querySelector(".font-name")
      .querySelector(`[value="${currentFont}"]`).selected = true;
  },
  saveSelection() {
    this.button.querySelector(".font-name").selection =
      this.base.exportSelection();
  },
  applyFont() {
    this.currentFont = this.button.querySelector(".font-name").value;
    const fontFamily = this.fonts[this.currentFont];
    const selectionState = this.base.exportSelection();
    if (selectionState.start === selectionState.end) {
      const selection = this.base.getSelectedParentElement();
      this.base.selectElement(selection);
      selection.style.fontFamily = fontFamily;
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
        spanElement.style.fontFamily = fontFamily;
        parent.parentNode.replaceChild(spanElement, fontElement);
      } else {
        this.document.execCommand("undo", false);
        parent.style.fontFamily = fontFamily;
      }
      this.base.importSelection(selectionState, true);
    }
    this.displayCurrentFont();
    this.base.checkContentChanged();
  },
});

export default FontNameButton;
