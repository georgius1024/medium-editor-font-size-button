/* eslint-disable */

import editor from "vue2-medium-editor";
const MediumEditor = editor.MediumEditor
export default MediumEditor.Extension.extend({
  name: "change-size",
  init: function () {
    this.button = this.document.createElement("button");
    this.button.classList.add("medium-editor-action");
    this.button.classList.add("font-size-picker");
    this.button.title = "Font Size";
    this.selectedElements = undefined;
    this.button.innerHTML =
      "<div><span class='button-selected-size'></span><span class='caret'></span></div>";
    this.button.classList.add("medium-editor-button-active");
    this.selectedSize = undefined;
    this.savedRange = undefined;
    this.on(this.button, "click", this.handleClick.bind(this));
    this.base.subscribe("positionToolbar", this.setCurrentSize.bind(this));
    this.on(this.base.origElements, "click", this.updateCurrentSize.bind(this));
    this.base.subscribe("positionToolbar", this.saveSelection.bind(this));
    console.log('!!!')
  },
  getButton: function () {
    return this.button;
  },
  handleClick: function () {
    var selector = this.button
      .closest(".medium-editor-toolbar")
      .querySelector("div#font-size-select");
    if (selector) {
      selector.remove();
      return;
    }
    //document.querySelector('.medium-editor-dropdown').style.display = 'none'
    //$(".medium-editor-dropdown").remove();
    this.createSizePicker();
    this.addEventListeners();
  },
  setCurrentSize: function () {
    var range = MediumEditor.selection.getSelectionRange(this.document);
    // Used getComputedStyle interface instead of DOM scanning
    // Please see https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle
    const currentSize = window.getComputedStyle(
      range.startContainer.parentElement
    ).fontSize;
    if (currentSize) {
      this.currentSize = parseFloat(currentSize);
      this.updateCurrentSize();
      return;
    }
    var cloned = range.cloneContents(true);
    var firstElChild = cloned.firstElementChild;
    var listElements = ["OL", "UL"];

    if (_.isEmpty(this.base.origElements.textContent.trim())) {
      this.currentSize = parseFloat(this.base.origElements.style.fontSize);
      this.updateCurrentSize();
      return;
    }

    if (firstElChild && firstElChild.style.fontSize) {
      this.currentSize = parseFloat(firstElChild.style.fontSize);
      this.updateCurrentSize();
      return;
    }

    if (
      this.base.origElements.firstElementChild &&
      listElements.includes(this.base.origElements.firstElementChild.nodeName)
    ) {
      if (!cloned.childElementCount) {
        var el = _.find(
          this.base.origElements.querySelector("li").childNodes,
          function (childNode) {
            return childNode.textContent == range.startContainer.textContent;
          }
        );
        var listEl = this.base.origElements.querySelector("li");
        if (el && el.nodeType !== 3 && el.style.fontSize) {
          this.currentSize = parseFloat(el.style.fontSize);
        } else {
          if (listEl && listEl.style.fontSize) {
            this.currentSize = parseFloat(listEl.style.fontSize);
          } else if (
            listEl &&
            listEl.firstElementChild &&
            listEl.firstElementChild.textContent === listEl.textContent &&
            listEl.firstElementChild.style.fontSize
          ) {
            this.currentSize = parseFloat(
              listEl.firstElementChild.style.fontSize
            );
          } else {
            this.currentSize = parseFloat(
              this.base.origElements.style.fontSize
            );
          }
        }
      }
      this.updateCurrentSize();
      return;
    }
    // when no main span is detected
    // maybe check if main span is available
    var firstEditableChild = this.base.origElements.firstElementChild;

    if (
      firstEditableChild &&
      firstEditableChild.style.fontSize &&
      firstEditableChild.textContent === this.base.origElements.textContent
    ) {
      var el = _.find(firstEditableChild.childNodes, function (childNode) {
        return childNode.textContent == range.startContainer.textContent;
      });

      if (el && (el.nodeType === 3 || el.nodeName === "BR")) {
        this.currentSize = parseFloat(firstEditableChild.style.fontSize);
      } else {
        if (el && el.style.fontSize) {
          this.currentSize = parseFloat(el.style.fontSize);
        } else {
          this.currentSize = parseFloat(firstEditableChild.style.fontSize);
        }
      }
    } else {
      var el = _.find(this.base.origElements.childNodes, function (childNode) {
        return childNode.textContent == range.startContainer.textContent;
      });

      if (el && (el.nodeType === 3 || el.nodeName === "BR")) {
        this.currentSize = parseFloat(this.base.origElements.style.fontSize);
      } else {
        if (el && el.style.fontSize) {
          this.currentSize = parseFloat(el.style.fontSize);
        } else {
          this.currentSize = parseFloat(this.base.origElements.style.fontSize);
        }
      }
    }
    this.updateCurrentSize();
  },
  createRangeFromSelection: function () {
    var range;
    range = document.createRange();
    range.setStart(this.savedRange.startContainer, this.savedRange.startOffset);
    range.setEnd(this.savedRange.endContainer, this.savedRange.endOffset);
    return range;
  },
  handleKeyEnter: function (event) {
    var self = this;
    self.inputElem.value = event.target.value;
    self.button.querySelector(".button-selected-size").innerText =
      self.inputElem.value;

    if (event.keyCode === 13) {
      var range = self.createRangeFromSelection();
      self.handleSelection({ enterKeyEvent: true, range: range });
      self.trigger("editableInput", "editableInput", self.base.origElements);
      event.preventDefault();
      event.stopPropagation();
    } else {
      if (event.code === "ArrowUp" || event.code === "ArrowDown") {
        self.handleIncreaseDecreaseAction(event);
        self.trigger("editableInput", "editableInput", self.base.origElements);
      }
    }
  },
  handleSelection: function (options = {}) {
    var self = this;
    var range, cloned, lastElement, listElements, baseFirstElementChild;
    listElements = ["OL", "UL"];
    baseFirstElementChild = self.base.origElements.firstElementChild;

    if (options.enterKeyEvent) {
      range = options.range;
    } else {
      self.selectionState = self.base.exportSelection();
      range = self.base.importSelection(self.selectionState, true);
    }
    if (typeof range === "undefined") return;

    lastElement = range.endContainer.textContent.charAt(range.endOffset);
    cloned = range.cloneContents();
    // catch if anchor tag
    // on enter, we sometimes get div wrapped elements
    // if (range.startContainer.parentElement.nodeName === 'A') {
    //   self.handleSelectionForATag(range, cloned, lastElement);
    //   return;
    // }
    // check if list or not!
    if (
      baseFirstElementChild &&
      listElements.includes(baseFirstElementChild.nodeName)
    ) {
      // console.log('check if list or not');
      if (
        (range.startContainer.parentElement.nodeName === "LI" &&
          !listElements.includes(range.commonAncestorContainer.nodeName)) ||
        range.commonAncestorContainer.nodeName === "LI" ||
        (range.commonAncestorContainer.parentElement.textContent ===
          cloned.textContent &&
          range.commonAncestorContainer.parentElement.nodeName === "LI")
      ) {
        self.handleSelectionForLi(range, cloned, lastElement);
        self.base.importSelection(self.selectionState);
        return;
      }

      if (range.startContainer.nodeName === "SPAN") {
        range.startContainer.style.fontSize = this.inputElem.value + "px";
        self.changeSize(range.commonAncestorContainer);
        self.updateSavedRange(range);
      } else if (
        cloned.childElementCount === 1 &&
        cloned.firstElementChild.nodeName === "SPAN"
      ) {
        self.handleSelectionForLi(range, cloned, lastElement);
      } else {
        var el = _.find(
          this.base.origElements.querySelector("li").childNodes,
          function (childNode) {
            return childNode.textContent == cloned.textContent;
          }
        );
        if (el && el.nodeType !== 3) {
          el.style.fontSize = this.inputElem.value + "px";
          self.removeEmptyElements();
        } else {
          self.handleSelectionForLi(range, cloned, lastElement);
        }
      }
      self.base.checkContentChanged();
      self.base.importSelection(self.selectionState);
      return;
    }
    // check if list or not!
    if (listElements.includes(range.commonAncestorContainer.nodeName)) {
      range.commonAncestorContainer.style.fontSize =
        self.inputElem.value + "px";
      self.changeSize(range.commonAncestorContainer);
      self.base.checkContentChanged();
      self.base.importSelection(self.selectionState);
      return;
    }
    if (
      self.base.origElements.textContent.trim() === cloned.textContent.trim()
    ) {
      // whole content of div selected
      // console.log('whole div content')
      if (
        baseFirstElementChild &&
        baseFirstElementChild.textContent === self.base.origElements.textContent
      ) {
        //first span encompasses all content
        // console.log('main span available');
        var firstElementChild = self.base.origElements.firstElementChild;
        var cloned = baseFirstElementChild.cloneNode(true);
        cloned.style.fontSize = self.inputElem.value + "px";
        self.changeSize(cloned);
        self.base.origElements.replaceChild(cloned, baseFirstElementChild);
        range.deleteContents();
        range.insertNode(cloned);
        self.updateSavedRange(range);
        self.removeEmptyElements();
        self.base.checkContentChanged();
        self.base.importSelection(self.selectionState);
        return;
      } else {
        // console.log('create main span')
        var span = document.createElement("span");
        span.style.fontSize = self.inputElem.value + "px";
        var styles = span.getAttribute("style");
        span.setAttribute("style", styles);

        span.appendChild(cloned);
        self.changeSize(span);
        range.deleteContents();
        range.insertNode(span);
        self.updateSavedRange(range);
        self.removeEmptyElements();
        self.base.checkContentChanged();
        self.base.importSelection(self.selectionState);
        return;
      }
    } else {
      // console.log('part of div')
      var el;
      if (range.startOffset === range.endOffset) {
        // if nothing is selected use closest parent
        el = range.startContainer;
        if (el.nodeType === 3 || el.nodeName === "BR") {
          el = range.startContainer.parentElement;
          if (el.tagName === "P") {
            el.style.fontSize = this.inputElem.value + "px";
            self.removeEmptyElements();
            self.base.checkContentChanged();
            return;
          }
        }
        if (!el.closest("[model_name]")) {
          el = self.base.origElements;
        }
        // Lets as select element and make size changes visual
        if (document.activeElement) {
          document.activeElement.blur();
        }
        const selection = window.getSelection();
        selection.removeAllRanges();
        const _range = document.createRange();
        _range.selectNodeContents(el);
        selection.addRange(_range);
        /// Check new selection is valid
        self.selectionState = self.base.exportSelection();
        range = self.base.importSelection(self.selectionState, true);
        if (range.startOffset !== range.endOffset) {
          // Something not empty selected
          // Restart with visible selection
          self.handleSelection({});
        }
        return;
      }
      if (el && el.nodeType !== 3) {
        el.style.fontSize = this.inputElem.value + "px";
        self.removeEmptyElements();
        self.base.checkContentChanged();
      } else {
        // plain text selected
        _.each(cloned.childNodes, function (childNode) {
          if (_.isEmpty(childNode.textContent.trim())) return;

          if (childNode.nodeType === 3) {
            var clonedChild = childNode.cloneNode(true);
            var span = self.document.createElement("span");
            span.style.fontSize = self.inputElem.value + "px";
            var styles = span.getAttribute("style");
            span.setAttribute("style", styles);
            span.appendChild(clonedChild);
            cloned.replaceChild(span, childNode);
          } else {
            childNode.style.fontSize = self.inputElem.value + "px";
          }
        });

        if (lastElement === " ") {
          var emptyText = document.createTextNode("\u00A0");
          cloned.appendChild(emptyText);
        }

        range.deleteContents();
        range.insertNode(cloned);
        self.updateSavedRange(range);
        self.removeEmptyElements();
        self.base.checkContentChanged();
      }
      self.base.importSelection(self.selectionState);
      return;
    }
  },
  updateSavedRange: function (oldRange) {
    this.savedRange = oldRange.cloneRange();
  },
  handleSelectionForLi: function (range, cloned, lastElement) {
    var self = this;
    var containerNodes = range.startContainer.parentElement.childNodes;
    var cloneChildren = cloned.childNodes;
    var nodesMatch =
      range.startContainer.parentElement.textContent === cloned.textContent;

    if (nodesMatch) {
      // console.log('change whole list nodes')
      var listElement = range.startContainer.parentElement;
      listElement.style.fontSize = self.inputElem.value + "px";
      if (range.startContainer.textContent === cloned.textContent) {
        //when cloned does not contain main span but exists inside li
        range.startContainer.style.fontSize = self.inputElem.value + "px";
        _.each(range.startContainer.children, function (childNode) {
          childNode.style.fontSize = self.inputElem.value + "px";
        });
      } else {
        _.each(cloned.querySelectorAll("div, span"), function (childNode) {
          childNode.style.fontSize = self.inputElem.value + "px";
        });
        self.changeSize(cloned);
        range.deleteContents();
        range.insertNode(cloned);
        self.updateSavedRange(range);
      }
      self.removeEmptyElements();
      self.base.checkContentChanged();
      return;
    } else {
      // console.log('change part of list')
      if (
        range.startContainer.textContent.trim() === cloned.textContent.trim() &&
        range.startContainer.nodeName === "SPAN"
      ) {
        // console.log('main span inside li')
        range.startContainer.style.fontSize = self.inputElem.value + "px";
      } else if (
        cloned.firstElementChild &&
        cloned.firstElementChild.textContent === cloned.textContent
      ) {
        cloned.firstElementChild.style.fontSize = self.inputElem.value + "px";
        range.deleteContents();
        range.insertNode(cloned);
        self.updateSavedRange(range);
      } else {
        _.each(cloned.childNodes, function (childNode) {
          if (childNode.nodeType === 3) {
            if (childNode.textContent.trim() === "") {
              return;
            } else {
              // console.log('create span for text inside li');
              var clonedChild = childNode.cloneNode(true);
              var span = self.document.createElement("span");
              span.style.fontSize = self.inputElem.value + "px";
              var styles = span.getAttribute("style");
              span.setAttribute("style", styles);
              if (lastElement === " ") {
                var emptyText = document.createTextNode("\u00A0");
                cloned.appendChild(emptyText);
              }
              span.appendChild(clonedChild);
              cloned.replaceChild(span, childNode);
            }
          } else {
            // console.log('change font size in span')
            childNode.style.fontSize = self.inputElem.value + "px";
          }
        });
        range.deleteContents();
        range.insertNode(cloned);
        self.updateSavedRange(range);
      }
    }
    self.removeEmptyElements();
    self.base.checkContentChanged();
    return;
  },
  handleSelectionForATag: function (range, cloned, lastElement) {
    var self = this;
    var baseFirstElementChild = self.base.origElements.firstElementChild;
    if (self.base.origElements.textContent === cloned.textContent) {
      //selected the whole anchor tag content
      // console.log('change whole anchor content')
      if (
        baseFirstElementChild &&
        baseFirstElementChild.textContent === self.base.origElements.textContent
      ) {
        // main span available
        var cloned = baseFirstElementChild.cloneNode(true);
        cloned.style.fontSize = self.inputElem.value + "px";

        self.base.origElements.replaceChild(cloned, baseFirstElementChild);
        self.changeSize(cloned);
        range.deleteContents();
        range.insertNode(cloned);
        self.updateSavedRange(range);
        self.removeEmptyElements();
        self.base.checkContentChanged();
        return;
      } else {
        // console.log('create main span')
        var span = document.createElement("span");
        span.style.fontSize = self.inputElem.value + "px";
        var styles = span.getAttribute("style");
        span.setAttribute("style", styles);

        span.appendChild(cloned);
        self.changeSize(span);
        range.deleteContents();
        range.insertNode(span);
        self.updateSavedRange(range);
        self.removeEmptyElements();
        self.base.checkContentChanged();
        return;
      }
      return;
    } else {
      // console.log('change part of anchor text')
      _.each(cloned.childNodes, function (childNode) {
        if (typeof childNode === "undefined") return;

        if (childNode.nodeType === 3) {
          if (childNode.textContent.trim() === "") return;

          var clonedChild = childNode.cloneNode(true);
          var span = self.document.createElement("span");
          span.style.fontSize = self.inputElem.value + "px";
          var styles = span.getAttribute("style");
          span.setAttribute("style", styles);

          span.appendChild(clonedChild);
          cloned.replaceChild(span, childNode);
        } else {
          if (childNode.nodeName === "BR") return;
          childNode.style.fontSize = self.inputElem.value + "px";
        }

        if (lastElement === " ") {
          var emptyText = document.createTextNode("\u00A0");
          cloned.appendChild(emptyText);
        }
        range.deleteContents();
        range.insertNode(cloned);
        self.updateSavedRange(range);
        self.removeEmptyElements();
        self.base.checkContentChanged();
        return;
      });
    }
    return;
  },
  removeEmptyElements: function () {
    var ancestor = this.base.origElements;
    var spans = ancestor.querySelectorAll("span, ul, li, div, b");
    _.each(
      spans,
      function (span) {
        if (_.isEmpty(span.textContent)) {
          span.remove();
        }
      },
      this
    );
  },
  changeSize: function (span) {
    if (span.childElementCount > 0) {
      _.each(
        span.querySelectorAll("span, ul, li"),
        function (el) {
          el.style.fontSize = this.inputElem.value + "px";
        },
        this
      );
    }
    this.base.checkContentChanged(this.base.origElements);
  },
  createSizePicker: function () {
    if (this.document.getElementById("font-size-select")) return;
    var selectDiv = this.document.createElement("div");
    selectDiv.id = "font-size-select";
    selectDiv.classList.add("medium-editor-dropdown");
    var inputElem = this.document.createElement("input");
    inputElem.classList.add("input-font-size");
    inputElem.setAttribute("type", "number");
    inputElem.setAttribute("max", 100);
    inputElem.setAttribute("min", 0);
    inputElem.value = this.currentSize;
    var parentElem = this.button.parentElement;
    selectDiv.appendChild(inputElem);

    var incDecDiv = this.document.createElement("div");
    incDecDiv.classList.add("increase-decrease-button", "fs");
    var decSpan = this.document.createElement("span");
    decSpan.setAttribute("id", "decrease-control");
    decSpan.innerHTML =
      "<img id='decrease-arrow' src='/assets/icons/chevron-down.svg' />";
    var incSpan = this.document.createElement("span");
    incSpan.setAttribute("id", "increase-control");
    incSpan.innerHTML =
      "<img id='increase-arrow' src='/assets/icons/chevron-up.svg' />";
    incDecDiv.appendChild(incSpan);
    incDecDiv.appendChild(decSpan);
    selectDiv.appendChild(incDecDiv);

    parentElem.appendChild(selectDiv);
    this.inputElem = inputElem;
  },
  addEventListeners: function () {
    var self = this;
    var decreaseIncreaseButton = self.document.getElementsByClassName(
      "increase-decrease-button"
    )[0];
    self.on(self.inputElem, "keydown", self.handleKeyEnter.bind(self));
    self.on(
      decreaseIncreaseButton,
      "mousedown",
      self.handleIncreaseDecreaseAction.bind(self)
    );
  },
  saveSelection: function () {
    var self = this;
    var range = window.getSelection().getRangeAt(0);
    if (typeof range === "undefined") return;
    self.updateSavedRange(range);
    self.setCurrentSize();
  },
  handleIncreaseDecreaseAction: function (event) {
    console.log(event)
    event.preventDefault();
    event.stopPropagation();
    if (
      ["decrease-control", "decrease-arrow"].includes(event.target.id) ||
      event.code === "ArrowDown"
    ) {
      this.inputElem.value--;
    } else if (
      ["increase-control", "increase-arrow"].includes(event.target.id) ||
      event.code === "ArrowUp"
    ) {
      this.inputElem.value++;
    }

    this.selectedSize = this.inputElem.value;
    this.button.querySelector(".button-selected-size").innerText =
      this.inputElem.value;
    if (event.target.id) {
      this.handleSelection();
    } else {
      var range = this.createRangeFromSelection();
      this.handleSelection({ enterKeyEvent: true, range: range });
    }
  },
  updateCurrentSize: function () {
    this.button.querySelector(".button-selected-size").innerText =
      this.currentSize;
    if (this.inputElem) {
      this.inputElem.value = this.currentSize;
    }
  },
});
