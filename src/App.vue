<template>
  <div id="app">
    <div style="display: flex">
      <div style="border-right: 1px solid #333; width: 500px">
        <h1>Tiltle</h1>
        <medium-editor
          ref="title"
          :text="title"
          :options="options()"
          custom-tag="div"
          @edit="updateTitle"
        />
      </div>
      <div style="width: 400px">
        <code>{{ title }}</code>
      </div>
    </div>
    <hr />
    <div style="display: flex">
      <div style="border-right: 1px solid #333; width: 500px">
        <h1>Description</h1>
        <medium-editor
          ref="description"
          :text="description"
          :options="options()"
          custom-tag="div"
          @edit="updateDescription"
        />
      </div>
      <div style="width: 400px">
        <code>{{ description }}</code>
      </div>
    </div>
    <hr />
    <div style="display: flex">
      <div style="border-right: 1px solid #333; width: 500px">
        <h1>Button</h1>
        <medium-editor
          ref="button"
          :text="button"
          :options="options()"
          custom-tag="div"
          @edit="updateButton"
        />
      </div>
      <div style="width: 400px">
        <code>{{ button }}</code>
      </div>
    </div>
    <hr />
    <label>
      Link color
      <input v-model="linkColor" type="color" @input="paintLinks" />
    </label>
    <br />
    <button @click="reset">Reset</button>
  </div>
</template>

<script>
import "medium-editor/dist/css/medium-editor.css";
import "medium-editor/dist/css/themes/mani.css";
import editor from "vue2-medium-editor";
import FontSizeButton from "./FontSizeButton";
import FontNameButton from "./FontNameButton";
import LineHeightButton from "./LineHeightButton";
import LinkForm from "./LinkForm";

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
    "medium-editor": editor,
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
      displayTitle: "",
      displayDescription: "",
      displayButton: "",
      key: 1,
    };
  },
  created() {
    this.paintLinks()
  },
  methods: {
    options() {
      return {
        extensions: {
          "font-size": new FontSizeButton(),
          "font-name": new FontNameButton(),
          "line-height": new LineHeightButton(),
          "link-form": new LinkForm(() => this.paintLinks()),
        },
        toolbar: {
          buttons: [
            "font-name",
            "font-size",
            "line-height",
            "bold",
            "italic",
            "underline",
            "anchor",
            "unorderedlist",
            "justifyLeft",
            "justifyCenter",
            "justifyRight",
            "removeFormat",
          ],
          static: true,
          sticky: true,
          align: "center",
          updateOnEmptySelection: true,
        },
        placeholder: {
          text: "Type your text ПРЯМО ТУТ!!!",
          hideOnClick: true,
        },
      };
    },
    updateTitle(operation) {
      // this.title = getTextWithFixedLinksColor(
      //   operation.api.origElements.innerHTML,
      //   this.linkColor
      // );
    },
    updateDescription(operation) {
      this.description = getTextWithFixedLinksColor(
        operation.api.origElements.innerHTML,
        this.linkColor
      );
    },
    updateButton(operation) {
      this.button = getTextWithFixedLinksColor(
        operation.api.origElements.innerHTML,
        this.linkColor
      );
    },
    reset() {
      this.title = this.$refs.title.$el.innerHTML;
      this.description = this.$refs.description.$el.innerHTML;
      this.button = this.$refs.button.$el.innerHTML;
      this.key = this.key + 1;
    },
    paintLinks() {
      this.title = getTextWithFixedLinksColor(this.title, this.linkColor);
      this.description = getTextWithFixedLinksColor(
        this.description,
        this.linkColor
      );
      this.button = getTextWithFixedLinksColor(this.button, this.linkColor);
    },
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
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
