import editor from "medium-editor";

const CustomFieldButton = editor.Extension.extend({
  name: "custom-field",
  fields: {
    total_order_amount: "Subscriber Total Order Amount",
    last_collection_abandoned: "Last Collection Abandoned",
    last_collection_purchased: "Last Collection Purchased",
    last_product_abandoned: "Last Product Abandoned",
    last_product_purchased: "Last Product Purchased",
    country: "Subscriber Country",
    email: "Subscriber Email",
    full_name: "Subscriber Full Name",
    last_name: "Subscriber Last Name",
    name: "Subscriber Name",
    store_name: "Store Name",
    store_address: "Store Address",
    last_order_amount: "Subscriber Last Order Amount",
    total_order_count: "Subscriber Total Order Count",
  },
  init() {
    this.button = this.document.createElement("button");
    this.button.classList.add("medium-editor-action");
    this.button.innerHTML = `
      <div class="dropdown-toggle" type="button" id="field-name-button" data-bs-toggle="dropdown" aria-expanded="false">
        Personaization
      </div>
      <div class="dropdown-menu" id="fields-list" aria-labelledby="font-name-button">
        ${Object.entries(this.fields)
          .map(
            ([key, value]) =>
              `<div><a class="dropdown-item" href="${key}">${value}</a></div>`
          )
          .join("\n")}
      </div>`;
    const links = this.button.querySelectorAll("#fields-list a");
    Array.from(links).forEach((element) => {
      this.on(
        element,
        "click",
        this.addField.bind(this, element.href, element.innerText)
      );
    });
    this.on(this.button, "click", this.toggle.bind(this));
  },
  getButton() {
    return this.button;
  },
  addField(field, desc, event) {
    event.preventDefault();
    event.stopPropagation();
    this.base.pasteHTML(`{{ ${field} | fallback: 'fallback' }}`)
    this.button.querySelector("#field-name-button").click()
  },
  // getInput() {
  //   return 'eswdlqff'
  // },
  // getAnchorTargetCheckbox() {
  //   return 'habra cadabra'
  // },
  // getAnchorButtonCheckbox() {
  //   return 'havanagila'
  // },
  // hideToolbarDefaultActions() {

  // },
  // setToolbarPosition() {

  // },

  // getFormOpts() {
  //   return { value: this.getInput().value.trim(), selectedTag: this.selectedTag };
  // },

  // detectCurrentFont() {
  //   const selection = this.base.getSelectedParentElement();
  //   this.currentFont = window.getComputedStyle(selection).fontFamily;
  //   this.displayCurrentFont();
  // },
  // displayCurrentFont() {
  //   const [currentFont] = this.currentFont.split('"').join("").split(",");
  //   this.button.querySelector("#font-name-button").innerText = currentFont;
  // },
  // saveSelection() {
  //   this.button.selection = this.base.exportSelection();
  // },
  // applyFont(font, event) {
  //   console.log(arguments);
  //   event.preventDefault();
  //   event.stopPropagation();
  //   this.currentFont = font; //this.button.querySelector("#font-name-button").innerText;
  //   const fontFamily = this.fonts[this.currentFont];
  //   const selectionState = this.base.exportSelection();
  //   if (selectionState.start === selectionState.end) {
  //     const selection = this.base.getSelectedParentElement();
  //     this.base.selectElement(selection);
  //     selection.style.fontFamily = fontFamily;
  //   } else {
  //     const fontName = "imaginary";
  //     this.document.execCommand("fontName", false, fontName);
  //     const fontElement = this.document.querySelector('font[face="imaginary"]');
  //     let parent = fontElement;

  //     while (
  //       parent.innerText === parent.parentElement.innerText &&
  //       parent.parentElement !== this.base.origElements
  //     ) {
  //       parent = parent.parentElement;
  //     }

  //     if (fontElement === parent) {
  //       const spanElement = this.document.createElement("span");
  //       spanElement.innerText = fontElement.innerText;
  //       spanElement.style.fontFamily = fontFamily;
  //       parent.parentNode.replaceChild(spanElement, fontElement);
  //     } else {
  //       this.document.execCommand("undo", false);
  //       parent.style.fontFamily = fontFamily;
  //     }
  //     this.base.importSelection(selectionState, true);
  //   }
  //   this.displayCurrentFont();
  //   this.base.checkContentChanged();
  // },
  toggle(event) {
    const toggle = this.button.querySelector("#field-name-button")
    if (event.target !== toggle) {
      event.stopPropagation();
      toggle.click();
    }
  },
});

export default CustomFieldButton;
