<template>
  <div id="app" class="container">
    <h1 class="my-5 display fs-1 fw-bold text-center">Medium editor</h1>
    <div class="row border-bottom mb-3">
      <div class="col-4">
        <h2>Title</h2>
      </div>
      <div class="col-4">
        <Editor v-model="title" @input="title = fixLinks($event)" />
      </div>
      <div class="col-4">
        <code>{{ title }}</code>
      </div>
    </div>
    <div class="row border-bottom mb-3">
      <div class="col-4">
        <h2>Description</h2>
      </div>
      <div class="col-4">
        <Editor v-model="description" @input="description = fixLinks($event)" />
      </div>
      <div class="col-4">
        <code>{{ description }}</code>
      </div>
    </div>
    <div class="row border-bottom mb-3">
      <div class="col-4">
        <h2>Button</h2>
      </div>
      <div class="col-4">
        <Editor v-model="button" @input="button = fixLinks($event)" />
      </div>
      <div class="col-4">
        <code>{{ button }}</code>
      </div>
    </div>
    <div class="row">
      <div class="col-2">
        <label for="color" class="form-label">Link color</label>
        <input
          id="color"
          v-model="linkColor"
          class="form-control"
          style="min-height: 64px"
          type="color"
          @input="paintLinks"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Editor from "./Editor";

const getTextWithFixedLinksColor = (text, color) => {
  const doc = new DOMParser().parseFromString(text, "text/html");
  const links = Array.from(doc.querySelectorAll("a"));
  links.forEach((link) => {
    link.style.color = color;
  });
  return doc.body.innerHTML;
};

export default {
  name: "App",
  components: {
    Editor,
  },
  data() {
    return {
      linkColor: "#00ff00",
      title: `<p style="font-size: 36px;">Click <span style="font-size: 27px;">here</span>&nbsp; to edit it or <span style="color: rgb(240, 50, 230);">highlight</span> the text to style it</p>`,
      description: `
      <p>The iconic ASICS Tiger GEL-Lyte III was originally released in 1990.</p>
      <p>Having over two decades of performance heritage, it offers fine design detailing and a padded split tongue to eliminate tongue movement, built on a sleek silhouette.</p>
      <p>It comes as no surprise the Gel-Lyte III is a fast growing popular choice for sneaker enthusiasts all over the world.</p>
      `,
      button: `<a href="#" class="button">Shop $ 242</a>`,
      cs: `Visual Studio Code is a lightweight but powerful source code editor which runs on your desktop and is available for Windows, macOS and Linux. It comes with built-in support for JavaScript, TypeScript and Node.js and has a rich ecosystem of extensions for other languages (such as C++, C#, Java, Python, PHP, Go) and runtimes (such as .NET and Unity). Begin your journey with VS Code with these introductory videos.`,
    };
  },
  computed: {},
  created() {
    this.paintLinks();
  },
  // mounted() {
  //   this.titleEditor = new MediumEditor(this.$refs.title, this.options());
  //   this.titleInput = () =>
  //     this.updateTitle(this.titleEditor.origElements.innerHTML);
  //   this.titleEditor.subscribe("editableInput", this.titleInput);
  //   this.descriptionEditor = new MediumEditor(
  //     this.$refs.description,
  //     this.options()
  //   );
  //   this.descriptionInput = () =>
  //     this.updateDescription(this.descriptionEditor.origElements.innerHTML);
  //   this.descriptionEditor.subscribe("editableInput", this.descriptionInput);
  //   this.buttonEditor = new MediumEditor(this.$refs.button, this.options());
  //   this.buttonInput = () =>
  //     (this.button = getTextWithFixedLinksColor(
  //       this.buttonEditor.origElements.innerHTML,
  //       this.linkColor
  //     ));
  //   this.buttonEditor.subscribe("editableInput", this.buttonInput);
  // },
  // beforeDestroy() {
  //   this.titleEditor.unsubscribe("editableInput", this.titleInput);
  //   this.descriptionEditor.unsubscribe("editableInput", this.descriptionInput);
  //   this.buttonEditor.unsubscribe("editableInput", this.buttonInput);
  // },
  methods: {
    // options() {
    //   return {
    //     extensions: {
    //       "font-size": new FontSizeButton(),
    //       "font-name": new FontNameButton(),
    //       "line-height": new LineHeightButton(),
    //       "link-form": new LinkForm(() => this.paintLinks()),
    //     },
    //     toolbar: {
    //       buttons: [
    //         "font-name",
    //         "font-size",
    //         "line-height",
    //         "bold",
    //         "italic",
    //         "underline",
    //         "anchor",
    //         "unorderedlist",
    //         "justifyLeft",
    //         "justifyCenter",
    //         "justifyRight",
    //         "removeFormat",
    //       ],
    //       static: true,
    //       sticky1: true,
    //       align: "center",
    //       positionStaticToolbar(container) {
    //         const scrollTop =
    //           (this.document.documentElement &&
    //             this.document.documentElement.scrollTop) ||
    //           this.document.body.scrollTop;
    //         const toolbarElement = this.getToolbarElement();
    //         const containerRect = container.getBoundingClientRect();
    //         const toolbarHeight = toolbarElement.offsetHeight;
    //         toolbarElement.style.top = `${
    //           containerRect.top + scrollTop - toolbarHeight - 20
    //         }px`;
    //       },
    //       updateOnEmptySelection: true,
    //     },
    //     placeholder: {
    //       text: "Type your text ПРЯМО ТУТ!!!",
    //       hideOnClick: true,
    //     },
    //   };
    // },
    fixLinks(value) {
      return getTextWithFixedLinksColor(value, this.linkColor);
    },
    // updateTitle(value) {
    //   const fixed = getTextWithFixedLinksColor(value, this.linkColor);
    //   if (fixed !== value) {
    //     const selection = this.titleEditor.exportSelection();
    //     this.titleEditor.setContent(fixed, 0);
    //     this.$refs.title.innerHTML = fixed;
    //     this.titleEditor.importSelection(selection);
    //   }
    //   this.title = fixed;
    // },
    // updateDescription(value) {
    //   const fixed = getTextWithFixedLinksColor(value, this.linkColor);
    //   if (fixed !== value) {
    //     const selection = this.descriptionEditor.exportSelection();
    //     this.descriptionEditor.setContent(fixed, 0);
    //     this.$refs.description.innerHTML = fixed;
    //     this.descriptionEditor.importSelection(selection);
    //   }
    //   this.description = fixed;
    // },
    // updateButton(operation) {
    //   this.button = getTextWithFixedLinksColor(
    //     operation.api.origElements.innerHTML,
    //     this.linkColor
    //   );
    // },
    paintLinks() {
      this.cs = this.fixLinks(this.cs);
      this.title = this.fixLinks(this.title);
      this.description = this.fixLinks(this.description);
      this.button = this.fixLinks(this.button);
    },
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.font-picker-widget {
  .font-name {
    background-color: transparent;
    padding: 4px;
    outline: none;
    border: none;
    &:focus,
    &:focus-visible {
      outline: 1px solid white;
    }
    &:hover {
      outline: 1px solid white;
    }
    & > * {
      margin: 4px;
      outline: none;
      border: none;
    }
  }
}
.size-picker-widget {
  display: flex;
  flex-direction: row;
  align-items: center;
  .display {
    padding: 4px;
    width: 40px;
    border: none;
    background-color: transparent;
    color: inherit;
    margin-right: 2px;
    &:focus,
    &:focus-visible {
      outline: 1px solid white;
    }
    &:hover {
      outline: 1px solid white;
    }
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
  min-height: unset;
}

.medium-editor-placeholder:after {
  text-align: center;
  left: 0;
  right: 0;
}
</style>
<style>
.button {
  background-color: #ccc;
  padding: 6px;
  border: 1px solid #ccc;
  display: inline-flex;
  align-items: center;
}
</style>
