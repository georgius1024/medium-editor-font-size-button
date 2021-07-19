import editor from "medium-editor";
/* eslint-disable no-useless-escape */

const LinkForm = editor.extensions.form.extend({
  name: "link-form",
  customClassOption: null,
  customClassOptionText: "Button",
  linkValidation: false,
  placeholderText: "Paste or type a link",
  targetCheckbox: false,
  targetCheckboxText: "Open in new window",
  action: "createLink",
  aria: "link",
  tagNames: ["a"],
  contentDefault: "<b>#</b>",
  contentFA: '<i class="fa fa-link"></i>',

  init(callback) {
    editor.MediumEditor.extensions.form.prototype.init.apply(this, arguments);
    this.callback = callback;
    this.subscribe("editableKeydown", this.handleKeydown.bind(this));
  },

  emit() {
    this.callback && this.callback();
  },

  handleClick: function (event) {
    event.preventDefault();
    event.stopPropagation();

    var range = editor.MediumEditor.selection.getSelectionRange(this.document);

    if (
      range.startContainer.nodeName.toLowerCase() === "a" ||
      range.endContainer.nodeName.toLowerCase() === "a" ||
      editor.MediumEditor.util.getClosestTag(
        editor.MediumEditor.selection.getSelectedParentElement(range),
        "a"
      )
    ) {
      return this.execAction("unlink");
    }

    if (!this.isDisplayed()) {
      this.showForm();
    }

    return false;
  },

  handleKeydown: function (event) {
    if (
      editor.MediumEditor.util.isKey(
        event,
        editor.MediumEditor.util.keyCode.K
      ) &&
      editor.MediumEditor.util.isMetaCtrlKey(event) &&
      !event.shiftKey
    ) {
      this.handleClick(event);
    }
  },

  // Called by medium-editor to append form to the toolbar
  getForm: function () {
    if (!this.form) {
      this.form = this.createForm();
    }
    return this.form;
  },

  getTemplate: function () {
    var template = [
      '<input type="text" class="medium-editor-toolbar-input" placeholder="',
      this.placeholderText,
      '">',
    ];

    template.push(
      '<a href="#" class="medium-editor-toolbar-save">',
      this.getEditorOption("buttonLabels") === "fontawesome"
        ? '<i class="fa fa-check"></i>'
        : this.formSaveLabel,
      "</a>"
    );

    template.push(
      '<a href="#" class="medium-editor-toolbar-close">',
      this.getEditorOption("buttonLabels") === "fontawesome"
        ? '<i class="fa fa-times"></i>'
        : this.formCloseLabel,
      "</a>"
    );
    if (this.targetCheckbox) {
      template.push(
        '<div class="medium-editor-toolbar-form-row">',
        '<input type="checkbox" class="medium-editor-toolbar-anchor-target" id="medium-editor-toolbar-anchor-target-field-' +
          this.getEditorId() +
          '">',
        '<label for="medium-editor-toolbar-anchor-target-field-' +
          this.getEditorId() +
          '">',
        this.targetCheckboxText,
        "</label>",
        "</div>"
      );
    }

    if (this.customClassOption) {
      template.push(
        '<div class="medium-editor-toolbar-form-row">',
        '<input type="checkbox" class="medium-editor-toolbar-anchor-button" id="medium-editor-toolbar-anchor-button-field-' +
          this.getEditorId() +
          '">',
        '<label for="medium-editor-toolbar-anchor-button-field-' +
          this.getEditorId() +
          '">',
        this.customClassOptionText,
        "</label>",
        "</div>"
      );
    }

    return template.join("");
  },

  isDisplayed: function () {
    return editor.MediumEditor.extensions.form.prototype.isDisplayed.apply(
      this
    );
  },

  hideForm: function () {
    editor.MediumEditor.extensions.form.prototype.hideForm.apply(this);
    this.getInput().value = "";
  },

  showForm: function (opts) {
    var input = this.getInput(),
      targetCheckbox = this.getAnchorTargetCheckbox(),
      buttonCheckbox = this.getAnchorButtonCheckbox();

    opts = opts || { value: "" };
    if (typeof opts === "string") {
      opts = {
        value: opts,
      };
    }

    this.base.saveSelection();
    this.hideToolbarDefaultActions();
    editor.MediumEditor.extensions.form.prototype.showForm.apply(this);
    this.setToolbarPosition();

    input.value = opts.value;
    input.focus();
    if (targetCheckbox) {
      targetCheckbox.checked = opts.target === "_blank";
    }

    if (buttonCheckbox) {
      var classList = opts.buttonClass ? opts.buttonClass.split(" ") : [];
      buttonCheckbox.checked = classList.indexOf(this.customClassOption) !== -1;
    }
  },

  destroy: function () {
    if (!this.form) {
      return false;
    }

    if (this.form.parentNode) {
      this.form.parentNode.removeChild(this.form);
    }

    delete this.form;
  },

  getFormOpts: function () {
    var targetCheckbox = this.getAnchorTargetCheckbox(),
      buttonCheckbox = this.getAnchorButtonCheckbox(),
      opts = {
        value: this.getInput().value.trim(),
      };

    if (this.linkValidation) {
      opts.value = this.checkLinkFormat(opts.value);
    }

    opts.target = "_self";
    if (targetCheckbox && targetCheckbox.checked) {
      opts.target = "_blank";
    }

    if (buttonCheckbox && buttonCheckbox.checked) {
      opts.buttonClass = this.customClassOption;
    }

    return opts;
  },

  doFormSave: function () {
    var opts = this.getFormOpts();
    this.completeFormSave(opts);
  },

  completeFormSave: function (opts) {
    this.base.restoreSelection();
    this.execAction(this.action, opts);
    this.emit();
    this.base.checkSelection();
  },

  ensureEncodedUri: function (str) {
    return str === decodeURI(str) ? encodeURI(str) : str;
  },

  ensureEncodedUriComponent: function (str) {
    return str === decodeURIComponent(str) ? encodeURIComponent(str) : str;
  },

  ensureEncodedParam: function (param) {
    var split = param.split("="),
      key = split[0],
      val = split[1];

    return (
      key + (val === undefined ? "" : "=" + this.ensureEncodedUriComponent(val))
    );
  },

  ensureEncodedQuery: function (queryString) {
    return queryString
      .split("&")
      .map(this.ensureEncodedParam.bind(this))
      .join("&");
  },

  checkLinkFormat: function (value) {
    // Matches any alphabetical characters followed by ://
    // Matches protocol relative "//"
    // Matches common external protocols "mailto:" "tel:" "maps:"
    // Matches relative hash link, begins with "#"
    var urlSchemeRegex = /^([a-z]+:)?\/\/|^(mailto|tel|maps):|^\#/i,
      hasScheme = urlSchemeRegex.test(value),
      scheme = "",
      // telRegex is a regex for checking if the string is a telephone number
      telRegex = /^\+?\s?\(?(?:\d\s?\-?\)?){3,20}$/,
      urlParts = value.match(/^(.*?)(?:\?(.*?))?(?:#(.*))?$/),
      path = urlParts[1],
      query = urlParts[2],
      fragment = urlParts[3];

    if (telRegex.test(value)) {
      return "tel:" + value;
    }

    if (!hasScheme) {
      var host = path.split("/")[0];
      // if the host part of the path looks like a hostname
      if (host.match(/.+(\.|:).+/) || host === "localhost") {
        scheme = "http://";
      }
    }

    return (
      scheme +
      // Ensure path is encoded
      this.ensureEncodedUri(path) +
      // Ensure query is encoded
      (query === undefined ? "" : "?" + this.ensureEncodedQuery(query)) +
      // Include fragment unencoded as encodeUriComponent is too
      // heavy handed for the many characters allowed in a fragment
      (fragment === undefined ? "" : "#" + fragment)
    );
  },

  doFormCancel: function () {
    this.base.restoreSelection();
    this.base.checkSelection();
  },

  // form creation and event handling
  attachFormEvents: function (form) {
    var close = form.querySelector(".medium-editor-toolbar-close"),
      save = form.querySelector(".medium-editor-toolbar-save"),
      input = form.querySelector(".medium-editor-toolbar-input");

    // Handle clicks on the form itself
    this.on(form, "click", this.handleFormClick.bind(this));

    // Handle typing in the textbox
    this.on(input, "keyup", this.handleTextboxKeyup.bind(this));

    // Handle close button clicks
    this.on(close, "click", this.handleCloseClick.bind(this));

    // Handle save button clicks (capture)
    this.on(save, "click", this.handleSaveClick.bind(this), true);
  },

  createForm: function () {
    var doc = this.document,
      form = doc.createElement("div");

    // Anchor Form (div)
    form.className = "medium-editor-toolbar-form";
    form.id = "medium-editor-toolbar-form-anchor-" + this.getEditorId();
    form.innerHTML = this.getTemplate();
    this.attachFormEvents(form);

    return form;
  },

  getInput: function () {
    return this.getForm().querySelector("input.medium-editor-toolbar-input");
  },

  getAnchorTargetCheckbox: function () {
    return this.getForm().querySelector(".medium-editor-toolbar-anchor-target");
  },

  getAnchorButtonCheckbox: function () {
    return this.getForm().querySelector(".medium-editor-toolbar-anchor-button");
  },

  handleTextboxKeyup: function (event) {
    // For ENTER -> create the anchor
    if (event.keyCode === editor.MediumEditor.util.keyCode.ENTER) {
      event.preventDefault();
      this.doFormSave();
      return;
    }

    // For ESCAPE -> close the form
    if (event.keyCode === editor.MediumEditor.util.keyCode.ESCAPE) {
      event.preventDefault();
      this.doFormCancel();
    }
  },

  handleFormClick: function (event) {
    // make sure not to hide form when clicking inside the form
    event.stopPropagation();
  },

  handleSaveClick: function (event) {
    // Clicking Save -> create the anchor
    event.preventDefault();
    this.doFormSave();
  },

  handleCloseClick: function (event) {
    // Click Close -> close the form
    event.preventDefault();
    this.doFormCancel();
  },
});

export default LinkForm;
